import {
    Button,
    Stack,
    Text,
    TextInput,
    Textarea,
    NumberInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { openModal, closeAllModals } from '@mantine/modals'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import axios from 'axios'
import type { ReviewWithMovie } from 'pages/api/reviews'

function Editor({ review }: { review: ReviewWithMovie }) {
    const form = useForm({
        initialValues: {
            title: review.title,
            review: review.review,
            rating: review.rating,
        },
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
                    await axios.put('/api/reviews/' + review.id, values)
                    await Promise.all(
                        ['created', 'rating'].flatMap(orderBy =>
                            ['asc', 'desc'].map(sortOrder =>
                                mutate(
                                    `/api/reviews?orderBy=${orderBy}&sortOrder=${sortOrder}`
                                )
                            )
                        )
                    )
                    await router.replace(router.asPath)
                    closeAllModals()
                } catch {
                    setError(
                        'Could not update your review. Your text is still here.'
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
                    label='Review Title'
                    required
                    maxLength={200}
                    {...form.getInputProps('title')}
                />
                <Textarea
                    label='Review text'
                    required
                    minRows={6}
                    maxLength={20000}
                    {...form.getInputProps('review')}
                />
                <NumberInput
                    label='Rating'
                    required
                    min={1}
                    max={10}
                    {...form.getInputProps('rating')}
                />
                <Button loading={busy} type='submit'>
                    Save changes
                </Button>
            </Stack>
        </form>
    )
}
export function ReviewEditor({ review }: { review: ReviewWithMovie }) {
    return (
        <Button
            variant='light'
            onClick={() =>
                openModal({
                    title: 'Edit review',
                    children: <Editor review={review} />,
                })
            }
        >
            Edit review
        </Button>
    )
}
