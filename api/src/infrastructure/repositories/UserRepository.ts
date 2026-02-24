// Load Prisma client from generated output first (Prisma v7 layout), then fall back to @prisma/client
let prismaClient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const gen = require('../../../prisma/generated/prisma');
  const PrismaClient = gen.PrismaClient || gen.default?.PrismaClient || gen.default;
  prismaClient = new PrismaClient();
} catch (err) {
  try {
    // fallback to standard @prisma/client
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('@prisma/client');
    const PrismaClient = mod.PrismaClient || mod.default?.PrismaClient || mod.default;
    prismaClient = new PrismaClient();
  } catch (e) {
    throw e;
  }
}

const prisma = prismaClient;

export const findOrCreateUser = async (userData: { uid: string; email?: string; displayName?: string; provider?: string; providerUid?: string }) => {
  const { uid, email, displayName, provider, providerUid } = userData;
  try {
    let user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      user = await prisma.user.create({ data: { uid, email, displayName, provider, providerUid } });
    }
    return user;
  } catch (err) {
    throw err;
  }
};
