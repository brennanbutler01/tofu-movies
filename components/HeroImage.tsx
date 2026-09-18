import { createStyles, Container, Title, Text, Overlay } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { UserProviderButton } from './userProviders/UserProviderButton'

const useStyles = createStyles(theme => ({
    wrapper: {
        position: 'relative',
        paddingTop: 180,
        paddingBottom: 130,
        backgroundImage: 'url(https://wallpaperaccess.com/full/3658597.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',

        '@media (max-width: 520px)': {
            paddingTop: 80,
            paddingBottom: 50,
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
    },

    title: {
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: -1,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.white,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        '@media (max-width: 520px)': {
            fontSize: 28,
            textAlign: 'left',
        },
    },

    highlight: {
        color: theme.colors[theme.primaryColor][4],
    },

    description: {
        color: theme.colors.gray[0],
        textAlign: 'center',

        '@media (max-width: 520px)': {
            fontSize: theme.fontSizes.md,
            textAlign: 'left',
        },
    },

    controls: {
        marginTop: theme.spacing.xl * 1.5,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,

        '@media (max-width: 520px)': {
            flexDirection: 'column',
        },
    },

    control: {
        height: 42,
        fontSize: theme.fontSizes.md,

        '&:not(:first-of-type)': {
            marginLeft: theme.spacing.md,
        },

        '@media (max-width: 520px)': {
            '&:not(:first-of-type)': {
                marginTop: theme.spacing.md,
                marginLeft: 0,
            },
        },
    },

    secondaryControl: {
        color: theme.white,
        backgroundColor: 'rgba(255, 255, 255, .4)',

        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, .45) !important',
        },
    },
}))

function HeroImage() {
    const { classes } = useStyles()
    const session = useSession()
    return (
        <div className={classes.wrapper}>
            <Overlay color='#000' opacity={0.65} zIndex={1} />

            <div className={classes.inner}>
                <Title className={classes.title}>
                    Organize and track{' '}
                    <Text
                        component='span'
                        inherit
                        className={classes.highlight}
                    >
                        all your movies
                    </Text>
                </Title>

                <Container size={640}>
                    <Text size='lg' className={classes.description}>
                        Track, manage, and find new film content with ease.
                        Tofu.Movies provides all of the tools and features
                        necessary to handle managing your movies, allowing you
                        to focus on what is important: enjoying your films!
                    </Text>
                </Container>

                <div className={classes.controls}>
                    {session.status === 'authenticated' && (
                        <UserProviderButton />
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeroImage
