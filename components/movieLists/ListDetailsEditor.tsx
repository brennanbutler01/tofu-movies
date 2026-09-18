import { Button, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { openModal, closeAllModals } from '@mantine/modals'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import axios from 'axios'
import type { FullMovieList } from 'server/movieLists'

function Editor({ list }: { list: FullMovieList }) {
    const form = useForm({
        initialValues: { title: list.title, description: list.description },
    })
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string>()
    const router = useRouter()
    const { mutate } = useSWRConfig()
    return (
        <form
            onSubmit={form.onSubmit(async values => {
                setBusy(true)
                setError(undefined)
                try {
                    await axios.put('/api/movieLists/' + list.id, values)
                    await mutate('/api/movieLists')
                    await router.replace(router.asPath)
                    closeAllModals()
                } catch {
                    setError(
                        'Could not update the list. Your changes are still here.'
                    )
                } finally {
                    setBusy(false)
                }
            })}
        >
            <Stack>
                {error && (
                    <Text role='alert' color='red'>
                        {error}
                    </Text>
                )}
                <TextInput
                    label='List Title'
                    required
                    maxLength={100}
                    {...form.getInputProps('title')}
                />
                <Textarea
                    label='List Description'
                    maxLength={2000}
                    {...form.getInputProps('description')}
                />
                <Button loading={busy} type='submit'>
                    Save changes
                </Button>
            </Stack>
        </form>
    )
}
export function ListDetailsEditor({ list }: { list: FullMovieList }) {
    return (
        <Button
            variant='light'
            onClick={() =>
                openModal({
                    title: 'Edit list',
                    children: <Editor list={list} />,
                })
            }
        >
            Edit list
        </Button>
    )
}
