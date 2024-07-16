import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import connectdb from "../../../../../config/dbconfig";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session:{
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60,
  },
 callbacks :{
   async signIn({ user, account}) {
    try {
      // Connect to the database
      const db = await connectdb();

      // Check if user exists
      const [rows] = await db.execute(
        'SELECT * FROM Ouser WHERE email = ?',
        [user.email]
      );
      
      if (rows.length === 0) {
        // User does not exist, insert new user with access token

        await db.execute(
          'INSERT INTO Ouser (name, email, accessToken, refreshToken) VALUES (?, ?, ?, ?)',
          [user.name, user.email, account.access_token, account.refresh_token]
        );
      } else {
        // User exists, update access token
        await db.execute(
          'UPDATE Ouser SET accessToken = ?, refreshToken = ? WHERE email = ?',
          [account.access_token, account.refresh_token, user.email]
        );
      }
      console.log(account.access_token)
      return true;
    } catch (error) {
      console.error('Error saving user to database', error);
      return false;
    }
  },
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token;
    }
    return token;
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken;
    return session;
  },
}
}

export const handler= NextAuth(authOptions)
export { handler as GET, handler as POST };