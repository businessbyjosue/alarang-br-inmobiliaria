# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto
Nombre: Alarang B.R.

Tipo de proyecto:
Sitio web inmobiliario premium y funcional para un agente real.

## Objetivo principal
Construir una web inmobiliaria profesional, premium, responsive y fácil de usar para Alarang B.R., donde se puedan mostrar propiedades y administrarlas de forma simple.

## Idioma y estilo de respuesta
- Responde siempre en español.
- Responde corto, claro y directo.
- No uses redundancias.
- No des explicaciones largas si no se piden.
- Usa lenguaje simple y entendible.
- Responde: directo, breve y claro.
- Solo da más detalle cuando sea necesario para evitar errores.
- Si una respuesta puede darse en pocas líneas, hazlo en pocas líneas.
- Evita meter teoría innecesaria.
- No adornes respuestas.
- No repitas lo mismo con otras palabras.

## Forma de trabajar
- Trabaja por pasos pequeños.
- Haz una cosa a la vez.
- Antes de cambios grandes, propon el plan breve.
- No rehagas archivos completos si solo hace falta editar una parte.
- Antes de instalar dependencias nuevas, pregunta primero.
- Prioriza orden, claridad, mantenimiento y facilidad de uso.
- Piensa primero en una arquitectura simple y escalable.
- Prioriza mobile-first.
- Prioriza buena experiencia de usuario.
- Prioriza ahorro de tokens.

## Requisitos del proyecto
- Mostrar propiedades con fotos, precio y descripción.
- Mostrar zona de la propiedad.
- Mostrar si la propiedad es de renta o venta.
- Tener filtros por precio, zona y tipo de operación.
- Tener botón principal de WhatsApp.
- Tener botón principal de Facebook.
- Tener botón de contacto por WhatsApp en cada propiedad.
- Tener panel admin simple para agregar, editar y eliminar propiedades sin complicaciones.
- Tener diseño premium, serio y profesional.
- Ser completamente responsive.

## Datos del cliente
- Marca: Alarang B.R.
- WhatsApp: 527712026857
- Facebook: https://www.facebook.com/share/1B6n82QjaY/?mibextid=wwXIfr

## Prioridades visuales
- Estilo premium.
- Imagen seria y confiable.
- Buena presentación de propiedades.
- Navegación simple.
- Diseño innovador, elegante y moderno.
- Paleta oficial (propuesta de identidad Claude Design):
  - Azul marino `#1B2A45` — primario
  - Bronce cálido `#B08D57` — acento
  - Hueso `#F3F1EC` — neutro claro
  - Carbón `#20242C` — neutro oscuro
- Tipografía: Montserrat (títulos y logotipo) + Inter (cuerpo).
- Logotipo: concepto "Cima" (vértice sobre línea de horizonte), en `components/Logo.tsx`.
- Radios de 4px (`rounded-sm`), no pastilla, para lectura editorial.

## Flujo sugerido
1. Definir estructura del proyecto. ✅
2. Proponer stack y arquitectura. ✅
3. Crear sistema visual y layout base. ✅
4. Crear listado de propiedades. ✅
5. Crear filtros. ✅
6. Crear vista de detalle de propiedad. ✅
7. Crear panel admin. ✅
8. Ajustar responsive y pulir experiencia. ✅
9. Identidad visual definitiva + categorías + captación de leads. ✅

## Regla importante
Si falta información, pregunta corto.
Si hay varias opciones, recomienda la mejor y explica breve.
Si una decisión afecta mucho el proyecto, avisa antes de ejecutarla.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Storage)
- Vercel (deploy)
- bcryptjs + jose (auth admin)

## Comandos
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run lint      # Lint
npx tsc --noEmit  # Type check

# Generar hash de contraseña para el admin:
node scripts/hash-password.js TU_CONTRASEÑA
```

## Variables de entorno requeridas (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SECRET=           # string aleatorio largo
ADMIN_PASSWORD_HASH=   # generado con scripts/hash-password.js

# Correo del formulario "Vende tu propiedad" (Resend)
RESEND_API_KEY=        # https://resend.com — plan gratis 3.000 correos/mes
EMAIL_TO=              # correo del administrador que recibe las solicitudes
EMAIL_FROM=            # remitente verificado; provisional: onboarding@resend.dev
```
Sin las tres variables de correo la solicitud igual se guarda en la base de datos;
solo no se envía la notificación.

## Arquitectura
```
app/
  page.tsx                  # Home: listado + filtros (?categoria&zona&min&max)
  propiedades/[id]/         # Vista detalle + mapa de la zona
  vende-tu-propiedad/
    page.tsx                # Landing del formulario de captación
    actions.ts              # Guarda en BD + notifica por correo
  admin/
    page.tsx                # Panel admin (protegido)
    solicitudes/page.tsx    # Solicitudes recibidas del formulario
    login/page.tsx          # Login admin
  api/auth/route.ts         # Login/logout API
components/                 # Componentes reutilizables
  Logo.tsx                  # Logotipo "Cima" (marca + wordmark)
  Filtros.tsx               # Filtros por categoría, zona y precio (URL)
  VenderForm.tsx            # Formulario "Vende tu propiedad"
lib/
  supabase.ts               # Cliente Supabase
  auth.ts                   # Session JWT (httpOnly cookie)
  types.ts                  # Tipos TypeScript + CATEGORIAS
  email.ts                  # Envío por Resend (HTTP, sin dependencias)
  whatsapp.ts               # Stub preparado para notificar por WhatsApp
proxy.ts                    # Protege rutas /admin/*
scripts/
  hash-password.js          # Genera hash bcrypt para contraseña admin
supabase/
  schema.sql                # Esquema de referencia
  migrations/               # Migraciones a ejecutar en el SQL Editor
```

## Categorías
`tipo_operacion` funciona como categoría con tres valores: `venta`, `renta`, `terreno`.
Se reutiliza la columna existente en vez de añadir una nueva. Las etiquetas
salen de `CATEGORIAS` en `lib/types.ts`.

## Auth admin
- Ruta `/admin/*` protegida por middleware con JWT en cookie httpOnly.
- La contraseña se guarda como hash bcrypt en variable de entorno.
- Sesión dura 8 horas.
- Login en `/admin/login`.
