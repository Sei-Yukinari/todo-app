// Lazy-load Prisma client to avoid import-time errors when schema/client is not generated (useful for quick local runs)
let prisma: any = null;

const getPrisma = () => {
  if (prisma) return prisma;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const gen = require('../../../prisma/generated/prisma');
    const PrismaClient = gen.PrismaClient || gen.default?.PrismaClient || gen.default;
    prisma = new PrismaClient();
    return prisma;
  } catch (err) {
    try {
      // fallback to standard @prisma/client
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require('@prisma/client');
      const PrismaClient = mod.PrismaClient || mod.default?.PrismaClient || mod.default;
      prisma = new PrismaClient();
      return prisma;
    } catch (e) {
      // If Prisma client isn't available, use an in-memory stub to allow auth flows to work without DB
      // This keeps the API running for local testing of auth routes without a DB.
      prisma = {
        user: {
          async findUnique(_q: any) { return null; },
          async create(args: any) { return { id: 'local-1', uid: args.data.uid, email: args.data.email, displayName: args.data.displayName }; },
        },
      } as any;
      return prisma;
    }
  }
};

export const findOrCreateUser = async (userData: { uid: string; email?: string; displayName?: string; provider?: string; providerUid?: string }) => {
  const { uid, email, displayName, provider, providerUid } = userData;
  const db = getPrisma();
  try {
    let user = await db.user.findUnique({ where: { uid } });
    if (!user) {
      user = await db.user.create({ data: { uid, email, displayName, provider, providerUid } });
    }
    return user;
  } catch (err) {
    throw err;
  }
};
