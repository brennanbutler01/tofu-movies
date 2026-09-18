import { Autocomplete, Avatar, Group, Text } from '@mantine/core'
import { SelectItemsProps } from '@mantine/core/lib/Select/SelectItems/SelectItems'
import { useImageConfigSWR } from 'imageConfig/useImageConfigSWR'
import { IProviderDetails } from 'pages/api/watchProviders/[id]'
import { forwardRef, useState } from 'react'
import { BiPlus, BiUnlink } from 'react-icons/bi'
import { useUserProvidersCRUD } from 'userProviders/useUserProvidersCRUD'
import { useUserProvidersSWR } from 'userProviders/useUserProvidersSWR'
import { useWatchProvidersSWR } from 'useWatchProvidersSWR'

type OurItemProps = SelectItemsProps &
    IProviderDetails & { value: string; linked: boolean }

const AutoCompleteItem = forwardRef<HTMLDivElement, OurItemProps>(
    (
        {
            provider_id,
            provider_name,
            logo_path,
            value,
            linked,
            ...others
        }: OurItemProps,
        ref
    ) => (
        <div ref={ref} {...others} key={`${value} ${logo_path}`}>
            <Group noWrap position='apart'>
                <Group>
                    {logo_path && <Avatar src={logo_path} size='md' />}
                    <Group align='center'>
                        <Text size='lg'>{provider_name} </Text>
                    </Group>
                </Group>
                {linked ? <BiUnlink /> : <BiPlus />}
            </Group>
        </div>
    )
)

AutoCompleteItem.displayName = 'Auto Item'

export const UserProvidersAuto = () => {
    const watchProviders = useWatchProvidersSWR({})
    const config = useImageConfigSWR()
    const userProviders = useUserProvidersSWR()
    const { createUserProvider, toggleProviderLinked } = useUserProvidersCRUD()
    const [value, setValue] = useState('')

    return (
        <Autocomplete
            placeholder='Netflix...'
            value={value}
            itemComponent={AutoCompleteItem}
            filter={(value, item) =>
                item.provider_name
                    .toLowerCase()
                    .includes(value.trim().toLowerCase())
            }
            onChange={async val => {
                setValue(val)
                const intVal = parseInt(val)
                if (val && intVal) {
                    setValue('')
                    if (userProviders?.some(p => p.tmdb_id === intVal)) {
                        await toggleProviderLinked(intVal)
                    } else {
                        await createUserProvider(intVal)
                    }
                }
            }}
            data={
                watchProviders?.map(p => ({
                    ...p,
                    value: p.provider_id?.toString() || '-1',
                    logo_path: `${config?.base_url}/${
                        config?.logo_sizes[config?.logo_sizes.length - 1]
                    }/${p.logo_path}`,
                    linked:
                        userProviders?.find(i => i.tmdb_id === p.provider_id)
                            ?.linked || false,
                })) || []
            }
        />
    )
}
