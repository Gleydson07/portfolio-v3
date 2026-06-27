import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

function getAllowedGithubIds(): ReadonlySet<string> {
  const raw = process.env.ALLOWED_GITHUB_ID?.trim();
  if (!raw) return new Set();

  const ids = raw
    .split(/[,\s]+/)
    .map((id) => id.trim())
    .filter((id) => /^\d+$/.test(id));

  return new Set(ids);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/blog/admin",
  },
  callbacks: {
    signIn({ profile }) {
      const allowedGithubIds = getAllowedGithubIds();
      if (allowedGithubIds.size === 0) return false;
      if (typeof profile?.id !== "number") return false;

      return allowedGithubIds.has(String(profile.id));
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
