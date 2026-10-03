import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi Auth.js yang aman dijalankan di Edge Runtime (middleware).
 * Provider dengan logika DB/bcrypt (authorize) HANYA didefinisikan di
 * src/auth.ts, bukan di sini, karena middleware Next.js berjalan di Edge.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/lupa-password", "/admin/reset-password"];
      const isLoggedIn = !!auth?.user;
      const isOnAdmin =
        request.nextUrl.pathname.startsWith("/admin") &&
        !PUBLIC_ADMIN_PATHS.includes(request.nextUrl.pathname);
      const isOnUsers = request.nextUrl.pathname.startsWith("/admin/users");

      if (isOnUsers && auth?.user?.role !== "SUPER_ADMIN") {
        return Response.redirect(new URL("/admin", request.nextUrl));
      }
      if (isOnAdmin && !isLoggedIn) {
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nama = user.nama;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.nama = token.nama as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
