# Tailfy - Decisões de Arquitetura

## Stack Tecnológica

| Camada | Tecnologia | Versão | Justificativa |
|---|---|---|---|
| Framework | Next.js | 16 | SSR/SSG para SEO, App Router, React Server Components |
| Linguagem | TypeScript | 5 | Tipagem forte, menos bugs |
| Banco | Supabase (PostgreSQL) | - | Auth, Storage, RLS, tempo real |
| ORM | Prisma | 7 | Schema declarativo, migrations, tipagem automática |
| Estilização | Tailwind CSS | 4 | Mobile-first, design system consistente |
| Validação | Zod | 4 | Schemas compartilhados client/server |

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

### Slug como Identificador Público
Cada perfil tem um `slug` único usado na URL (`/petshop-do-joao`). Isso evita expor IDs internos e melhora SEO.

### Preço como Faixa (min/max)
Serviços pet têm preços que variam por porte do animal. O modelo usa `priceMin` e `priceMax` (Decimal) para representar faixas.

### openingHours como JSON
Horários de funcionamento armazenados como JSON flexível no perfil. Permite horários diferentes por dia e dias fechados (`null`).

### Tabelas Fase 2+ Criadas Antecipadamente
Models `Client`, `Pet` e `Appointment` já existem no schema/banco, mas sem lógica implementada. Isso evita migrations disruptivas na Fase 2.

## Design System
Documentação visual detalhada em `docs/escopo.md` e `instrucoes-ui.md` (raiz do projeto pai).

Resumo: Clean SaaS + Soft UI. Cards `rounded-2xl`, botões `rounded-full`, cor primária `purple-600`, fundo `gray-50`.
