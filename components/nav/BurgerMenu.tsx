import { Burger, Menu, Text } from '@mantine/core'
import { NextLink } from '@mantine/next'
import { Prisma } from '@prisma/client'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { ReviewOrderBy } from '../movieReviews/ReviewOrderBySelect'
import { useRouter } from 'next/router'

export const BurgerMenu = () => {
    const [opened, setOpened] = useState(false)
    const title = opened ? 'Close navigation' : 'Open Navigation'
    const { status } = useSession()
    const { pathname } = useRouter()

    const authConfig = {
        authenticated: {
            itemText: 'Sign Out',
            href: '/auth/signout',
        },
        unauthenticated: {
            itemText: 'Sign In',
            href: '/auth/signin',
        },
        loading: {
            itemText: 'Checking auth...',
            href: '/',
        },
    }

    const toggleOpen = () => setOpened(!opened)

    console.log('pathname', pathname)

    return (
        <Menu onClose={toggleOpen} width={250} shadow='md'>
            <Menu.Target>
                <Burger opened={opened} onClick={toggleOpen} title={title} />
            </Menu.Target>

            <Menu.Dropdown>
                {status === 'authenticated' && (
                    <>
                        <Menu.Item
                            component={NextLink}
                            href='/movieLists'
                            {...(pathname === '/movieLists' && {
                                sx: theme => ({
                                    backgroundColor:
                                        theme.colorScheme === 'light'
                                            ? theme.colors.grape[0]
                                            : theme.colors.grape[8],
                                    ':hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'light'
                                                ? theme.colors.grape[1]
                                                : theme.colors.grape[7],
                                    },
                                }),
                            })}
                        >
                            <Text align='center'>Watchlists</Text>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            {...(pathname === '/reviews' && {
                                sx: theme => ({
                                    backgroundColor:
                                        theme.colorScheme === 'light'
                                            ? theme.colors.grape[0]
                                            : theme.colors.grape[8],
                                    ':hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'light'
                                                ? theme.colors.grape[1]
                                                : theme.colors.grape[7],
                                    },
                                }),
                            })}
                            component={NextLink}
                            href={{
                                pathname: '/reviews',
                                query: {
                                    orderBy: ReviewOrderBy.CREATED,
                                    sortOrder: Prisma.SortOrder.desc,
                                },
                            }}
                        >
                            <Text align='center'>Reviews</Text>
                        </Menu.Item>

                        <Menu.Divider />
                        <Menu.Item
                            href={'/randomMovie'}
                            component={NextLink}
                            {...(pathname === '/randomMovie' && {
                                sx: theme => ({
                                    backgroundColor:
                                        theme.colorScheme === 'light'
                                            ? theme.colors.grape[0]
                                            : theme.colors.grape[8],
                                    ':hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'light'
                                                ? theme.colors.grape[1]
                                                : theme.colors.grape[7],
                                    },
                                }),
                            })}
                        >
                            <Text align={'center'}>Random Movie</Text>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            component={NextLink}
                            href={'/user'}
                            {...(pathname === '/user' && {
                                sx: theme => ({
                                    backgroundColor:
                                        theme.colorScheme === 'light'
                                            ? theme.colors.grape[0]
                                            : theme.colors.grape[8],
                                    ':hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'light'
                                                ? theme.colors.grape[1]
                                                : theme.colors.grape[7],
                                    },
                                }),
                            })}
                        >
                            <Text align='center'>Profile</Text>
                        </Menu.Item>
                        <Menu.Divider />
                    </>
                )}
                {status === 'authenticated' ? (
                    <Menu.Item
                        component={NextLink}
                        href={authConfig[status].href}
                    >
                        <Text align='center'>
                            {authConfig[status].itemText}
                        </Text>
                    </Menu.Item>
                ) : (
                    <Menu.Item
                        disabled={status === 'loading'}
                        onClick={async () => await signIn()}
                    >
                        <Text align={'center'}>Sign in </Text>{' '}
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}
