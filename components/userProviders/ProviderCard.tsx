import { Card, Group, Avatar, Text, ActionIcon } from '@mantine/core'
import { useImageConfigSWR } from 'imageConfig/useImageConfigSWR'
import { IProviderDetails } from 'pages/api/watchProviders/[id]'
import { BiCheck, BiPlus } from 'react-icons/bi'
import { useUserProvidersCRUD } from 'userProviders/useUserProvidersCRUD'
import { useUserProvidersSWR } from 'userProviders/useUserProvidersSWR'

interface IProviderCard {
    provider: IProviderDetails
}

export const ProviderCard = ({ provider }: IProviderCard) => {
    const config = useImageConfigSWR()
    const { createUserProvider, toggleProviderLinked } = useUserProvidersCRUD()
    const userProviders = useUserProvidersSWR()

    const thisUserProvider = userProviders?.find(
        p => p.tmdb_id === provider.provider_id
    )

    return (
        <Card
            onClick={async () =>
                provider?.provider_id &&
                (await (thisUserProvider
                    ? toggleProviderLinked
                    : createUserProvider)(provider.provider_id))
            }
            key={provider?.provider_id}
            p='xs'
            radius='md'
            shadow='sm'
            sx={theme => ({
                display: 'flex',
                alignItems: 'center',
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? thisUserProvider?.linked
                            ? theme.colors.dark[4]
                            : theme.colors.dark[6]
                        : thisUserProvider?.linked
                        ? theme.colors.grape[0]
                        : theme.white,
                ':hover': {
                    cursor: 'pointer',
                    boxShadow: theme.shadows.lg,
                    backgroundColor:
                        theme.colorScheme === 'dark'
                            ? thisUserProvider?.linked
                                ? theme.colors.dark[4]
                                : theme.colors.dark[5]
                            : thisUserProvider?.linked
                            ? theme.colors.grape[0]
                            : theme.colors.grape[1],
                },
            })}
        >
            <Group noWrap position='apart' align='center'>
                <Group noWrap align='center'>
                    <Avatar
                        radius='md'
                        size='md'
                        src={`${config?.base_url}/${
                            config?.logo_sizes[config?.logo_sizes?.length - 1]
                        }/${provider?.logo_path}`}
                    />
                    <Text weight={700}>{provider?.provider_name}</Text>
                </Group>
                <ActionIcon>
                    {thisUserProvider?.linked ? (
                        <BiCheck size={32} />
                    ) : (
                        <BiPlus size={32} />
                    )}
                </ActionIcon>
            </Group>
        </Card>
    )
}
