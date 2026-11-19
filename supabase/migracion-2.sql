-- Migración 2 · Muestras Densell White
-- Solo AGREGA columnas y actualiza la función de confirmación. No borra datos.
-- Correr en Supabase → SQL Editor. Se puede correr más de una vez.

BEGIN;

-- Datos de envío y autorización opcional de publicación
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS domicilio text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS codigo_postal text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS acepta_publicacion boolean DEFAULT false;

-- Origen de campaña (Meta) y datos para Conversions API
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS campaign_id text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS adset_id text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS ad_id text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS fbp text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS fbc text;

-- Seguimiento comercial
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS aprobada_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS rechazada_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS enviada_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS entregada_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS caso_recibido_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS cupon_codigo text;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS cupon_entregado_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS cupon_usado_at timestamptz;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS compra_monto numeric;
ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS compra_detalle text;

CREATE INDEX IF NOT EXISTS pp_inscripciones_provincia_idx ON pp_inscripciones (provincia);
CREATE INDEX IF NOT EXISTS pp_inscripciones_concentracion_idx ON pp_inscripciones (concentracion);

COMMIT;

BEGIN;

-- Guarda la fecha de cada cambio de estado (sirve para medir tiempos y para integraciones)
CREATE OR REPLACE FUNCTION pp_marcar_estado()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.estado IS DISTINCT FROM OLD.estado THEN
    IF NEW.estado = 'aprobada' AND NEW.aprobada_at IS NULL THEN NEW.aprobada_at := now(); END IF;
    IF NEW.estado = 'rechazada' AND NEW.rechazada_at IS NULL THEN NEW.rechazada_at := now(); END IF;
    IF NEW.estado = 'enviada' AND NEW.enviada_at IS NULL THEN NEW.enviada_at := now(); END IF;
    IF NEW.estado = 'entregada' AND NEW.entregada_at IS NULL THEN NEW.entregada_at := now(); END IF;
    IF NEW.estado = 'caso_recibido' AND NEW.caso_recibido_at IS NULL THEN NEW.caso_recibido_at := now(); END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pp_marcar_estado_trg ON pp_inscripciones;
CREATE TRIGGER pp_marcar_estado_trg BEFORE UPDATE ON pp_inscripciones
FOR EACH ROW EXECUTE FUNCTION pp_marcar_estado();

COMMIT;

BEGIN;

CREATE OR REPLACE FUNCTION pp_confirmar(p_id uuid, p_datos jsonb, p_cupo int)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mat text;
  v_estado text;
  v_total int;
BEGIN
  PERFORM pg_advisory_xact_lock(424242);

  SELECT matricula_norm, estado INTO v_mat, v_estado FROM pp_inscripciones WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RETURN 'no_existe'; END IF;
  IF v_estado <> 'parcial' THEN RETURN 'ok'; END IF;

  IF EXISTS (
    SELECT 1 FROM pp_inscripciones
    WHERE matricula_norm = v_mat AND id <> p_id
      AND estado IN ('pendiente','aprobada','enviada','entregada','caso_recibido')
  ) THEN RETURN 'duplicada'; END IF;

  SELECT count(*) INTO v_total FROM pp_inscripciones
  WHERE estado IN ('pendiente','aprobada','enviada','entregada','caso_recibido');
  IF v_total >= p_cupo THEN RETURN 'cupo'; END IF;

  UPDATE pp_inscripciones SET
    domicilio = p_datos->>'domicilio',
    codigo_postal = p_datos->>'codigo_postal',
    localidad = p_datos->>'localidad',
    provincia = p_datos->>'provincia',
    tipo_matricula = p_datos->>'tipo_matricula',
    especialidad = p_datos->>'especialidad',
    marca_actual = p_datos->>'marca_actual',
    blanqueamientos_mes = p_datos->>'blanqueamientos_mes',
    acepta_bases = coalesce((p_datos->>'acepta_bases')::boolean, false),
    acepta_publicacion = coalesce((p_datos->>'acepta_publicacion')::boolean, false),
    acepta_novedades = coalesce((p_datos->>'acepta_novedades')::boolean, false),
    estado = 'pendiente',
    confirmada_at = now(),
    updated_at = now()
  WHERE id = p_id;

  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION pp_confirmar(uuid, jsonb, int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION pp_confirmar(uuid, jsonb, int) TO service_role;

COMMIT;
