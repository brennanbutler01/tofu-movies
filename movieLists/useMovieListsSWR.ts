import { useSession } from 'next-auth/react'
import { FullMovieList } from 'pages/api/movieLists'
import useSWR from 'swr'

interface IMovieList {
    fallbackData?: FullMovieList[]
}

export const useMovieListsSWR = ({ fallbackData }: IMovieList) => {
    const { status } = useSession()
    const data = useSWR(
        () => (status === 'authenticated' ? '/api/movieLists' : null),
        { fallbackData }
    )

    return {
        data: data.data as FullMovieList[],
        isLoading: (!data.data && !data.error) || data.isValidating,
    }
}
