import { PrismaClient, AccountType, BotCategory, BotStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@chatbot-platform.com' },
    update: {},
    create: {
      email: 'demo@chatbot-platform.com',
      passwordHash: hashedPassword,
      name: 'Demo User',
      company: 'Demo Company',
      accountType: AccountType.BUSINESS,
      emailVerified: true,
      scrapingCredits: 100,
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create demo bot
  const demoBot = await prisma.bot.upsert({
    where: { id: 'demo-bot-1' },
    update: {},
    create: {
      id: 'demo-bot-1',
      userId: demoUser.id,
      name: 'Assistente E-commerce',
      description: 'Bot di supporto clienti per e-commerce',
      category: BotCategory.ECOMMERCE,
      language: 'it',
      status: BotStatus.ACTIVE,
      config: {
        personality: {
          formality: 50,
          verbosity: 50,
          friendliness: 80,
        },
        behavior: {
          fallback: 'ask_clarification',
          confidenceThreshold: 0.7,
          contextMemory: 10,
        },
      },
      appearance: {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        position: 'bottom-right',
        welcomeMessage: 'Ciao! Come posso aiutarti oggi?',
      },
      integration: {
        allowedDomains: ['example.com'],
        cors: true,
      },
    },
  });

  console.log('✅ Created demo bot:', demoBot.name);

  // Create demo intents
  const intents = [
    {
      botId: demoBot.id,
      name: 'saluto',
      description: 'Risponde ai saluti dell\'utente',
      examples: ['Ciao', 'Salve', 'Buongiorno', 'Buonasera', 'Hey'],
      response: {
        type: 'text',
        content: 'Ciao! Come posso aiutarti oggi?',
      },
    },
    {
      botId: demoBot.id,
      name: 'tracciamento_ordine',
      description: 'Fornisce informazioni sul tracciamento ordini',
      examples: [
        'Dove è il mio ordine?',
        'Tracciamento ordine',
        'Voglio sapere dove si trova il mio pacco',
        'Tracking spedizione',
      ],
      response: {
        type: 'text',
        content: 'Per tracciare il tuo ordine, ho bisogno del numero d\'ordine. Puoi fornirmelo?',
      },
    },
    {
      botId: demoBot.id,
      name: 'resi',
      description: 'Informazioni sulla policy resi',
      examples: [
        'Come posso restituire un prodotto?',
        'Politica resi',
        'Voglio fare un reso',
        'Rimborso',
      ],
      response: {
        type: 'text',
        content: 'Accettiamo resi entro 30 giorni dall\'acquisto. Il prodotto deve essere nelle condizioni originali. Vuoi procedere con un reso?',
      },
    },
  ];

  for (const intent of intents) {
    await prisma.intent.create({
      data: intent,
    });
  }

  console.log(`✅ Created ${intents.length} demo intents`);

  // Create sample document
  await prisma.document.create({
    data: {
      botId: demoBot.id,
      title: 'FAQ E-commerce',
      content: `
# Domande Frequenti

## Spedizione
- Spediamo in tutta Italia entro 24-48 ore
- Spedizione gratuita per ordini superiori a €50

## Resi
- Accettiamo resi entro 30 giorni
- Rimborso completo per prodotti difettosi

## Pagamenti
- Accettiamo carte di credito, PayPal e bonifico
- Pagamento sicuro con crittografia SSL
      `,
      type: 'TXT',
      status: 'COMPLETED',
      chunks: 3,
    },
  });

  console.log('✅ Created sample document');
  console.log('🎉 Seeding completed successfully!');
  console.log('\n📝 Demo credentials:');
  console.log('   Email: demo@chatbot-platform.com');
  console.log('   Password: Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
