import prisma from "@/libs/prismadb";
import { compareSync } from "bcrypt-ts";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
        // signOut: "/auth/signout",
        // error: "/auth/error",
    },
    providers: [
        CredentialsProvider({
            name: "",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                console.log(credentials);

                const user = await prisma.users.findUnique({
                    where: {
                        email: credentials?.email,
                    },
                });
                if (!user) {
                    return null;
                }
                if (!compareSync(credentials?.password, user.password)) {
                    return null;
                }
                return user;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        session({ session, token }) {
            return {
                ...session,
                user: token.user,
            }
        },
    },
};