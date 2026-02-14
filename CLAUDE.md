# Tailfy - Contexto do Projeto

## O que é
SaaS para profissionais do mercado Pet. Link-na-bio com superpoderes: vitrine pública com serviços, portfólio, horários, CTA WhatsApp + agendamento online.

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Banco:** Supabase (PostgreSQL) via Prisma 7 + `@prisma/adapter-pg`
- **Auth:** NextAuth.js v5 (beta) com Credentials provider, JWT strategy
- **Storage:** Supabase Storage para upload de imagens
- **Estilização:** Tailwind CSS 4
- **Validação:** Zod 4
- **Ícones:** lucide-react
- **Notificações:** sonner (toast)
- **Datas:** date-fns
- **Deploy:** Vercel

## Estrutura principal
```
src/
  app/
    page.tsx                          # Landing page marketing
    [slug]/page.tsx                   # Vitrine pública (SSR, ISR 60s)
    [slug]/agendar/page.tsx           # Booking público multi-step
    (auth)/login/page.tsx             # Login
    (auth)/signup/page.tsx            # Signup (cria User + Profile)
    (dashboard)/dashboard/            # Dashboard protegido
      page.tsx                        # Home com stats + quick actions
      perfil/page.tsx                 # Edição de perfil + horários + upload
      servicos/page.tsx               # CRUD serviços
      galeria/page.tsx                # Upload/gestão de imagens
      clientes/page.tsx               # Lista com busca e paginação
      clientes/novo/page.tsx          # Formulário novo cliente
      clientes/[id]/page.tsx          # Detalhe + pets + histórico
      agendamentos/page.tsx           # Lista semanal + filtro status
      agendamentos/novo/page.tsx      # Criar agendamento
    api/auth/[...nextauth]/route.ts   # NextAuth handler
    api/upload/route.ts               # Upload de imagens
    api/upload/profile/route.ts       # Atualizar avatar/cover
  actions/                            # Server Actions
    auth.ts, profile.ts, services.ts, gallery.ts,
    clients.ts, pets.ts, appointments.ts
  components/
    ui/                               # Button, Card, Badge, Input, Textarea,
                                      # Select, Modal, Pagination, EmptyState, Toast
    storefront/                       # Vitrine pública + booking-form
    dashboard/                        # Sidebar, Topbar, Shell, Forms, etc.
  lib/
    auth.ts                           # NextAuth config com Credentials
    auth.config.ts                    # Config leve (sem Prisma, para middleware)
    auth-helpers.ts                   # getCurrentUser, requireAuth, getUserProfile
    prisma.ts                         # Singleton PrismaClient
    utils.ts                          # cn, formatPrice, formatDuration, etc.
    validators.ts                     # Schemas Zod (profile, service, client, pet, appointment, booking)
    availability.ts                   # Cálculo de slots disponíveis
    supabase-storage.ts               # Upload/delete de imagens
  types/
    index.ts                          # ProfileWithRelations, OpeningHours, ClientWithPets
    next-auth.d.ts                    # Augmentation do NextAuth (userId, profileId)
  middleware.ts                       # Protege /dashboard/*, redireciona auth pages
```

## Convenções
- **Prisma 7:** Requer `adapter` no constructor. Imports de `@/generated/prisma/client`
- **Seed:** Rodar com `npx prisma db seed` (usa `tsx` via prisma.config.ts). Senha padrão: `123456`
- **Tailwind 4:** Usa `bg-linear-to-r` (não `bg-gradient-to-r`), `@theme inline` no globals.css
- **Next.js 16:** `params` e `searchParams` são `Promise` nos Server Components (precisa `await`)
- **Middleware:** Next.js 16 deprecou middleware convention, mas funciona com `export default auth`
- **Auth:** Config split — `auth.config.ts` (leve, Edge-compatible) + `auth.ts` (com Prisma)
- **Server Actions:** Todas verificam ownership via `profileId` da sessão
- **Componentes UI:** Design system clean SaaS + Soft UI. Cards `rounded-2xl`, botões `rounded-full`, cor primária `purple-600`
- **Imagens externas:** Configuradas em `next.config.ts` (Unsplash + `*.supabase.co`)

## Fases do Projeto
- **Fase 1:** Vitrine pública `/[slug]` — CONCLUÍDA
- **Fase 2:** Dashboard + Auth + Agendamento + Upload — CONCLUÍDA
- **Fase 3:** Modo Quiosque

## Comandos úteis
```bash
npm run dev          # Dev server
npm run build        # Build produção
npx prisma db push   # Sync schema com banco
npx prisma db seed   # Popular banco com dados de exemplo (senha: 123456)
npx prisma generate  # Re-gerar client após mudar schema
npx prisma studio    # GUI do banco
```

## Variáveis de ambiente
```
DATABASE_URL=postgresql://...
AUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...  # Necessário para upload de imagens
```
