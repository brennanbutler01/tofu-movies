import { UserProvider } from '@prisma/client'
import useSWR from 'swr'

export const useUserProvidersSWR = () => {
    const data = useSWR('/api/userProviders')
    return data?.data as UserProvider[]
}
