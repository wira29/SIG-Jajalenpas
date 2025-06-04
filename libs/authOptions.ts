import prisma from "@/libs/prismadb";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions : AuthOptions = {
    session: {
      strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "",
            credentials: {
              username: { label: "Email", type: "email", placeholder: "masukkan username" },
              password: { label: "Password", type: "password", placeholder: "masukkan password" },
            },
            async authorize(credentials) {
              console.log("📌 Credentials received:", credentials);
              // cek email dan password 
              if (!credentials?.username || !credentials?.password) {
                console.log("username atau password kosong");
                return null;
              }

              // Add logic here to look up the user from the credentials supplied
              const user : any|null = await prisma.users.findUnique({
                where: {
                  email: credentials.username,
                },
                include: {
                  roles: {
                    include: {
                      role: true,
                    }
                  }
                }
              });

              // jika user tidak ditemukan 
              if (!user) {
                throw new Error("Pengguna tidak ditemukan");
              }

              // user unverified 
              if (!user.email_verified_at) {
                
                throw new Error("EMAIL_NOT_VERIFIED");
              }
        
              // jika password salah
              const isValidPassword = await bcrypt.compare(credentials.password, user.password);
              if (!isValidPassword) {
                throw new Error("INVALID_CREDENTIALS");
              }

              return {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                role: user.roles[0]?.role.name,
              }   
            }
          }),
    ],
    callbacks: {
        session: ({ session, token }: { session: any; token: any }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                },
            }
        },
        jwt: async ({ token, user }: { token: any; user: any }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    role: u.role,
                }
            }

            const currentUser : any|null = await prisma.users.findUnique({
              where: {
                id: token.id,
              },
              include: {
                roles: {
                  include: {
                    role: true,
                  }
                }
              }
            });

            if (currentUser) {
              return {
                ...token,
                id: currentUser.id + "",
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.roles[0].role.name,
              }
            }

            return token;
        },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/signin'
    }
};

export default authOptions;