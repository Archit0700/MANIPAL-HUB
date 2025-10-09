import { PrismaClient } from '@prisma/client';
import { articles, docSources, events, faqs, pois } from './seed-data';

const prisma = new PrismaClient();

async function seedArticles() {
  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        summary: article.summary,
        body: article.body,
        heroImage: article.heroImage,
        tags: article.tags,
        publishedAt: article.publishedAt,
      },
      create: {
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        body: article.body,
        heroImage: article.heroImage,
        tags: article.tags,
        publishedAt: article.publishedAt,
      },
    });
  }
}

async function seedFaqs() {
  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { question: faq.question },
      update: { answer: faq.answer },
      create: {
        question: faq.question,
        answer: faq.answer,
      },
    });
  }
}

async function seedPois() {
  const keepNames = pois.map((poi) => poi.name);
  if (keepNames.length > 0) {
    await prisma.poi.deleteMany({
      where: { name: { notIn: keepNames } },
    });
  }

  for (const poi of pois) {
    await prisma.poi.upsert({
      where: { name: poi.name },
      update: {
        summary: poi.summary,
        description: poi.description,
        latitude: poi.latitude,
        longitude: poi.longitude,
        imageUrl: poi.imageUrl,
      },
      create: {
        name: poi.name,
        summary: poi.summary,
        description: poi.description,
        latitude: poi.latitude,
        longitude: poi.longitude,
        imageUrl: poi.imageUrl,
      },
    });
  }
}

async function seedEvents() {
  for (const event of events) {
    await prisma.event.upsert({
      where: { title: event.title },
      update: {
        summary: event.summary,
        description: event.description,
        startAt: event.startAt,
        endAt: event.endAt,
        location: event.location,
      },
      create: {
        title: event.title,
        summary: event.summary,
        description: event.description,
        startAt: event.startAt,
        endAt: event.endAt,
        location: event.location,
      },
    });
  }
}

async function seedDocs() {
  for (const doc of docSources) {
    await prisma.doc.upsert({
      where: { id: doc.id },
      update: { title: doc.title, source: doc.source },
      create: { id: doc.id, title: doc.title, source: doc.source },
    });
  }
}

async function main() {
  await seedArticles();
  await seedFaqs();
  await seedPois();
  await seedEvents();
  await seedDocs();
}

main()
  .then(() => {
    console.info('Database seed completed.');
  })
  .catch((error) => {
    console.error('Database seed failed.', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
