import { PageWrapper } from '@/components/PageWrapper'
import { UserBreadcrumbs } from '@/components/user/UserBreadcrumbs'
import { UserCardForm } from '@/components/user/UserCardForm'
import {
    Card,
    Container,
    Divider,
    Group,
    LoadingOverlay,
    Text,
    Title,
} from '@mantine/core'
import { useState } from 'react'
import { useUserSWR } from 'user/useUserSWR'

const UserPage = () => {
    const [formVisible, setFormVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const swrUser = useUserSWR()

    return (
        <PageWrapper authRequired title={'User | tofu.movies'}>
            <UserBreadcrumbs />
            <Title mt={'md'}>User Profile</Title>
            <Container p='xl'>
                <Card shadow='md' radius='md' p='xl' withBorder>
                    <LoadingOverlay visible={loading} />
                    <Group position='apart'>
                        <Title order={3}>User Info, Preferences & Stats</Title>
                    </Group>
                    <Text color='dimmed' size='sm'>
                        Make changes to your profile and how other users see
                        you!
                    </Text>
                    <Divider mt='lg' />
                    <Card.Section inheritPadding py='xl'>
                        <UserCardForm
                            avatar={swrUser?.image || ''}
                            email={swrUser?.email || ''}
                            name={swrUser?.name || ''}
                            formVisible={formVisible}
                            setFormVisible={setFormVisible}
                            setLoading={setLoading}
                        />
                    </Card.Section>
                </Card>
            </Container>
        </PageWrapper>
    )
}
export default UserPage
