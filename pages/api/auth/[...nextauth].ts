import prisma from '@/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    callbacks: {
        // add our user id to our session
        async session({ session, user }) {
            session.user.userId = user.id
            return session
        },
    },
    events: {
        createUser: async message => {
            console.log('creating list')
            await prisma.movieList.create({
                data: {
                    title: 'Watchlist',
                    description: 'Default list',
                    createdBy: message.user.email || 'System Generated',
                    users: {
                        connect: {
                            id: message.user.id,
                        },
                    },
                },
            })
        },
    },
}

export default NextAuth(authOptions)
