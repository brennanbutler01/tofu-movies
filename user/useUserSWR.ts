import { User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export const useUserSWR = () => {
    const session = useSession()
    const data = useSWR('/api/users/' + session?.data?.user?.userId)
    return data?.data as User
}
