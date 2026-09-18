import { SimpleGrid } from '@mantine/core'
import { FullMovieList } from 'pages/api/movieLists'
import { useMemo } from 'react'
import MovieListItem from './MovieListItem'
import { ListTabs } from './MovieListTabs'

interface IMovieListGrid {
    filteredLists: FullMovieList[]
    tabFilter: ListTabs
}

export const MovieListGrid = ({ filteredLists, tabFilter }: IMovieListGrid) => {
    const gridItems = useMemo(() => {
        return filteredLists?.map(list => (
            <MovieListItem list={list} key={list.id} tabFilter={tabFilter} />
        ))
    }, [filteredLists, tabFilter])

    return (
        <SimpleGrid
            breakpoints={[
                { minWidth: 'sm', cols: 2 },
                { minWidth: 'md', cols: 3 },
                { minWidth: 'lg', cols: 4 },
                { minWidth: 'xl', cols: 5 },
                { minWidth: 2200, cols: 6 },
            ]}
        >
            {gridItems}
        </SimpleGrid>
    )
}
