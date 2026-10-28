# Lumina Estética

Sitio web de marketing para una clínica ficticia de medicina estética y cirugía
plástica en Lima, Perú. Marca, textos y datos de contacto son **de ejemplo**
(uso demostrativo).

Construido con [create-t3-app](https://create.t3.gg/):

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **tRPC v11** para la mutación del formulario de contacto
- **Prisma** (SQLite por defecto, Postgres/Neon en producción)
- **NextAuth v5** scaffolded (sin UI de login todavía — listo para añadir
  reservas online más adelante)
- **Zod** para validación de inputs
- Páginas de marketing estáticas y rápidas (`force-static`)

El sitio es mobile-first, accesible, con SEO en español, paleta neutra con
toques _rose gold_ y tipografías serif/sans premium.

---

## Estructura

```
.
├── prisma/
│   └── schema.prisma         # Modelo Lead + modelos NextAuth
├── public/                   # Favicon, robots.txt
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handlers
│   │   │   └── trpc/[trpc]/route.ts          # tRPC handler
│   │   ├── layout.tsx        # Fuentes, metadatos SEO, TRPCProvider
│   │   └── page.tsx          # Homepage (todas las secciones)
│   ├── components/           # UI de marketing (Header, Hero, ...)
│   ├── data/
│   │   └── content.ts        # ⭐ Único archivo de contenido editable
│   ├── env.js                # Validación de variables de entorno (t3-env)
│   ├── server/
│   │   ├── api/
│   │   │   ├── root.ts
│   │   │   ├── trpc.ts
│   │   │   └── routers/
│   │   │       └── contact.ts  # mutación createLead + schema zod
│   │   ├── auth/             # NextAuth config
│   │   └── db.ts             # Cliente Prisma
│   ├── styles/
│   │   └── globals.css       # Theme Tailwind v4 + utilidades
│   └── trpc/                 # Cliente/proveedor tRPC
└── package.json
```

Toda la copia editorial, promociones, testimonios, sedes, equipo médico, etc.
viven en `src/data/content.ts` — para cambiar la marca basta con editar ese
archivo.

---

## Requisitos

- Node.js **≥ 20**
- npm **≥ 10**

## Setup local (SQLite)

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno
cp .env.example .env
# .env trae por defecto DATABASE_URL="file:./db.sqlite" para desarrollo
# NextAuth: AUTH_SECRET se puede generar con `npx auth secret`
# No es necesario configurar AUTH_DISCORD_ID / AUTH_DISCORD_SECRET
# mientras no haya UI de login.

# 3. Crear la base de datos SQLite y aplicar el schema
npm run db:push

# 4. Levantar el entorno de desarrollo
npm run dev
# → http://localhost:3000
```

## Scripts disponibles

| Comando             | Descripción                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (Turbopack)                      |
| `npm run build`     | Build de producción                                     |
| `npm run start`     | Servir el build de producción                           |
| `npm run preview`   | Atajo: build + start                                    |
| `npm run lint`      | ESLint (`next/core-web-vitals`)                         |
| `npm run typecheck` | Verificación de tipos con `tsc --noEmit`                |
| `npm run db:push`   | Sincroniza el schema Prisma con la base (sin migración) |
| `npm run db:migrate`| `prisma migrate deploy` (producción)                    |
| `npm run db:generate` | `prisma migrate dev`                                  |
| `npm run db:studio` | Abre Prisma Studio                                      |

---

## Editar contenido

Todo el contenido del sitio está centralizado en
[`src/data/content.ts`](src/data/content.ts):

- `site` → marca, descripción, teléfono, WhatsApp, email, dirección, socials
- `nav` → links del header/footer
- `hero` → eyebrow, título, subtítulo, CTAs
- `trustBadges` → fila de insignias bajo el hero
- `categories` → tarjetas de categorías de tratamiento
- `featured` → grid de tratamientos destacados
- `promos` → promociones del mes
- `doctors` → equipo médico
- `technology` → tecnología usada en la clínica
- `testimonials` → reseñas (ficticias)
- `locations` → sedes con teléfono/WhatsApp/horarios
- `footer` → horario, texto legal

Al cambiar la marca real, también sustituye:

- el `favicon.svg` en `public/`
- las claves OG/SEO en `src/app/layout.tsx` si quieres un título distinto

---

## Formulario de contacto (tRPC + Prisma + zod)

El componente `src/components/ContactForm.tsx` envía los datos vía la mutación
`contact.createLead`. El router correspondiente
(`src/server/api/routers/contact.ts`) valida con zod y persiste un `Lead` en la
base de datos. Los errores de validación se devuelven como `zodError` y se
muestran por campo en el formulario.

Para ver los leads durante el desarrollo:

```bash
npm run db:studio
```

---

## Base de datos: SQLite ↔ Postgres (Neon)

El scaffold usa **SQLite** por defecto para desarrollo. Para producción se
recomienda **Postgres** (p. ej. [Neon](https://neon.tech),
[Vercel Postgres](https://vercel.com/storage/postgres) o
[Supabase](https://supabase.com)).

### Cambiar a Postgres

1. En `prisma/schema.prisma` cambia el provider:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. En `.env` / variables de Vercel usa un connection string de Postgres, por
   ejemplo Neon:

   ```
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
   ```

3. Genera la migración inicial y aplícala:

   ```bash
   npm run db:generate   # prisma migrate dev
   # en despliegues: npm run db:migrate   # prisma migrate deploy
   ```

> SQLite **no** funciona en el filesystem efímero de Vercel. Cualquier entorno
> hosteado necesita Postgres u otra base persistente.

---

## Variables de entorno

Ver `.env.example`. Resumen:

| Variable               | Requerida | Descripción                                                          |
| ---------------------- | --------- | -------------------------------------------------------------------- |
| `DATABASE_URL`         | ✅        | `file:./db.sqlite` en dev, Postgres URL en prod                      |
| `AUTH_SECRET`          | prod      | `npx auth secret`. Opcional en dev.                                  |
| `AUTH_DISCORD_ID`      | ❌        | Solo si se habilita login con Discord. El sitio no monta UI de login.|
| `AUTH_DISCORD_SECRET`  | ❌        | Idem.                                                                |

La validación de env se hace con `@t3-oss/env-nextjs` (`src/env.js`). Puedes
saltarla temporalmente con `SKIP_ENV_VALIDATION=1`.

---

## Deploy a Vercel

1. **Importa el repo** en [vercel.com/new](https://vercel.com/new).
2. **Base de datos**: crea una base Postgres (Neon o Vercel Postgres) y copia
   la connection string.
3. **Variables de entorno** en el proyecto Vercel:
   - `DATABASE_URL` → tu Postgres URL
   - `AUTH_SECRET` → generado con `npx auth secret`
   - (Opcional) `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` cuando se añada login
4. **Build command**: por defecto `next build` funciona. El `postinstall`
   corre `prisma generate` automáticamente.
5. **Migraciones**: para aplicar migraciones en el deploy añade un paso
   `npm run db:migrate` (o encadénalo en el build command:
   `prisma migrate deploy && next build`).
6. **Dominios**: configura `www.tudominio.com` apuntando a Vercel.

> Las páginas de marketing se generan estáticamente (`force-static`), así que
> se sirven desde el CDN. La ruta `/api/trpc/*` corre como función server-side.

---

## Próximos pasos sugeridos

El scaffold ya trae tRPC, Prisma, NextAuth y zod, listos para extender con:

- UI de login (dashboard interno)
- Reserva online de citas (nuevo router `booking`, modelo `Appointment`)
- Panel admin para leads y agenda
- Integración con WhatsApp Business API para notificaciones

---

## Licencia

Proyecto de demostración. Marca "Lumina Estética", textos, promociones,
testimonios y datos de contacto son completamente ficticios.
