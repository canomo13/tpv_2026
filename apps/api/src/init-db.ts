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

  // 2. Crear CAMARERO (con PIN)
  const waiterPin = '1234';
  const waiter = await prisma.user.upsert({
    where: { email: 'juan@pastel.premium' }, // Necesita un email para la tabla, pero usará PIN
    update: { pin: waiterPin, role: 'WAITER' },
    create: {
      email: 'juan@pastel.premium',
      name: 'Juan Camarero',
      password: await bcrypt.hash('waiter1234', 10), // Pass por defecto
      pin: waiterPin,
      role: 'WAITER'
    } as any // Casting as any por si el cliente no está regenerado
  });
  console.log('✅ Camarero creado/actualizado:', waiter.name, 'PIN:', waiterPin);

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
