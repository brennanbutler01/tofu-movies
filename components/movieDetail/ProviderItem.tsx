import { IConfig } from 'pages/api/config'
import { Group, Avatar, Text, Anchor } from '@mantine/core'
import { IProviderDetails } from 'pages/api/watchProviders/[id]'

interface IProviderItem {
    providers: IProviderDetails[]
    config: IConfig
    link?: string
}
export const ProviderItems = ({ providers, config, link }: IProviderItem) => {
    return (
        <Group spacing={'xl'}>
            {providers.map(provider =>
                provider ? (
                    <Anchor href={link} key={provider.provider_id}>
                        <Group>
                            <Avatar
                                src={`${config.base_url}/${config.logo_sizes[3]}/${provider.logo_path}`}
                            />
                            <Text color='dimmed'>{provider.provider_name}</Text>
                        </Group>
                    </Anchor>
                ) : (
                    <></>
                )
            )}
        </Group>
    )
}
