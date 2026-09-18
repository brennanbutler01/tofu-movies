import { AuthCard } from '@/components/auth/AuthCard'
import { BackToHomeButton } from '@/components/auth/BackToHomeButton'
import { PageWrapper } from '@/components/PageWrapper'
import { Card, Center, Container, Stack, Text, Title } from '@mantine/core'
import { useRouter } from 'next/router'

interface IError {
    error: 'Configuration' | 'AccessDenied' | 'Verification' | 'Default'
}

const errorConfig: Record<IError['error'], { title: string; text: string }> = {
    Configuration: {
        title: 'Configuration Error',
        text: 'There is a problem with the server configuration. Check if your options are correct',
    },
    AccessDenied: {
        title: 'Access Denied',
        text: `You aren't authorized to sign in - Please try again...`,
    },
    Verification: {
        title: 'Verification Error',
        text: `We encountered a problem verifying your email. The verification token has expired or has already been used. Please try again`,
    },
    Default: {
        title: 'Error',
        text: `We encountered an error... but don't have more details right now. Please try again.`,
    },
}

const Error = () => {
    const { query } = useRouter()
    const config = errorConfig[(query?.error as IError['error']) || 'Default']
    return (
        <PageWrapper title={'Error - tofu.movies'}>
            <Center style={{ height: '100%' }}>
                <AuthCard>
                    <Card.Section inheritPadding px='xl' py='lg'>
                        <Container p='xl'>
                            <Stack align={'center'} p='xl'>
                                <Title>{config?.title}</Title>
                                <Text>{config?.text}</Text>
                                <Container pt='lg'>
                                    <BackToHomeButton />
                                </Container>
                            </Stack>
                        </Container>
                    </Card.Section>
                </AuthCard>
            </Center>
        </PageWrapper>
    )
}
export default Error
