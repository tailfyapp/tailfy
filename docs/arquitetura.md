# Tailfy - Decisões de Arquitetura

## Stack Tecnológica

| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| Framework | Next.js | 16 | SSR/SSG para SEO, App Router, React Server Components |
| Linguagem | TypeScript | 5 | Tipagem forte, menos bugs |
| Banco | Supabase (PostgreSQL) | - | Storage, RLS (futuro), tempo real |
| ORM | Prisma | 7 | Schema declarativo, migrations, tipagem automática |
| Auth | NextAuth.js | 5 (beta) | Credentials provider, JWT strategy, middleware integration |
| Storage | Supabase Storage | - | Upload de imagens com CDN integrada |
| Estilização | Tailwind CSS | 4 | Mobile-first, design system consistente |
| Validação | Zod | 4 | Schemas compartilhados client/server |
| Notificações | sonner | - | Toast notifications leves |
| Datas | date-fns | - | Manipulação de datas imutável |

## Decisões Importantes

### Prisma 7 com Driver Adapter
O Prisma 7 não aceita mais conexão direta via `DATABASE_URL` no constructor. É obrigatório usar um `adapter` (ou Prisma Accelerate). Usamos `@prisma/adapter-pg` com `pg.Pool`.

```typescript
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
new PrismaClient({ adapter });
```

### Prisma Client Output
O client é gerado em `src/generated/prisma/`. Imports devem apontar para `@/generated/prisma/client` (o diretório não tem `index.ts`).

### NextAuth.js v5 — Config Split
O middleware roda no Edge Runtime, que não suporta Node.js modules (como Prisma). Solução: separar a config em dois arquivos:
- `auth.config.ts` — config leve (pages, callbacks), Edge-compatible, sem Prisma
- `auth.ts` — config completa com Credentials provider e Prisma

O middleware importa apenas `auth.config.ts`. As Server Actions e API routes importam `auth.ts`.

### JWT com userId e profileId
O token JWT inclui `userId` e `profileId` para evitar queries extras ao verificar ownership nas Server Actions. O profileId é injetado no callback `jwt` e propagado para a `session`.

### Segurança no Nível da Aplicação
RLS no PostgreSQL está adiado para a Fase 3. Toda verificação de ownership é feita nas Server Actions comparando `profileId` da sessão com o `profileId` do recurso. Todas as mutations verificam que o recurso pertence ao usuário autenticado.

### Slug como Identificador Público
Cada perfil tem um `slug` único usado na URL (`/petshop-do-joao`). Gerado automaticamente no signup a partir do nome do negócio, com verificação de unicidade.

### Preço como Faixa (min/max)
Serviços pet têm preços que variam por porte do animal. O modelo usa `priceMin` e `priceMax` (Decimal) para representar faixas.

### openingHours como JSON
Horários de funcionamento armazenados como JSON flexível no perfil. Permite horários diferentes por dia e dias fechados (`null`).

### Sistema de Agendamento
- Slots gerados em intervalos de 30 minutos dentro dos `openingHours`
- Conflitos detectados por sobreposição temporal (ignora CANCELLED e NO_SHOW)
- Booking público cria Client (ou encontra por phone) + Appointment com status PENDING
- WhatsApp mantido como opção secundária (complementar, não substituído)
- Status flow: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED

### Upload de Imagens
- Supabase Storage com bucket `images` público
- Inicialização lazy do client Supabase (evita erro de build sem env vars)
- Limites: avatar 2MB, cover/gallery 5MB
- Formatos: JPEG, PNG, WebP
- Naming: `{folder}/{userId}/{timestamp}-{hex}.{ext}`

## Design System
Resumo: Clean SaaS + Soft UI. Cards `rounded-2xl`, botões `rounded-full`, cor primária `purple-600`, fundo `gray-50`.

Componentes UI: Button, Card, Badge, Input, Textarea, Select, Modal, Pagination, EmptyState, Toast.
