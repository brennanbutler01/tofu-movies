import { useState } from 'react'
import { PageWrapper } from '@/components/PageWrapper'
import { Button, Title, Stack, Paper, createStyles, Text } from '@mantine/core'
import { signIn } from 'next-auth/react'

const useStyles = createStyles(theme => ({
    wrapper: {
        minHeight: 900,
        backgroundSize: 'cover',
        backgroundImage: theme.fn.gradient({
            from: 'grape',
            to: 'indigo',
            deg: 140,
        }),
    },

    form: {
        borderRight: `1px solid ${
            theme.colorScheme === 'dark'
                ? theme.colors.dark[7]
                : theme.colors.gray[3]
        }`,
        minHeight: 900,
        maxWidth: 450,
        paddingTop: 80,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    logo: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: 120,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}))

const SignIn = () => {
    const { classes, theme } = useStyles()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    return (
        <PageWrapper title={`Login | tofu.movies`}>
            <div className={classes.wrapper}>
                <Paper className={classes.form} radius={0} p={30}>
                    <Title
                        order={1}
                        className={classes.title}
                        align='center'
                        mt='md'
                        mb={50}
                    >
                        Welcome to
                        <Text
                            span
                            ml='xs'
                            sx={theme => ({
                                background: theme.fn.gradient(
                                    theme.other.successGradient
                                ),
                                backgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            })}
                        >
                            tofu.movies!
                        </Text>
                    </Title>

                    {error && (
                        <Text color='red' role='alert'>
                            {error}
                        </Text>
                    )}
                    <Stack pb='lg'>
                        <Button
                            mt='xs'
                            type='submit'
                            variant='gradient'
                            size='lg'
                            radius='sm'
                            gradient={theme.other.successGradient}
                            fullWidth
                            loading={loading}
                            onClick={async () => {
                                if (
                                    process.env.NEXT_PUBLIC_VISITOR_DEMO !==
                                    'true'
                                ) {
                                    await signIn('google', { callbackUrl: '/' })
                                    return
                                }
                                setLoading(true)
                                setError(undefined)
                                try {
                                    const response = await fetch(
                                        '/api/demo/session',
                                        { method: 'POST' }
                                    )
                                    if (!response.ok)
                                        throw new Error(
                                            'The demo is busy. Please try again shortly.'
                                        )
                                    window.location.assign('/')
                                } catch (error) {
                                    setError(
                                        error instanceof Error
                                            ? error.message
                                            : 'Unable to start the demo.'
                                    )
                                    setLoading(false)
                                }
                            }}
                        >
                            {process.env.NEXT_PUBLIC_VISITOR_DEMO === 'true'
                                ? 'Start demo'
                                : 'Sign in with Google'}
                        </Button>
                    </Stack>
                </Paper>
            </div>
        </PageWrapper>
    )
}

export default SignIn
