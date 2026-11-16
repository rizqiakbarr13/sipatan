/**
 * Buat akun admin baru, atau reset password jika email sudah terdaftar.
 *
 * Pemakaian:
 *   npx tsx scripts/buat-admin.ts <email> <password> [nama] [SUPER_ADMIN|ADMIN]
 *
 * Database yang dipakai = DATABASE_URL di .env (atau environment saat ini).
 * Untuk production (Neon/Vercel), jalankan dengan DATABASE_URL production, mis.:
 *   DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" npx tsx scripts/buat-admin.ts ...
 *
 * Jangan simpan password di file ini / di git.
 */
import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

async function main() {
  const [email, password, nama = "Administrator", roleArg = "SUPER_ADMIN"] =
    process.argv.slice(2);

  if (!email || !password) {
    console.error(
      "Pemakaian: npx tsx scripts/buat-admin.ts <email> <password> [nama] [SUPER_ADMIN|ADMIN]",
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password minimal 8 karakter.");
    process.exit(1);
  }
  if (roleArg !== "SUPER_ADMIN" && roleArg !== "ADMIN") {
    console.error("Role harus SUPER_ADMIN atau ADMIN.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const role = roleArg as Role;
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { password: hashed, nama, role },
      });
      console.log(`Akun ${email} sudah ada — password direset (role: ${role}).`);
    } else {
      await prisma.user.create({ data: { email, password: hashed, nama, role } });
      console.log(`Akun admin baru dibuat: ${email} (role: ${role}).`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
