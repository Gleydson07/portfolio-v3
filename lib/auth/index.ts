import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedGithubId = process.env.ALLOWED_GITHUB_ID;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/admin/comentarios",
  },
  callbacks: {
    signIn({ profile }) {
      if (!allowedGithubId) return false;
      return profile?.id === allowedGithubId;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
});
