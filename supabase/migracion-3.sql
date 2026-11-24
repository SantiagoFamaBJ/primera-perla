-- Migración 3 · Muestras Densell White
-- Forma de entrega (retiro / envío) y stock por concentración. Solo agrega; no borra datos.

BEGIN;

ALTER TABLE pp_inscripciones ADD COLUMN IF NOT EXISTS entrega text;

-- p_cupo ahora es el stock de la concentración elegida: cuenta solo las solicitudes de esa concentración.
CREATE OR REPLACE FUNCTION pp_confirmar(p_id uuid, p_datos jsonb, p_cupo int)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mat text;
  v_estado text;
  v_conc text;
  v_total int;
BEGIN
  PERFORM pg_advisory_xact_lock(424242);

  SELECT matricula_norm, estado, concentracion INTO v_mat, v_estado, v_conc FROM pp_inscripciones WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RETURN 'no_existe'; END IF;
  IF v_estado <> 'parcial' THEN RETURN 'ok'; END IF;

  IF EXISTS (
    SELECT 1 FROM pp_inscripciones
    WHERE matricula_norm = v_mat AND id <> p_id
      AND estado IN ('pendiente','aprobada','enviada','entregada','caso_recibido')
  ) THEN RETURN 'duplicada'; END IF;

  SELECT count(*) INTO v_total FROM pp_inscripciones
  WHERE concentracion = v_conc AND estado IN ('pendiente','aprobada','enviada','entregada','caso_recibido');
  IF v_total >= p_cupo THEN RETURN 'cupo'; END IF;

  UPDATE pp_inscripciones SET
    entrega = p_datos->>'entrega',
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
