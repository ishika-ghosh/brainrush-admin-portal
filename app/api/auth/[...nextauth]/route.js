import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: "",
        password: "",
      },
      async authorize(credentials, req) {
        const userData = {
          username: credentials.username,
          password: credentials.password,
        };
        //make the api call
        const res = await fetch(`${process.env.BACKEND_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(userData),
        });
        const data = await res.json();
        // req.cookies.set("token", data.user.username);
        if (data.success) {
          return data.user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 * 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log(session);
      session.user.name = token.username;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
export { handler as GET, handler as POST };
