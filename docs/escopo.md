# Tailfy - Escopo do Projeto

## Visão Geral
Tailfy é um SaaS para profissionais do mercado Pet (groomers, pet shops, veterinários). O produto oferece três pilares:

1. **Página Pública ("Vitrine")** — link-na-bio com superpoderes
2. **Dashboard** — gestão de clientes, pets e agendamentos
3. **Modo Quiosque** — check-in presencial no estabelecimento

## Público-alvo
- Groomers (tosadores/banhistas)
- Pet shops
- Clínicas veterinárias
- Profissionais autônomos do mercado pet

## Problema que resolve
- Profissionais pet não têm presença digital organizada
- Agendamentos por WhatsApp são desorganizados
- Falta de controle sobre no-shows e histórico de atendimentos
- Dificuldade de mostrar portfólio e serviços de forma profissional

## Proposta de valor
Uma URL única (ex: `tailfy.app/petshop-do-joao`) que funciona como cartão de visitas digital completo, com evolução para sistema de gestão.

## Fases de Desenvolvimento

### Fase 1 - Vitrine Pública (CONCLUÍDA)
- Página pública dinâmica por slug (`/[slug]`)
- Exibição de perfil, serviços, galeria, horários, contato
- CTA de agendamento via WhatsApp
- SEO otimizado (SSR, metadata dinâmica, Open Graph)
- Design mobile-first responsivo

### Fase 2 - Dashboard & Auth (PLANEJADA)
- Autenticação (Supabase Auth)
- Dashboard para gerenciar perfil, serviços e galeria
- Upload de imagens (Supabase Storage)
- Gestão de clientes e pets (CRUD)
- Sistema de agendamento real (substituir CTA WhatsApp)
- Row Level Security (RLS) para multi-tenancy

### Fase 3 - Modo Quiosque (FUTURA)
- Interface de check-in presencial
- Fila de atendimento em tempo real
- Status do pet para o tutor acompanhar
