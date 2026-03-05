import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: process.env.AUTH_GITHUB_ID ? [GitHub] : [],
  secret:
    process.env.AUTH_SECRET ||
    "ZmFsbGJhY2stc2VjcmV0LXBsZWFzZS1zZXQtQVVUSF9TRUNSRVQ=",
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
