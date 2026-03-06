import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

if (!process.env.AUTH_SECRET) {
  console.warn(
    "⚠️  AUTH_SECRET is not set. Authentication will not work in production."
  );
}

const providers = [];
if (process.env.AUTH_GITHUB_ID) providers.push(GitHub);
if (process.env.AUTH_GOOGLE_ID) providers.push(Google);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
