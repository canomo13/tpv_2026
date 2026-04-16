import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- INICIALIZANDO USUARIOS PASTEL PREMIUM ---');

  // 1. Crear ADMIN
  const adminEmail = 'admin@pastel.premium';
  const adminPassword = await bcrypt.hash('admin1234', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Administrador Pastel',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin creado/actualizado:', admin.email);

  // 3. Crear ZONAS y MESAS
  console.log('--- CREANDO ESTRUCTURA DE SALA ---');
  const mainZone = await prisma.zone.upsert({
    where: { name: 'Sala Principal' },
    update: {},
    create: {
      name: 'Sala Principal'
    }
  });

  for (let i = 1; i <= 10; i++) {
    const existingTable = await prisma.table.findFirst({
      where: { number: i, zoneId: mainZone.id }
    });

    if (!existingTable) {
      await prisma.table.create({
        data: {
          number: i,
          status: 'free',
          x: 100 + (i % 5) * 150,
          y: 100 + Math.floor(i / 5) * 150,
          zoneId: mainZone.id
        }
      });
    }
  }
  console.log('✅ 10 Mesas creadas en "Sala Principal"');

  // 4. Crear CATEGORÍAS y PRODUCTOS iniciales
  console.log('--- CREANDO CARTA INICIAL ---');
  const catBebidas = await prisma.category.upsert({
    where: { name: 'Bebidas' } as any,
    update: {},
    create: { name: 'Bebidas' }
  });

  await prisma.product.upsert({
    where: { name: 'Coca Cola' } as any,
    update: { price: 2.5, categoryId: catBebidas.id },
    create: {
      name: 'Coca Cola',
      price: 2.5,
      categoryId: catBebidas.id,
      description: 'Refresco clásico 33cl'
    }
  });

  console.log('✅ Carta básica inicializada');
  console.log('--- PROCESO COMPLETADO ---');
}

main()
  .catch((e) => {
    console.error('❌ Error initializing database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
