import { Avatar, Text, Divider, Button, Group, Box, Card } from '@mantine/core'
import { UserForm } from '@/components/user/UserForm'
import { BiEdit } from 'react-icons/bi'
import React from 'react'
import { useReviewSWR } from 'userReviews/useReviewSWR'
import { useSession } from 'next-auth/react'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { useUserMovieSWR } from 'userMovies/useUserMovieSWR'
import { UserProviderButton } from '../userProviders/UserProviderButton'

interface UserInfoActionProps {
    avatar?: string
    name?: string
    email?: string
    formVisible: boolean
    setFormVisible: React.Dispatch<React.SetStateAction<boolean>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function UserCardForm({
    avatar,
    name,
    email,
    formVisible,
    setFormVisible,
    setLoading,
}: UserInfoActionProps) {
    const session = useSession()
    const { data: reviews } = useReviewSWR({})
    const { data: movieLists } = useMovieListsSWR({})
    const userMovies = useUserMovieSWR({})
    const userStats = [
        {
            label: 'Reviews',
            value: reviews?.filter(
                review => review.reviewerId === session?.data?.user?.userId
            )?.length,
        },
        {
            label: 'Movie Lists Added',
            value: movieLists?.length,
        },
        {
            label: 'Movies Seen',
            value: userMovies?.filter(m => m.seen)?.length,
        },
    ]
    const stats = userStats.map(stat => (
        <Box key={stat.label} sx={theme => ({ padding: theme.spacing.sm })}>
            <Text align='center' size='lg' weight={500}>
                {stat?.value || 0}
            </Text>
            <Text align='center' size='sm' color='dimmed'>
                {stat.label}
            </Text>
        </Box>
    ))
    return (
        <Card
            radius='md'
            withBorder
            shadow={'md'}
            p='lg'
            sx={theme => ({
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[7]
                        : theme.white,
            })}
        >
            <Avatar src={avatar} size={120} radius={120} mx='auto' />
            <Text align='center' size='lg' weight={500} mt='md'>
                {name}
            </Text>
            <Text align='center' color='dimmed' size='sm'>
                {email}
            </Text>
            <Group position='center' mt='md' spacing='xl'>
                {stats}
            </Group>

            <Group position='center'>
                <UserProviderButton size={'md'} />
            </Group>
            <Button
                leftIcon={<BiEdit />}
                mt='lg'
                variant='light'
                fullWidth
                size='lg'
                onClick={() => setFormVisible(!formVisible)}
            >
                Edit Your Info
            </Button>
            {formVisible && (
                <>
                    <Divider mt={'xl'} mb='sm' />
                    <UserForm
                        setVisibility={() => setFormVisible(!formVisible)}
                        setLoading={setLoading}
                    />
                </>
            )}
        </Card>
    )
}
