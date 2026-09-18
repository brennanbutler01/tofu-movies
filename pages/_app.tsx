import { GetServerSidePropsContext } from 'next'
import { useState } from 'react'
import { AppProps } from 'next/app'
import { setCookie } from 'cookies-next/client'
import { getCookie } from 'cookies-next/server'
import {
    MantineProvider,
    ColorScheme,
    ColorSchemeProvider,
} from '@mantine/core'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { fetcher } from 'utils/fetcher'
import { NotificationsProvider } from '@mantine/notifications'
import { RouterTransition } from '@/components/RouterTransition'
import { ModalsProvider } from '@mantine/modals'
import Head from 'next/head'
import superjson from 'superjson'
export default function App(props: AppProps & { colorScheme: ColorScheme }) {
    const { Component } = props
    const pageProps =
        typeof props.pageProps?.serializedPage === 'string'
            ? superjson.parse<Record<string, unknown>>(
                  props.pageProps.serializedPage
              )
            : props.pageProps
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        props.colorScheme === 'dark' ? 'dark' : 'light'
    )

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme =
            value || (colorScheme === 'dark' ? 'light' : 'dark')
        setColorScheme(nextColorScheme)
        // when color scheme is updated save it to cookie
        setCookie('mantine-color-scheme', nextColorScheme, {
            maxAge: 60 * 60 * 24 * 30,
        })
    }

    return (
        <div>
            <Head>
                <meta name='viewport' content='width=device-width' />
            </Head>

            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    theme={{
                        colorScheme,
                        components: {
                            Menu: {
                                styles: () => ({
                                    itemLabel: {
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                    },
                                }),
                            },
                        },
                        headings: {
                            fontFamily: 'Roboto Slab, serif',
                        },
                        fontFamily: 'Roboto, sans-serif',
                        primaryColor: 'grape',
                        other: {
                            errorGradient: {
                                from: 'pink.8',
                                to: 'grape.8',
                                deg: 35,
                            },
                            deleteGradient: {
                                from: 'red.9',
                                to: 'pink.9',
                                deg: 230,
                            },
                            successGradient: {
                                from: 'teal.9',
                                to: 'green.5',
                                deg: 35,
                            },
                            breadcrumbDark: 'gray.5',
                            breadcrumbLight: 'gray.8',
                        },
                        loader: 'bars',
                    }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <NotificationsProvider>
                        <SWRConfig value={{ fetcher }}>
                            <SessionProvider>
                                <RouterTransition />
                                <ModalsProvider>
                                    <Component {...pageProps} />
                                </ModalsProvider>
                            </SessionProvider>
                        </SWRConfig>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </div>
    )
}

App.getInitialProps = async ({ ctx }: { ctx: GetServerSidePropsContext }) => {
    const preference = await getCookie('mantine-color-scheme', ctx)
    return { colorScheme: preference === 'dark' ? 'dark' : 'light' }
}
