import {
    Button,
    Group,
    Input,
    LoadingOverlay,
    Slider,
    Stack,
    TextInput,
    Textarea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { useReviewCRUD } from 'userReviews/useReviewCRUD'
import { SearchAuto } from '@/components/nav/SearchAuto'

export interface IReviewForm {
    title: string
    rating: number
    review: string
    movie?: number
}

interface ITmdb {
    tmdb_id?: number
}

export const ReviewForm = ({ tmdb_id }: ITmdb) => {
    const [richValue, setRichValue] = useState('')
    const [errors, setErrors] = useState<Record<keyof IReviewForm, string>>({
        rating: '',
        review: '',
        title: '',
        movie: '',
    })
    const [loading, setLoading] = useState(false)

    const form = useForm<IReviewForm>({
        initialValues: {
            title: '',
            rating: 9,
            review: '',
        },

        validate: {
            review: value =>
                value.length < 50
                    ? 'Please enter a review that is a bit longer to be more useful to others.'
                    : undefined,
            title: value =>
                value.length < 6
                    ? 'Please enter a title that is at least 6 characters.'
                    : undefined,
        },
    })

    const { createReview } = useReviewCRUD()

    const resetErrors = () =>
        setErrors({ rating: '', review: '', title: '', movie: '' })

    const handleCancel = () => {
        form.reset()
        closeAllModals()
        resetErrors()
    }

    const handleSubmit = async (props: IReviewForm) => {
        setLoading(true)
        if (tmdb_id) {
            resetErrors()
            await createReview(props, tmdb_id)
        } else {
            const { movie: tmdb_id, ...values } = props
            if (tmdb_id) {
                await createReview(values, tmdb_id)
            }
        }
        setLoading(false)
        closeAllModals()
    }

    return (
        <form
            name='review'
            onSubmit={form.onSubmit(handleSubmit, formErrors =>
                setErrors({ ...errors, ...formErrors })
            )}
        >
            <Stack>
                <LoadingOverlay visible={loading} />
                {!tmdb_id && (
                    <Input.Wrapper
                        required
                        label={'Movie to Review'}
                        description={'Select the movie you will review'}
                    >
                        <SearchAuto
                            showViewAll={false}
                            redirectOnClick={false}
                            form={form}
                        />
                    </Input.Wrapper>
                )}
                <TextInput
                    required
                    label='Review Title'
                    placeholder='Man on Fire - Tony is better than Ridley!'
                    description='Craft a memorable title for your review.'
                    {...form.getInputProps('title')}
                />
                <Input.Wrapper
                    required
                    label='Rating'
                    description='Rate the movie from 1-10 based on your opinion.'
                >
                    <Slider
                        min={1}
                        max={10}
                        defaultValue={5}
                        thumbLabel='Rating Thumb Label'
                        marks={[
                            { value: 1 },
                            { value: 2 },
                            { value: 3 },
                            { value: 4 },
                            { value: 5 },
                            { value: 6 },
                            { value: 7 },
                            { value: 8 },
                            { value: 9 },
                            { value: 10 },
                        ]}
                        {...form.getInputProps('rating')}
                    />
                </Input.Wrapper>
                <Input.Wrapper
                    required
                    label='Review'
                    description='The body of your review - say what interested you, why others should watch this film, explore connections to other works'
                    error={errors['review'] || null}
                >
                    <Textarea
                        minRows={6}
                        label='Review text'
                        placeholder='What worked for you, and who would enjoy this film?'
                        {...form.getInputProps('review')}
                    />
                </Input.Wrapper>
                <Group position='right'>
                    <Button
                        variant='light'
                        color={'gray'}
                        type='reset'
                        form='review'
                        onClick={handleCancel}
                    >
                        Discard
                    </Button>
                    <Button variant='filled' type='submit'>
                        Write Review
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
