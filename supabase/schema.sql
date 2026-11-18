-- Primera Perla · Densell White
-- Crea tablas NUEVAS con prefijo pp_. No borra ni modifica nada existente.
-- Correr en Supabase → SQL Editor. Se puede correr más de una vez sin romper nada.

BEGIN;

CREATE TABLE IF NOT EXISTS pp_inscripciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmada_at timestamptz,
  estado text NOT NULL DEFAULT 'parcial',
  nombre text, matricula text, matricula_norm text, email text, whatsapp text, concentracion text,
  tipo_matricula text, provincia_matricula text, especialidad text, consultorio text, localidad text,
  provincia text, instagram text, marca_actual text, blanqueamientos_mes text,
  acepta_datos boolean DEFAULT false, acepta_bases boolean DEFAULT false, acepta_novedades boolean DEFAULT false,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text, fbclid text,
  landing_url text, user_agent text, notas text
);

CREATE INDEX IF NOT EXISTS pp_inscripciones_estado_idx ON pp_inscripciones (estado);
CREATE INDEX IF NOT EXISTS pp_inscripciones_matricula_idx ON pp_inscripciones (matricula_norm);

CREATE TABLE IF NOT EXISTS pp_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS activado y SIN políticas: nadie entra con la anon key.
-- La web accede solo desde el servidor con la service role key.
ALTER TABLE pp_inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pp_config ENABLE ROW LEVEL SECURITY;

COMMIT;

BEGIN;

-- Confirma una inscripción (paso 2) controlando cupo y matrícula repetida
-- en una sola operación, para que no se pase de 40 aunque entren varios a la vez.
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
      AND estado IN ('pendiente','aprobada','enviada','caso_recibido')
  ) THEN RETURN 'duplicada'; END IF;

  SELECT count(*) INTO v_total FROM pp_inscripciones
  WHERE estado IN ('pendiente','aprobada','enviada','caso_recibido');
  IF v_total >= p_cupo THEN RETURN 'cupo'; END IF;

  UPDATE pp_inscripciones SET
    tipo_matricula = p_datos->>'tipo_matricula',
    provincia_matricula = p_datos->>'provincia_matricula',
    especialidad = p_datos->>'especialidad',
    consultorio = p_datos->>'consultorio',
    localidad = p_datos->>'localidad',
    provincia = p_datos->>'provincia',
    instagram = p_datos->>'instagram',
    marca_actual = p_datos->>'marca_actual',
    blanqueamientos_mes = p_datos->>'blanqueamientos_mes',
    acepta_bases = coalesce((p_datos->>'acepta_bases')::boolean, false),
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

-- Bucket público para las fotos de casos clínicos (se suben desde /ADMIN).
INSERT INTO storage.buckets (id, name, public)
VALUES ('pp-casos', 'pp-casos', true)
ON CONFLICT (id) DO NOTHING;
