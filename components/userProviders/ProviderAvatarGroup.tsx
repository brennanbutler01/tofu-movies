import { Avatar, Group, Popover, Text, Tooltip } from '@mantine/core'
import { useImageConfigSWR } from 'imageConfig/useImageConfigSWR'
import { useUserProvidersSWR } from 'userProviders/useUserProvidersSWR'
import { AccessibleTooltip } from '../AccessibleTooltip'
import { UserProvider } from '@prisma/client'

export const ProviderAvatarGroup = () => {
    const userProviders = useUserProvidersSWR()
    const config = useImageConfigSWR()
    const linkedProviders = userProviders?.filter(p => p.linked)

    const avatars = (arr: UserProvider[]): JSX.Element[] =>
        arr?.map(p => (
            <AccessibleTooltip label={p.provider_name} key={p.id}>
                <Avatar
                    // size="sm"
                    radius='md'
                    src={`${config?.base_url}/${
                        config?.logo_sizes[config?.logo_sizes?.length - 1]
                    }/${p.logo}`}
                />
            </AccessibleTooltip>
        ))

    return (
        <>
            <Text size='sm' color='dimmed'>
                Connected Services
            </Text>
            <Tooltip.Group>
                <Avatar.Group spacing={'md'}>
                    {linkedProviders?.length > 5
                        ? [
                              ...avatars(linkedProviders.slice(0, 4)),
                              <Popover
                                  key={'popover'}
                                  styles={{
                                      dropdown: {
                                          maxHeight: '300px',
                                          overflowY: 'auto',
                                      },
                                  }}
                              >
                                  <Popover.Target>
                                      <Avatar radius='md'>
                                          +{linkedProviders?.length - 4}
                                      </Avatar>
                                  </Popover.Target>

                                  <Popover.Dropdown>
                                      {linkedProviders?.map(p => (
                                          <Group px='md' my='md' key={p?.id}>
                                              <Avatar
                                                  radius='md'
                                                  size='sm'
                                                  src={`${config?.base_url}/${
                                                      config?.logo_sizes[
                                                          config?.logo_sizes
                                                              ?.length - 1
                                                      ]
                                                  }/${p.logo}`}
                                              />
                                              <Text>{p.provider_name}</Text>
                                          </Group>
                                      ))}
                                  </Popover.Dropdown>
                              </Popover>,
                          ]
                        : linkedProviders?.length > 0
                        ? [...avatars(linkedProviders)]
                        : []}
                </Avatar.Group>
            </Tooltip.Group>
        </>
    )
}
