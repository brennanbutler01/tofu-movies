import {
    Avatar,
    Button,
    Checkbox,
    Group,
    Input,
    LoadingOverlay,
    MultiSelect,
    Stack,
    Textarea,
    TextInput,
    Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { closeAllModals } from '@mantine/modals'
import { useMovieListsCRUD } from 'movieLists/useMovieListsCRUD'
import { MovieListTitles } from '../search/MovieListMenu'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { IMovieAPIResults } from 'pages/api/search/[...params]'
import axios from 'axios'
import dayjs from 'dayjs'
import { BiUpload } from 'react-icons/bi'
import { FormFileUpload } from '../FormFileUpload'
import { useSession } from 'next-auth/react'

export interface IMovieListForm {
    title: string
    description: string
    isPublic: boolean
    movies: string[]
    image: string
    createdBy: string
    allowEdits: boolean
}

//TODO - allow users to upload list images

export const MovieListForm = () => {
    const { createMovieList } = useMovieListsCRUD()
    const [movieValue, setMovieValue] = useState('')
    const [debounced] = useDebouncedValue(movieValue, 250)
    const { data } = useSession()

    const form = useForm<IMovieListForm>({
        initialValues: {
            description: '',
            isPublic: false,
            title: '',
            movies: [],
            image: '',
            allowEdits: true,
            createdBy: data?.user?.email || 'System Generated',
        },

        validate: {
            title: (value, values) =>
                value === MovieListTitles.Watchlist && values.isPublic
                    ? 'Please use another title, this one is reserved!'
                    : value?.length > 35
                    ? 'Max title length of 35 characters, please enter a shorter one. Current length: ' +
                      value?.length
                    : null,
        },
    })

    const [movieData, setMovieData] = useState<IMovieAPIResults[]>([])

    useEffect(() => {
        const search = async () =>
            await axios
                .get('/api/remoteMovies', { params: { query: debounced } })
                .then(res => setMovieData(res.data))
                .catch(console.error)

        if (debounced) {
            search()
                .then(() => console.log('searching'))
                .catch(console.error)
        }
    }, [debounced])

    const [loading, setLoading] = useState(false)
    const [saveError, setSaveError] = useState<string>()

    return (
        <form
            onSubmit={form.onSubmit(async val => {
                setLoading(true)
                setSaveError(undefined)
                try {
                    await createMovieList(
                        val.title,
                        val.description,
                        val.isPublic,
                        val.movies.map(Number),
                        val.image,
                        val.allowEdits
                    )
                    closeAllModals()
                } catch {
                    setSaveError(
                        'Could not save your list. Your changes are still here; please retry.'
                    )
                } finally {
                    setLoading(false)
                }
            })}
        >
            <LoadingOverlay
                visible={loading}
                overlayBlur={2}
                title='Creating'
            />
            <Stack spacing='xl'>
                {saveError && (
                    <Text role='alert' color='red'>
                        {saveError}
                    </Text>
                )}
                <TextInput
                    placeholder='Horror Movies'
                    label='List Title'
                    required
                    {...form.getInputProps('title')}
                />
                {process.env.NEXT_PUBLIC_VISITOR_DEMO !== 'true' && (
                    <FormFileUpload
                        form={form}
                        setLoading={setLoading}
                        icon={<BiUpload />}
                        label={'List Image'}
                        rightSection={
                            form.values.image && (
                                <Avatar
                                    size={'sm'}
                                    mr={'sm'}
                                    src={form.values.image}
                                />
                            )
                        }
                    />
                )}
                <Textarea
                    required
                    placeholder='These are great movies to watch around Halloween'
                    label='List Description'
                    {...form.getInputProps('description')}
                />
                <MultiSelect
                    data={movieData
                        ?.filter(movie => movie?.title)
                        .map(m => ({
                            label: `${m.title} ${
                                dayjs(m.release_date)?.isValid()
                                    ? `(${dayjs(m.release_date)?.year()})`
                                    : ''
                            }`,
                            value: String(m.id),
                        }))}
                    searchable
                    label={'List Movies'}
                    onSearchChange={setMovieValue}
                    placeholder={'Search Movies to add to list'}
                    {...form.getInputProps('movies')}
                />
                <Input.Wrapper
                    inputWrapperOrder={['label', 'input', 'description']}
                    description='Do you want others to see this list?'
                    descriptionProps={{ mt: 5 }}
                >
                    <Checkbox
                        label='List Public?'
                        {...form.getInputProps('isPublic', {
                            type: 'checkbox',
                        })}
                        mt={5}
                    />
                </Input.Wrapper>
                <Input.Wrapper
                    inputWrapperOrder={['label', 'input', 'description']}
                    description='Do you want others to be able to make changes to this list?'
                    descriptionProps={{ mt: 5 }}
                >
                    <Checkbox
                        label='Allow others to edit?'
                        {...form.getInputProps('allowEdits', {
                            type: 'checkbox',
                        })}
                        mt={5}
                    />
                </Input.Wrapper>

                <Group>
                    <Button
                        variant='default'
                        color='red'
                        onClick={() => closeAllModals()}
                    >
                        Cancel
                    </Button>
                    <Button type='submit'>Create</Button>
                </Group>
            </Stack>
        </form>
    )
}
