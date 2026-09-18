import { useSession } from 'next-auth/react'
import { MovieWithLists } from 'pages/api/movies'
import useSWR from 'swr'

interface ISWRProps {
    fallbackData?: MovieWithLists[]
}
export const useMovieSWR = (props: ISWRProps) => {
    const session = useSession()
    const data = useSWR(
        () => (session?.status === 'authenticated' ? '/api/movies' : null),
        {
            fallbackData: props?.fallbackData,
        }
    )
    return data.data as MovieWithLists[]
}
