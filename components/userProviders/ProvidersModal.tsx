import {
    Box,
    Container,
    Input,
    Paper,
    Stack,
    Title,
    Text,
    Skeleton,
} from '@mantine/core'
import { useUserProvidersSWR } from 'userProviders/useUserProvidersSWR'
import { ProviderAvatarGroup } from './ProviderAvatarGroup'
import { ProviderCategory } from './ProviderCategory'
import { UserProvidersAuto } from './UserProvidersAuto'

export const ProvidersModal = () => {
    const userProviders = useUserProvidersSWR()

    return (
        <Box>
            <Stack>
                <Container p='xl'>
                    <Stack p='lg'>
                        <Stack>
                            <Title>Edit Your Services</Title>
                            <Text color='dimmed'>
                                Hit the + to add each service you use. You
                                won&apos;t need your account information or to
                                sign in. Tofu.movies will link you to the watch
                                provider service to be able to view an episode.
                            </Text>
                        </Stack>
                        <Paper>
                            <Stack>
                                <Input.Wrapper label='Search and add Services!'>
                                    <UserProvidersAuto />
                                </Input.Wrapper>
                                <ProviderAvatarGroup />
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
                <Stack spacing='xl' p='xl'>
                    {userProviders ? (
                        <>
                            <ProviderCategory category='top' />
                            <ProviderCategory category='free' />
                            <ProviderCategory category='subscription' />
                        </>
                    ) : (
                        <Skeleton height={300} />
                    )}
                </Stack>
                <Stack align='center' p='xl'>
                    <Text size='lg' weight={700}>
                        Looking for more services?
                    </Text>
                    <Text sx={{ maxWidth: '1080px' }} color='dimmed'>
                        While tofu.movies does support over 150 services, many
                        of those are &quot;bundled&quot; into various offerings
                        above, including the Free Bundle which includes over 50
                        services including Crackle, TubiTV, Vudu, PopcornFlix,
                        and many more. We also support many rent and purchase
                        services which can be viewed on any tv or movies page
                        and browsed by selecting &quot;Rent or Buy&quot; on any
                        browse page.
                    </Text>
                </Stack>
            </Stack>
        </Box>
    )
}
