# Tailfy - Progresso de Desenvolvimento

## Fase 1 - Vitrine Pública

### Concluído (2026-02-14)

#### Infraestrutura
- [x] Projeto Next.js 16 criado (App Router, TypeScript, Tailwind 4)
- [x] Prisma 7 configurado com adapter pg para Supabase
- [x] Schema com 8 models (User, Profile, Service, GalleryImage, Client, Pet, Appointment) + 2 enums
- [x] Seed com 3 perfis de exemplo populados no banco
- [x] Build passando sem erros

#### Componentes UI (`src/components/ui/`)
- [x] Button — variantes primary, secondary, ghost, whatsapp
- [x] Card — com variante highlight (gradiente)
- [x] Badge — variantes default, success, warning, info

#### Componentes Storefront (`src/components/storefront/`)
- [x] ProfileHeader — cover, avatar, nome, bio, localização
- [x] ContactInfo — telefone, Instagram, endereço
- [x] ServiceList + ServiceCard — lista de serviços com preço e duração
- [x] Gallery — grid de imagens com hover caption
- [x] OpeningHours — horários com indicador "Aberto agora"
- [x] CtaButton — botão WhatsApp fixo (mobile) + desktop

#### Páginas
- [x] `/` — Landing page marketing
- [x] `/[slug]` — Vitrine pública com SSR, ISR 60s, SEO dinâmico
- [x] `/[slug]/loading.tsx` — Skeleton loading
- [x] `/[slug]/not-found.tsx` — Slug não encontrado
- [x] `not-found.tsx` — 404 global

#### SEO & Performance
- [x] `generateMetadata()` dinâmico (título, descrição, Open Graph)
- [x] `generateStaticParams()` para ISR
- [x] Imagens otimizadas via `next/image`
- [x] Revalidação a cada 60 segundos

---

## Fase 2 - Dashboard & Auth

### Concluído (2026-02-14)

#### Sub-fase 2.1 — Auth Foundation
- [x] NextAuth.js v5 instalado e configurado (Credentials + JWT)
- [x] Config split: `auth.config.ts` (Edge) + `auth.ts` (Node)
- [x] Auth helpers: `getCurrentUser()`, `requireAuth()`, `getUserProfile()`
- [x] Middleware protegendo `/dashboard/*` e redirecionando auth pages
- [x] Página de login (`/login`) com email + password
- [x] Página de signup (`/signup`) com criação de User + Profile + slug automático
- [x] Layout auth: card centralizado, fundo gradiente purple
- [x] SessionProvider no root layout
- [x] Seed atualizado com hashes bcrypt reais (senha: `123456`)
- [x] Validators: `loginSchema`, `signupSchema`
- [x] Componente Input reutilizável
- [x] Home page atualizada com links para signup/login
- [x] Type augmentation do NextAuth (`next-auth.d.ts`)

#### Sub-fase 2.2 — Dashboard Shell
- [x] Layout dashboard com sidebar (256px) + topbar
- [x] Sidebar com navegação: Início, Perfil, Serviços, Galeria, Clientes, Agendamentos
- [x] Sidebar responsiva: drawer slide-over no mobile
- [x] Topbar com nome do negócio, link "Ver vitrine", dropdown logout
- [x] Home dashboard com stats (serviços, clientes, agendamentos) + quick actions
- [x] Página de perfil com formulário editável + editor de horários (7 dias)
- [x] Server Action `updateProfileAction` com verificação de slug único
- [x] Server Action `updateOpeningHoursAction`
- [x] CRUD completo de serviços (criar, editar, deletar, toggle ativo)
- [x] Página de galeria com add/delete via URL manual
- [x] Componentes UI: Modal, Textarea, Select, Toast (sonner), EmptyState
- [x] Animações CSS: slideUp (mobile modal), fadeIn (desktop modal)

#### Sub-fase 2.3 — Clientes & Pets
- [x] Lista de clientes com busca por nome/telefone/email
- [x] Paginação (20 por página)
- [x] Formulário de novo cliente
- [x] Página de detalhe do cliente: info editável, pets, histórico de agendamentos
- [x] CRUD de pets com nome, raça, porte, observações
- [x] Server Actions com verificação de ownership (via client → profileId)
- [x] Componentes: DataTable, Pagination, ClientSearch
- [x] Validators: `clientSchema`, `petSchema`

#### Sub-fase 2.4 — Sistema de Agendamento
- [x] Visualização semanal com navegação (semana anterior/próxima)
- [x] Filtro por status (Todos, Pendente, Confirmado, Em andamento, Concluído, Cancelado)
- [x] Criar agendamento: selecionar cliente, serviço, data, slot de horário
- [x] Cálculo de slots disponíveis (30min, baseado em openingHours, filtra conflitos)
- [x] Appointment card com status badge colorido + ações rápidas (alterar status)
- [x] Transições de status: PENDING→CONFIRMED→IN_PROGRESS→COMPLETED
- [x] Página pública de booking multi-step (`/[slug]/agendar`)
- [x] Booking público: cria Client (ou encontra por phone) + Appointment PENDING
- [x] CTA na vitrine atualizado: "Agendar online" (primary) + "WhatsApp" (secondary)
- [x] Validators: `appointmentSchema`, `publicBookingSchema`
- [x] date-fns para manipulação de datas e formatação pt-BR

#### Sub-fase 2.5 — Upload de Imagens
- [x] Supabase Storage integrado (bucket `images` público)
- [x] API route POST `/api/upload` com validação de auth + tipo + tamanho
- [x] API route PATCH `/api/upload/profile` para atualizar avatar/cover
- [x] Componente ImageUploader (drag-and-drop + progresso)
- [x] ProfileImageUpload com avatar + cover upload integrados
- [x] GalleryUploader com upload direto + delete
- [x] Limites: avatar 2MB, cover/gallery 5MB (JPEG, PNG, WebP)
- [x] Inicialização lazy do Supabase client (evita erro de build)
- [x] `next.config.ts` atualizado com `*.supabase.co` em remotePatterns

### Pendente
- [ ] Testes manuais de responsividade completa
- [ ] Lighthouse audit
- [ ] Deploy na Vercel
- [ ] Re-seed do banco após atualização do seed.ts
