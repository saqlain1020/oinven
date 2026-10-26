import NextAuth from "next-auth";
import "next-auth/jwt";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "./lib/db";
import User, { UserRole } from "./lib/models/User";
import { hashPassword, verifyPassword } from "./lib/password";

const config = {
  providers: [
    Credentials({
      name: "Username",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");
        if (!username || !password) return null;

        // First run: create the admin from ADMIN_USERNAME / ADMIN_PASSWORD if no admin exists yet
        const adminExists = await User.exists({ role: UserRole.Admin });
        if (
          !adminExists &&
          process.env.ADMIN_USERNAME &&
          process.env.ADMIN_PASSWORD &&
          username === process.env.ADMIN_USERNAME.trim().toLowerCase() &&
          password === process.env.ADMIN_PASSWORD
        ) {
          await User.create({ username, passwordHash: await hashPassword(password), role: UserRole.Admin });
        }

        const user = await User.findOne({ username }).lean();
        if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
        return { id: user._id.toString(), name: user.username, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  basePath: "/auth",
  callbacks: {
    authorized() {
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }
  interface Session {
    user: { id: string; role?: UserRole; name?: string | null };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}
