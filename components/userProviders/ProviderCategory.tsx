import { Stack, Group, Title, Button } from '@mantine/core'
import React from 'react'
import { BiPlus } from 'react-icons/bi'
import { useUserProvidersCRUD } from 'userProviders/useUserProvidersCRUD'
import { ProviderCard } from './ProviderCard'
import { ProviderSimpleGrid } from './ProviderSimpleGrid'
import { ProviderCategories, useProviders } from './useProviders'

interface IProviderCategory {
    category: ProviderCategories
}

export const ProviderCategory = ({ category }: IProviderCategory) => {
    const { free, subscription, top } = useProviders()
    const { linkAll } = useUserProvidersCRUD()
    const categoryConfig = {
        free: { title: 'Free Services', data: free },
        top: { title: 'Most Popular', data: top },
        subscription: { title: 'Subscription Services', data: subscription },
    }

    return (
        <Stack>
            <Group position='apart'>
                <Title order={3}>{categoryConfig[category]?.title}</Title>
                <Button
                    radius='lg'
                    leftIcon={<BiPlus />}
                    variant='light'
                    onClick={async () =>
                        await linkAll(
                            Object.values(categoryConfig[category].data)?.map(
                                d => d.data?.provider_id || -1
                            )
                        )
                    }
                >
                    Add All
                </Button>
            </Group>
            <ProviderSimpleGrid>
                {Object.values(categoryConfig[category]?.data)?.map(
                    (provider, i) => (
                        <React.Fragment key={i}>
                            {provider?.data && (
                                <ProviderCard provider={provider.data} />
                            )}
                        </React.Fragment>
                    )
                )}
            </ProviderSimpleGrid>
        </Stack>
    )
}
