import {
    Autocomplete,
    AutocompleteItem,
    Avatar,
    Group,
    MantineColor,
    MantineSize,
    MediaQuery,
    Select,
    SelectItemProps,
    Text,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import axios from 'axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { IMovieAPIResults } from 'pages/api/search/[...params]'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { UseFormReturnType } from '@mantine/form'
import { IReviewForm } from '@/components/movieReviews/ReviewForm'
import { IPersonAPIResults } from 'pages/api/people'

interface ItemProps extends SelectItemProps {
    color: MantineColor
}

type OurItemProps = ItemProps & IMovieAPIResults & IPersonAPIResults

const AutoCompleteItem = forwardRef<HTMLDivElement, OurItemProps>(
    (
        {
            value,
            title,
            poster_path,
            overview,
            release_date,
            profile_path,
            // group,
            adult,
            video,
            ...others
        }: OurItemProps,
        ref
    ) =>
        value === 'View all' ? (
            <div ref={ref} {...others}>
                <Text
                    sx={theme => ({
                        border: '1px solid',
                        borderColor:
                            theme.colorScheme === 'light'
                                ? theme.colors.grape[7]
                                : theme.colors.grape[9],
                    })}
                    align='center'
                >
                    view all results
                </Text>
            </div>
        ) : (
            <div ref={ref} {...others} key={`${value} ${poster_path}`}>
                <Group noWrap>
                    {poster_path && <Avatar src={poster_path} size='md' />}
                    {profile_path && (
                        <Avatar src={profile_path} size='md' radius='sm' />
                    )}
                    <Group align='center'>
                        <Text>
                            {value}{' '}
                            {release_date && (
                                <Text span>({dayjs(release_date).year()})</Text>
                            )}
                        </Text>
                    </Group>
                </Group>
            </div>
        )
)

AutoCompleteItem.displayName = 'Auto Item'

interface ISearchAuto {
    redirectOnClick?: boolean
    showViewAll?: boolean
    form?: UseFormReturnType<IReviewForm>
}

type SearchFilters = 'Movies' | 'People'

export function SearchAuto({
    redirectOnClick = true,
    showViewAll = true,
    form,
}: ISearchAuto) {
    const [value, setValue] = useState('')
    const [debounced] = useDebouncedValue(value, 250)
    const [data, setData] = useState<(IMovieAPIResults | IPersonAPIResults)[]>(
        []
    )
    const [searchFilter, setSearchFilter] = useState<SearchFilters>('Movies')
    const [loading, setLoading] = useState(false)
    const { push } = useRouter()
    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const searchData = async () => {
            setLoading(true)
            if (searchFilter === 'Movies') {
                await axios
                    .get('/api/remoteMovies', { params: { query: debounced } })
                    .then(res => {
                        setData(res.data)
                    })
                    .catch(console.error)
            } else {
                await axios
                    .get('/api/people/', { params: { query: debounced } })
                    .then(res => {
                        setData(res.data)
                    })
                    .catch(console.error)
            }
            setLoading(false)
        }

        if (debounced) {
            searchData()
                .then(() => console.log('searching'))
                .catch(console.error)
        }
    }, [debounced, searchFilter])

    const viewAll = {
        label: 'View all',
        value: 'View all',
    }

    const filterItems = (value: string, item: AutocompleteItem) =>
        item?.value?.toLowerCase()?.includes(value?.toLowerCase()?.trim())

    // we need to go through our movieData and add the view more if needed
    const slicedData = (
        value !== '' &&
        data.filter(item => filterItems(value, item))?.length >= 1
            ? [...data?.slice(0, 4), ...(showViewAll ? [viewAll] : [])]
            : data
    )
        //we want to make sure that we have a unique key and the value is not sufficient, so this should fix that. Otherwise, we end up showing too many items when we have duplicate keys.
        .map((item, index) => ({ ...item, key: `${item.value}${index}` }))

    const auto = (size: MantineSize) => (
        <Autocomplete
            id='movieSearch'
            aria-label='Search input'
            placeholder={
                searchFilter === 'Movies'
                    ? 'Search for movies'
                    : 'Search for people'
            }
            itemComponent={AutoCompleteItem}
            icon={<BiSearch />}
            limit={5}
            data={slicedData}
            value={value}
            {...(value && {
                nothingFound: loading
                    ? 'Fetching results...'
                    : 'Nothing found - Please enter a new search',
            })}
            {...(!form && {
                rightSectionWidth: 100,
                rightSection: (
                    <Select
                        mr='lg'
                        size='xs'
                        radius='xl'
                        data={['Movies', 'People']}
                        value={searchFilter}
                        onChange={val => setSearchFilter(val as SearchFilters)}
                    />
                ),
            })}
            radius='md'
            variant='filled'
            onChange={val => val !== 'View all' && setValue(val)}
            filter={(value, item) =>
                filterItems(value, item) || item.value === 'View all'
            }
            ref={ref}
            onItemSubmit={async (item: OurItemProps) =>
                redirectOnClick && item.value !== 'View all'
                    ? await push(
                          (searchFilter === 'Movies'
                              ? '/movies/'
                              : '/person/') + item.id
                      )
                    : item.value === 'View all'
                    ? searchFilter === 'Movies'
                        ? await push('/search?q=' + debounced)
                        : await push('/search/people?q=' + debounced)
                    : form
                    ? form.setFieldValue('movie', item.id)
                    : null
            }
            size={size}
        />
    )

    return (
        <>
            <MediaQuery largerThan={'xs'} styles={{ display: 'none' }}>
                {auto('sm')}
            </MediaQuery>
            <MediaQuery smallerThan={'xs'} styles={{ display: 'none' }}>
                {auto('md')}
            </MediaQuery>
        </>
    )
}
