import { Group, Button, Text, Stack, useMantineTheme } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { LikeCountBadge } from './LikeCountBadge'
import { useLikeDislike } from './useLikeDislike'
import { useMediaQuery } from '@mantine/hooks'

interface ILikeDislike {
    reviewId: string
}

const LikeDislike = ({ reviewId }: ILikeDislike) => {
    const { status } = useSession()
    const { actionsConfig } = useLikeDislike({
        reviewId,
    })
    const theme = useMantineTheme()
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px`)

    return (
        <Stack p={isMobile ? 'md' : 'xl'}>
            <Group noWrap>
                {Object.entries(actionsConfig).map(([key, value]) => {
                    const badge = (
                        <LikeCountBadge
                            badgeColor={value.badgeColor}
                            count={value.value}
                            disabled={status !== 'authenticated'}
                        />
                    )
                    return (
                        <Button
                            aria-label={
                                key === 'likes'
                                    ? 'Like review'
                                    : 'Dislike review'
                            }
                            radius='lg'
                            variant={
                                theme.colorScheme === 'dark'
                                    ? 'light'
                                    : 'subtle'
                            }
                            key={key}
                            color={value.buttonColor}
                            disabled={status !== 'authenticated'}
                            {...(key && {
                                [key === 'likes' ? 'rightIcon' : 'leftIcon']:
                                    badge,
                            })}
                            sx={theme => ({
                                ':disabled': {
                                    color: theme.colors.dark[2],
                                },
                            })}
                            onClick={value.onClick}
                            loading={value.loading}
                        >
                            {value.icon}
                        </Button>
                    )
                })}
            </Group>
            {status === 'unauthenticated' && (
                <Link
                    legacyBehavior
                    href={{ pathname: '/auth/signin' }}
                    passHref
                >
                    <a>
                        <Text color='dimmed' size='xs' align='center'>
                            Sign in to like or dislike.
                        </Text>
                    </a>
                </Link>
            )}
        </Stack>
    )
}

export default LikeDislike
