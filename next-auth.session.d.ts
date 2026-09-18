// noinspection JSUnusedGlobalSymbols

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            userId: string
        } & DefaultSession['user']
    }
}
