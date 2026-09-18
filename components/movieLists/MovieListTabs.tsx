import { LoadingOverlay, SegmentedControl, Stack, Tabs } from '@mantine/core'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { usePublicMovieListSWR } from 'movieLists/usePublicMovieListSWR'
import { FullMovieList } from 'pages/api/movieLists'
import { useState, useEffect } from 'react'
import { BiListUl, BiWorld } from 'react-icons/bi'
import { MovieListGrid } from './MovieListGrid'
import NoLists from '@/components/movieLists/NoLists'

interface IMovieListTabs {
    search: string
}

export type ListTabs = 'connected' | 'public'
export type SegmentedValues = 'all' | 'public' | 'private'

export const MovieListTabs = ({ search }: IMovieListTabs) => {
    const { data: swrMovieLists, isLoading } = useMovieListsSWR({})
    const { data: publicSWRMovieLists, isLoading: publicLoading } =
        usePublicMovieListSWR({})
    const [filteredLists, setFilteredLists] = useState<FullMovieList[]>([])
    const [tabValue, setTabValue] = useState<ListTabs>('connected')
    const [segmentedValue, setSegmentedValue] = useState<SegmentedValues>('all')

    useEffect(() => {
        const filterList = (list: FullMovieList) =>
            list.title
                .toLowerCase()
                .trim()
                .includes(search.toLowerCase().trim())

        const filterSegmented = (list: FullMovieList) => {
            if (segmentedValue === 'all') {
                return list
            } else if (segmentedValue === 'private') {
                return !list?.isPublic
            }
            return list?.isPublic
        }
        setFilteredLists(
            (tabValue === 'connected'
                ? swrMovieLists?.filter(filterSegmented)
                : publicSWRMovieLists
            )?.filter(filterList)
        )
    }, [search, swrMovieLists, tabValue, segmentedValue, publicSWRMovieLists])

    return (
        <Tabs
            value={tabValue}
            onTabChange={val => setTabValue(val as ListTabs)}
        >
            <Tabs.List mb='lg'>
                <Tabs.Tab value='connected' icon={<BiListUl />}>
                    Connected lists
                </Tabs.Tab>
                <Tabs.Tab value='public' icon={<BiWorld />}>
                    Public Lists
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value='connected'>
                <Stack>
                    <SegmentedControl
                        value={segmentedValue}
                        onChange={val =>
                            setSegmentedValue(val as SegmentedValues)
                        }
                        data={[
                            { label: 'All', value: 'all' },
                            { label: 'Public', value: 'public' },
                            { label: 'Private', value: 'private' },
                        ]}
                    />
                    {swrMovieLists &&
                    publicSWRMovieLists &&
                    filteredLists?.length > 0 ? (
                        <MovieListGrid
                            filteredLists={filteredLists}
                            tabFilter={tabValue}
                        />
                    ) : isLoading || publicLoading ? (
                        <LoadingOverlay visible />
                    ) : (
                        <NoLists />
                    )}
                </Stack>
            </Tabs.Panel>
            <Tabs.Panel value='public'>
                {swrMovieLists &&
                publicSWRMovieLists &&
                filteredLists?.length > 0 ? (
                    <MovieListGrid
                        filteredLists={filteredLists}
                        tabFilter={tabValue}
                    />
                ) : isLoading || publicLoading ? (
                    <LoadingOverlay visible />
                ) : (
                    <NoLists />
                )}
            </Tabs.Panel>
        </Tabs>
    )
}
