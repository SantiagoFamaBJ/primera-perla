# Primera Perla · Densell White

Landing para pauta en Meta: odontólogos piden una jeringa de Densell White sin cargo.

- Web: `/`
- Admin: `/ADMIN` (contraseña en `ADMIN_PASSWORD`)

## Puesta en marcha

1. Supabase → SQL Editor → pegar y correr `supabase/schema.sql` (solo crea tablas nuevas `pp_`).
2. Copiar `.env.example` a `.env.local` y completar la service role key.
3. `npm install` y después `npm run dev` → http://localhost:3000

## Variables en Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

## Qué se edita desde /ADMIN

Inscripciones (estado, notas, descarga a Excel), cupo, fecha de cierre, cierre manual, ID del Pixel,
web de destino de los botones, WhatsApp, textos del hero, concentraciones, características,
productos, casos clínicos (con subida de fotos), preguntas frecuentes, razón social y CUIT.
