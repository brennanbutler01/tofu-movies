import { signOut } from 'next-auth/react'
import { PageWrapper } from '@/components/PageWrapper'
import { Button, Title, Stack, Paper, createStyles, Text } from '@mantine/core'

const useStyles = createStyles(theme => ({
    wrapper: {
        minHeight: 900,
        backgroundSize: 'cover',
        backgroundImage: 'url(https://wallpaperaccess.com/full/2552179.png)',
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

const SignOut = () => {
    const { classes } = useStyles()

    return (
        <PageWrapper title={'Sign Out | tofu.movies'} authRequired>
            <div className={classes.wrapper}>
                <Paper className={classes.form} radius={0} p={30}>
                    <Stack>
                        <Title
                            order={1}
                            className={classes.title}
                            align='center'
                            mt='md'
                            mb={50}
                        >
                            Leaving
                            <Text
                                // size="xl"
                                span
                                ml='xs'
                                sx={theme => ({
                                    background: theme.fn.gradient(
                                        theme.other.errorGradient
                                    ),
                                    backgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                })}
                            >
                                tofu.movies{' '}
                            </Text>{' '}
                            ?
                        </Title>
                        <Text color='dimmed' align='center'>
                            {' '}
                            Are you sure that you want to sign-out? You can
                            always stay logged in until the next time you
                            return.{' '}
                        </Text>
                        <Button
                            size='lg'
                            radius='md'
                            onClick={async () =>
                                await signOut({ callbackUrl: '/' })
                            }
                            fullWidth
                            variant='gradient'
                            gradient={{
                                from: 'pink.8',
                                to: 'grape.8',
                                deg: 35,
                            }}
                        >
                            Sign out
                        </Button>
                    </Stack>
                </Paper>
            </div>
        </PageWrapper>
    )
}

export default SignOut
