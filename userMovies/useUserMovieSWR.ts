import { UserMovie } from '@prisma/client'
import useSWR from 'swr'

interface IUseUserMovieSWR {
    fallbackData?: Array<UserMovie>
}

export const useUserMovieSWR = ({ fallbackData }: IUseUserMovieSWR) => {
    const data = useSWR('/api/userMovies', { fallbackData })
    return data.data as UserMovie[]
}
