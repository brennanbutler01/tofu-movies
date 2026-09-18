import { VisitorNotice } from './VisitorNotice'
import { AppShell, Card, Container, Stack, Text, Title } from '@mantine/core'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { AuthCard } from './auth/AuthCard'
import { Nav } from './nav/'
import { AuthButton } from './nav/AuthButton'
import React from 'react'
import { useMovieListsSWR } from '../movieLists/useMovieListsSWR'

interface IPageWrapper {
    children: React.ReactNode
    authRequired?: boolean
    title?: string
}

export const PageWrapper = ({
    children,
    authRequired = false,
    title = `tofu.movies`,
}: IPageWrapper) => {
    useMovieListsSWR({})
    const { status } = useSession()

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
            </Head>

            <AppShell
                padding='md'
                header={<Nav />}
                styles={theme => ({
                    main: {
                        backgroundColor:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[8]
                                : theme.colors.gray[0],
                    },
                })}
            >
                <VisitorNotice />
                {(authRequired && status === 'unauthenticated') ||
                status === 'loading' ? (
                    <Container
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <AuthCard>
                            <Card.Section p='xl'>
                                <Stack p='xl' align={'center'}>
                                    <Title>Page Restricted</Title>
                                    <Text size='xl' color='dimmed'>
                                        Please sign in to view this page!
                                    </Text>
                                    <AuthButton />

                                    <Text size='sm' color='dimmed'>
                                        Signing in via email will allow you to
                                        create watchlists for your movies and
                                        track your watching history.
                                    </Text>
                                </Stack>
                            </Card.Section>
                        </AuthCard>
                    </Container>
                ) : (
                    children
                )}
            </AppShell>
        </div>
    )
}
