import "dotenv/config";
import pg from "pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const defaultPassword = await bcrypt.hash("123456", 12);
  // Limpar dados existentes
  await prisma.appointment.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.client.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.service.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Usuário 1 - Pet Shop do João
  const user1 = await prisma.user.create({
    data: {
      email: "joao@exemplo.com",
      password: defaultPassword,
      profile: {
        create: {
          slug: "petshop-do-joao",
          businessName: "Pet Shop do João",
          ownerName: "João Silva",
          bio: "Cuidando do seu melhor amigo com carinho e profissionalismo há mais de 10 anos. Especialista em tosa artística e banho terapêutico.",
          avatarUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
          coverUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=400&fit=crop",
          phone: "(11) 99999-1234",
          whatsapp: "5511999991234",
          instagram: "petshopdojoao",
          address: "Rua das Flores, 123 - Vila Mariana",
          city: "São Paulo",
          state: "SP",
          latitude: -23.5895,
          longitude: -46.6388,
          openingHours: {
            mon: { open: "08:00", close: "18:00" },
            tue: { open: "08:00", close: "18:00" },
            wed: { open: "08:00", close: "18:00" },
            thu: { open: "08:00", close: "18:00" },
            fri: { open: "08:00", close: "18:00" },
            sat: { open: "09:00", close: "14:00" },
            sun: null,
          },
          services: {
            create: [
              {
                name: "Banho",
                description: "Banho completo com shampoo neutro e condicionador. Inclui secagem e escovação.",
                priceMin: 50,
                priceMax: 90,
                duration: 60,
                sortOrder: 0,
              },
              {
                name: "Tosa Higiênica",
                description: "Tosa nas regiões íntimas, patas e focinho para manter a higiene do pet.",
                priceMin: 40,
                priceMax: 70,
                duration: 45,
                sortOrder: 1,
              },
              {
                name: "Banho + Tosa Completa",
                description: "Combo completo: banho, tosa na máquina ou tesoura, corte de unhas e limpeza de ouvidos.",
                priceMin: 80,
                priceMax: 150,
                duration: 120,
                sortOrder: 2,
              },
              {
                name: "Tosa Artística",
                description: "Tosa personalizada com acabamento especial. Consulte modelos disponíveis.",
                priceMin: 120,
                priceMax: 200,
                duration: 150,
                sortOrder: 3,
              },
              {
                name: "Hidratação de Pelos",
                description: "Tratamento profundo para pelos ressecados e sem brilho.",
                priceMin: 30,
                priceMax: 60,
                duration: 30,
                sortOrder: 4,
              },
            ],
          },
          gallery: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=600&fit=crop",
                caption: "Tosa artística em Poodle",
                sortOrder: 0,
              },
              {
                url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop",
                caption: "Golden Retriever após banho completo",
                sortOrder: 1,
              },
              {
                url: "https://images.unsplash.com/photo-1587559045816-8b0a54d1a8c3?w=600&h=600&fit=crop",
                caption: "Nosso espaço de banho",
                sortOrder: 2,
              },
              {
                url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop",
                caption: "Shih Tzu com laço especial",
                sortOrder: 3,
              },
            ],
          },
        },
      },
    },
  });

  // Usuário 2 - Patinhas & Cia
  const user2 = await prisma.user.create({
    data: {
      email: "maria@exemplo.com",
      password: defaultPassword,
      profile: {
        create: {
          slug: "patinhas-e-cia",
          businessName: "Patinhas & Cia",
          ownerName: "Maria Oliveira",
          bio: "Grooming premium para cães e gatos. Ambiente climatizado e equipe certificada. Seu pet merece o melhor!",
          avatarUrl: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=200&h=200&fit=crop",
          coverUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=400&fit=crop",
          phone: "(21) 98888-5678",
          whatsapp: "5521988885678",
          instagram: "patinhasecia",
          address: "Av. Brasil, 456 - Copacabana",
          city: "Rio de Janeiro",
          state: "RJ",
          latitude: -22.9711,
          longitude: -43.1863,
          openingHours: {
            mon: { open: "09:00", close: "19:00" },
            tue: { open: "09:00", close: "19:00" },
            wed: { open: "09:00", close: "19:00" },
            thu: { open: "09:00", close: "19:00" },
            fri: { open: "09:00", close: "19:00" },
            sat: { open: "10:00", close: "16:00" },
            sun: { open: "10:00", close: "14:00" },
          },
          services: {
            create: [
              {
                name: "Banho Premium",
                description: "Banho com produtos importados, secagem completa e perfume.",
                priceMin: 70,
                priceMax: 120,
                duration: 60,
                sortOrder: 0,
              },
              {
                name: "Tosa na Tesoura",
                description: "Tosa artesanal na tesoura para acabamento perfeito.",
                priceMin: 90,
                priceMax: 180,
                duration: 90,
                sortOrder: 1,
              },
              {
                name: "Spa Day",
                description: "Pacote completo: banho, tosa, hidratação, limpeza de ouvidos e corte de unhas.",
                priceMin: 150,
                priceMax: 250,
                duration: 180,
                sortOrder: 2,
              },
            ],
          },
          gallery: {
            create: [
              {
                url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop",
                caption: "Nossos clientes felizes",
                sortOrder: 0,
              },
              {
                url: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&h=600&fit=crop",
                caption: "Gato persa após grooming",
                sortOrder: 1,
              },
            ],
          },
        },
      },
    },
  });

  // Usuário 3 - AuAu Grooming
  const user3 = await prisma.user.create({
    data: {
      email: "carlos@exemplo.com",
      password: defaultPassword,
      profile: {
        create: {
          slug: "auau-grooming",
          businessName: "AuAu Grooming",
          ownerName: "Carlos Mendes",
          bio: "Groomer certificado com experiência internacional. Atendimento exclusivo e personalizado para cada pet.",
          avatarUrl: "https://images.unsplash.com/photo-1583337130417-13104dec14a2?w=200&h=200&fit=crop",
          phone: "(31) 97777-9012",
          whatsapp: "5531977779012",
          instagram: "auaugrooming",
          address: "Rua Sergipe, 789 - Savassi",
          city: "Belo Horizonte",
          state: "MG",
          openingHours: {
            mon: { open: "08:30", close: "17:30" },
            tue: { open: "08:30", close: "17:30" },
            wed: { open: "08:30", close: "17:30" },
            thu: { open: "08:30", close: "17:30" },
            fri: { open: "08:30", close: "17:30" },
            sat: null,
            sun: null,
          },
          services: {
            create: [
              {
                name: "Banho Completo",
                description: "Banho com secagem e finalização.",
                priceMin: 55,
                priceMax: 100,
                duration: 60,
                sortOrder: 0,
              },
              {
                name: "Tosa Breed Standard",
                description: "Tosa conforme o padrão da raça. Ideal para competições e exposições.",
                priceMin: 150,
                priceMax: 300,
                duration: 180,
                sortOrder: 1,
              },
            ],
          },
        },
      },
    },
  });

  console.log("Seed concluído!");
  console.log(`  - ${user1.email} → /petshop-do-joao`);
  console.log(`  - ${user2.email} → /patinhas-e-cia`);
  console.log(`  - ${user3.email} → /auau-grooming`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
