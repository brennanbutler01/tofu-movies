import { BackToHomeButton } from '@/components/auth/BackToHomeButton'
import { PageWrapper } from '@/components/PageWrapper'
import {
    Box,
    Card,
    Container,
    createStyles,
    Image,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
// import Image from 'next/image';

const styles = createStyles(theme => ({
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

const VerifyRequest = () => {
    const { classes } = styles()

    return (
        <PageWrapper title={'Verify Request | tofu.movies'}>
            <Container p='md'>
                <Card radius='lg' withBorder p='lg' shadow={'xl'}>
                    <SimpleGrid
                        breakpoints={[
                            { maxWidth: 'xs', cols: 1 },
                            { minWidth: 'sm', cols: 2 },
                        ]}
                    >
                        <Box>
                            <Title>Email Generated Successfully!</Title>
                            <Image
                                className={classes.mobileImage}
                                src='/email-sent-transparent.png'
                                alt={
                                    'Vector image of a successful email being sent.'
                                }
                            />
                            <Stack>
                                <Text size='xl' p={'lg'} pb={'xs'}>
                                    Check your email for a &quot;magic
                                    link&quot; that will let you sign in without
                                    having to remember a password!
                                </Text>
                                <Text color={'dimmed'} p={'lg'} pt={'xs'}>
                                    If you haven&apos;t received verification
                                    emails from tofu.movies before, your email
                                    might go to your junk or spam folder. Make
                                    sure to please add{' '}
                                    <b>luths-list@mail.com</b> to your contacts
                                    or approved senders list to make it easier
                                    to sign-in in the future.
                                </Text>
                            </Stack>
                        </Box>
                        <Stack justify={'start'}>
                            <Image
                                className={classes.desktopImage}
                                src='/email-sent-transparent.png'
                                alt={
                                    'Vector image of a successful email being sent.'
                                }
                            />

                            <BackToHomeButton />
                        </Stack>
                    </SimpleGrid>
                </Card>
            </Container>
            {/* <Center style={{ height: '100%' }}>
        <AuthCard>
          <Card.Section inheritPadding p="xl">
            <Container p="xl">
              <Title p="xl" pt="xs" pb="xs" align="center">
                Check your email
              </Title>
              <Text p="xl" pt="xs" align="center">
                A sign-in link has been sent to your email address.
              </Text>
              <BackToHomeButton />
            </Container>
          </Card.Section>
        </AuthCard>
      </Center> */}
        </PageWrapper>
    )
}

export default VerifyRequest
