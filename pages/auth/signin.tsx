import { PageWrapper } from '@/components/PageWrapper'
import { Button, Title, Stack, Paper, createStyles, Text } from '@mantine/core'
import { signIn } from 'next-auth/react'

const useStyles = createStyles(theme => ({
    wrapper: {
        minHeight: 900,
        backgroundSize: 'cover',
        backgroundImage:
            'url(https://www.simplehelp.net/images/wuwp/uw-wallpaper06.jpg)',
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

                    <Stack pb='lg'>
                        <Button
                            mt='xs'
                            type='submit'
                            variant='gradient'
                            size='lg'
                            radius='sm'
                            gradient={theme.other.successGradient}
                            fullWidth
                            onClick={() =>
                                signIn('google', { callbackUrl: '/' })
                            }
                        >
                            Sign in with Google
                        </Button>
                    </Stack>
                </Paper>
            </div>
        </PageWrapper>
    )
}

export default SignIn
