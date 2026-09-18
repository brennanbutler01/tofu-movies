import { FullMovieList } from 'pages/api/movieLists'
import useSWR from 'swr'

interface IPublicMovieList {
    fallbackData?: FullMovieList[]
}

export const usePublicMovieListSWR = ({ fallbackData }: IPublicMovieList) => {
    const data = useSWR('/api/movieLists/public', { fallbackData })
    return {
        data: data?.data as FullMovieList[],
        isLoading: (!data.error && !data.data) || data.isValidating,
    }
}
