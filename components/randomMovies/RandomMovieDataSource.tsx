import {
    Accordion,
    Button,
    Menu,
    MultiSelect,
    SegmentedControl,
    Stack,
    useMantineTheme,
} from '@mantine/core'
import { RandomMovieSources } from 'pages/randomMovie'
import { IMDBFilter } from '@/components/randomMovies/IMDBFilter'
import React from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { FiSettings } from 'react-icons/fi'
import { useMovieListsSWR } from '../../movieLists/useMovieListsSWR'

interface IRandomMovieDataSource {
    segmentedValue: RandomMovieSources
    setSegmentedValue: React.Dispatch<React.SetStateAction<RandomMovieSources>>
    filterByIMDB: boolean
    setFilterByIMDB: React.Dispatch<React.SetStateAction<boolean>>
    imdbRating: number | undefined
    setImdbRating: React.Dispatch<React.SetStateAction<number | undefined>>
    movieLists: Array<string>
    setMovieLists: React.Dispatch<React.SetStateAction<Array<string>>>
}

export const RandomMovieDataSource = ({
    segmentedValue,
    setSegmentedValue,
    filterByIMDB,
    setFilterByIMDB,
    imdbRating,
    setImdbRating,
    movieLists,
    setMovieLists,
}: IRandomMovieDataSource) => {
    const theme = useMantineTheme()
    const matchesXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
    const segmentedData = [
        { label: 'All Movies', value: 'all' },
        { label: 'Your list movies', value: 'lists' },
        { label: 'Your streaming providers', value: 'providers' },
    ]
    const { data: swrMovieLists } = useMovieListsSWR({})
    return (
        <Stack spacing={'xs'}>
            {matchesXs ? (
                <Menu shadow={'sm'} withinPortal>
                    <Menu.Target>
                        <Button leftIcon={<FiSettings />} variant={'subtle'}>
                            Data Source
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Data Sources</Menu.Label>
                        {segmentedData.map(i => (
                            <Menu.Item
                                disabled={i?.value === segmentedValue}
                                key={i.label}
                                onClick={() =>
                                    setSegmentedValue(
                                        i.value as RandomMovieSources
                                    )
                                }
                            >
                                {i.label}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <SegmentedControl
                    radius='md'
                    value={segmentedValue}
                    onChange={val =>
                        setSegmentedValue(val as RandomMovieSources)
                    }
                    data={segmentedData}
                />
            )}
            {segmentedValue === 'providers' && (
                <IMDBFilter
                    filterByIMDB={filterByIMDB}
                    setFilterByIMDB={setFilterByIMDB}
                    imdbRating={imdbRating}
                    setImdbRating={setImdbRating}
                />
            )}
            {segmentedValue === 'lists' && (
                <Accordion variant={'filled'}>
                    <Accordion.Item value={'config'}>
                        <Accordion.Control>Configure Lists</Accordion.Control>
                        <Accordion.Panel>
                            <MultiSelect
                                sx={{ maxWidth: '250px' }}
                                dropdownPosition='flip'
                                searchable
                                onChange={setMovieLists}
                                value={movieLists}
                                placeholder={'Show Lists'}
                                description={
                                    'Select which lists to search from.'
                                }
                                data={swrMovieLists
                                    ?.filter(l => l.movies.length > 0)
                                    ?.map(list => ({
                                        label: list.title,
                                        value: list.id,
                                    }))}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            )}
        </Stack>
    )
}
