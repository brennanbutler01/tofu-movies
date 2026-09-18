import { showNotification } from '@mantine/notifications'
import { Prisma } from '@prisma/client'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { BiCheck } from 'react-icons/bi'
import { useSWRConfig } from 'swr'
import { useWatchProvidersSWR } from 'useWatchProvidersSWR'
import { v4 } from 'uuid'
import { useUserProvidersSWR } from './useUserProvidersSWR'

export const useUserProvidersCRUD = () => {
    const watchProviders = useWatchProvidersSWR({})
    const userProviders = useUserProvidersSWR()
    const { mutate } = useSWRConfig()
    const session = useSession()

    const createUserProvider = async (tmdb_id: number) => {
        const thisProvider = watchProviders?.find(
            p => p.provider_id === tmdb_id
        )

        if (session?.data?.user?.email) {
            const newProvider: Prisma.UserProviderCreateInput = {
                id: v4(),
                tmdb_id,
                user: {
                    connect: {
                        email: session?.data?.user?.email,
                    },
                },
                logo: thisProvider?.logo_path,
                provider_name: thisProvider?.provider_name,
                linked: true,
            }

            const mutatedProvider = {
                ...newProvider,
                user: session?.data?.user,
                userId: session?.data?.user?.userId,
            }

            const optimisticData = [...userProviders, mutatedProvider]

            await mutate(
                '/api/userProviders',
                axios.post('/api/userProviders', newProvider).then(() => {
                    showNotification({
                        message: 'User Provider created',
                        icon: <BiCheck />,
                        color: 'teal',
                    })
                    return optimisticData
                }),
                {
                    rollbackOnError: true,
                    optimisticData,
                }
            )
        }
    }

    const toggleProviderLinked = async (tmdb_id: number) => {
        const thisUserProvider = userProviders?.find(p => p.tmdb_id === tmdb_id)
        const updateLinkUser: Prisma.UserProviderUpdateInput = {
            tmdb_id,
            linked: !thisUserProvider?.linked,
        }

        const optimisticData = userProviders?.map(p =>
            p.tmdb_id === tmdb_id ? { ...p, linked: !p.linked } : p
        )

        await mutate(
            '/api/userProviders',
            axios
                .put(
                    '/api/userProviders/' + thisUserProvider?.id,
                    updateLinkUser
                )
                .then(() => {
                    showNotification({
                        color: 'teal',
                        message: 'User Provider Updated',
                        icon: <BiCheck />,
                    })
                    return optimisticData
                }),
            {
                optimisticData,
                rollbackOnError: true,
            }
        )
    }

    const linkAll = async (tmdb_ids: number[]) => {
        const filterProvider = (id: number) =>
            userProviders?.some(p => p.tmdb_id === id)
        const providersToCreate = tmdb_ids.filter(id => !filterProvider(id))
        const providersToLink = tmdb_ids.filter(filterProvider)

        if (session?.data?.user?.email) {
            const prismaToCreate: Prisma.UserProviderCreateManyInput[] =
                providersToCreate?.map(p => {
                    const thisProvider = watchProviders?.find(
                        watchProvider => watchProvider?.provider_id === p
                    )

                    return {
                        id: v4(),
                        tmdb_id: p,
                        userId: session?.data?.user?.userId,
                        linked: true,
                        logo: thisProvider?.logo_path,
                        provider_name: thisProvider?.provider_name,
                    }
                })

            const prismaToUpdate: Prisma.UserProviderUpdateInput[] =
                providersToLink?.map(p => ({
                    id: userProviders?.find(
                        userProvider => userProvider?.tmdb_id === p
                    )?.id,
                    tmdb_id: p,
                    linked: true,
                }))

            const optimisticData = [
                ...userProviders?.map(p =>
                    providersToLink?.some(tmdb_id => tmdb_id === p?.tmdb_id)
                        ? { ...p, linked: true }
                        : p
                ),
                ...providersToCreate,
            ]

            await mutate(
                '/api/userProviders',
                axios
                    .post('/api/userProviders/linkAll', {
                        toCreate: prismaToCreate,
                        toUpdate: prismaToUpdate,
                    })
                    .then(res => {
                        showNotification({
                            message: 'Linked all',
                            color: 'teal',
                            icon: <BiCheck />,
                        })
                        return res.data
                    }),
                {
                    rollbackOnError: true,
                    optimisticData,
                }
            )
        }
    }

    return { createUserProvider, toggleProviderLinked, linkAll }
}
