# Tailfy - Contexto do Projeto

## O que é
SaaS para profissionais do mercado Pet. Link-na-bio com superpoderes: vitrine pública com serviços, portfólio, horários e CTA WhatsApp.

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Banco:** Supabase (PostgreSQL) via Prisma 7 + `@prisma/adapter-pg`
- **Estilização:** Tailwind CSS 4
- **Validação:** Zod 4
- **Ícones:** lucide-react
- **Deploy:** Vercel

## Estrutura principal
```
src/
  app/
    page.tsx                   # Landing page marketing
    [slug]/page.tsx            # Vitrine pública (SSR, ISR 60s)
    (dashboard)/dashboard/     # Placeholder Fase 2
  components/
    ui/                        # Button, Card, Badge (genéricos)
    storefront/                # Componentes da vitrine pública
  lib/
    prisma.ts                  # Singleton PrismaClient com pg adapter
    utils.ts                   # cn, formatPrice, formatDuration, etc.
    validators.ts              # Schemas Zod
  types/index.ts
prisma/
  schema.prisma                # 8 models, 2 enums
  seed.ts                      # 3 perfis de exemplo
```

## Convenções
- **Prisma 7:** Requer `adapter` no constructor. Imports de `@/generated/prisma/client`
- **Seed:** Rodar com `npx prisma db seed` (usa `tsx` via prisma.config.ts)
- **Tailwind 4:** Usa `bg-linear-to-r` (não `bg-gradient-to-r`), `@theme inline` no globals.css
- **Next.js 16:** `params` é `Promise` nos Server Components (precisa `await params`)
- **Componentes UI:** Design system clean SaaS + Soft UI. Cards `rounded-2xl`, botões `rounded-full`, cor primária `purple-600`
- **Imagens externas:** Configuradas em `next.config.ts` (Unsplash permitido)

## Fases do Projeto
- **Fase 1 (atual):** Vitrine pública `/[slug]` — CONCLUÍDA
- **Fase 2:** Dashboard + Auth + Agendamento real
- **Fase 3:** Modo Quiosque

## Comandos úteis
```bash
npm run dev          # Dev server
npm run build        # Build produção
npx prisma db push   # Sync schema com banco
npx prisma db seed   # Popular banco com dados de exemplo
npx prisma generate  # Re-gerar client após mudar schema
npx prisma studio    # GUI do banco
```
