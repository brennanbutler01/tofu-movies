import { PageWrapper } from '@/components/PageWrapper'

import {
    createStyles,
    Image,
    Container,
    Title,
    Text,
    Button,
    SimpleGrid,
} from '@mantine/core'
import Link from 'next/link'

const useStyles = createStyles(theme => ({
    root: {
        paddingTop: 80,
        paddingBottom: 80,
    },

    title: {
        fontWeight: 900,
        fontSize: 34,
        marginBottom: theme.spacing.md,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    control: {
        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },

    mobileImage: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    desktopImage: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
}))

const NotFoundPage = () => {
    const { classes } = useStyles()

    return (
        <PageWrapper
            authRequired={false}
            title={`404 Page not found! | tofu.movies`}
        >
            <Container className={classes.root}>
                <SimpleGrid
                    spacing={80}
                    cols={2}
                    breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
                >
                    <Image
                        radius='md'
                        src={'/404.jpeg'}
                        className={classes.mobileImage}
                        alt='404 error image'
                    />
                    <div>
                        <Title className={classes.title}>
                            Something is not right...
                        </Title>
                        <Text color='dimmed' size='lg'>
                            Page you are trying to open does not exist. You may
                            have mistyped the address, or the page has been
                            moved to another URL. If you think this is an error
                            contact support.
                        </Text>
                        <Link legacyBehavior href='/' passHref>
                            <Button
                                component='a'
                                variant='outline'
                                size='md'
                                mt='xl'
                                className={classes.control}
                            >
                                Get back to home page
                            </Button>
                        </Link>
                    </div>
                    <Image
                        radius='md'
                        src={'/404.jpeg'}
                        className={classes.desktopImage}
                        alt='404 error image'
                    />
                </SimpleGrid>
            </Container>
        </PageWrapper>
    )
}

export default NotFoundPage
