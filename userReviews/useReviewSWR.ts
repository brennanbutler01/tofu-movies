import { ReviewOrderBy } from '@/components/movieReviews/ReviewOrderBySelect'
import { Prisma } from '@prisma/client'
import { ReviewWithMovie } from 'pages/api/reviews'
import useSWR from 'swr'

interface IReviewSWR {
    fallbackData?: ReviewWithMovie[]
    orderBy?: ReviewOrderBy
    sortOrder?: Prisma.SortOrder
}

export const useReviewSWR = ({
    fallbackData,
    orderBy = ReviewOrderBy.CREATED,
    sortOrder = 'desc',
}: IReviewSWR) => {
    const data = useSWR(
        '/api/reviews?orderBy=' + orderBy + '&sortOrder=' + sortOrder,
        { fallbackData }
    )
    return {
        data: data.data as ReviewWithMovie[],
        isLoading: (!data.data && !data.error) || data.isValidating,
    }
}
