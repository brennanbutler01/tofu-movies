import { IUserForm } from '@/components/user/UserForm'
import { Prisma } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useSWRConfig } from 'swr'
import { useUserSWR } from './useUserSWR'
import { showNotification } from '@mantine/notifications'
import { BiCheck } from 'react-icons/bi'

export const useUserCRUD = () => {
    const session = useSession()
    const { mutate } = useSWRConfig()
    const user = useUserSWR()
    const updateUser = async (values: IUserForm) => {
        const updateUser: Prisma.UserUpdateInput = {
            id: session?.data?.user?.userId,
            ...values,
        }

        const optimisticData = { ...user, ...values }

        await mutate(
            '/api/users/' + session?.data?.user?.userId,
            await axios
                .put('/api/users/' + session?.data?.user?.userId, updateUser)
                .then(() => {
                    showNotification({
                        color: 'teal',
                        icon: <BiCheck />,
                        message: 'User modified!',
                    })
                    return optimisticData
                }),
            {
                rollbackOnError: true,
                optimisticData,
            }
        )
    }

    return { updateUser }
}
