import { serializePage } from 'utils/serializePage'
import { PageWrapper } from '@/components/PageWrapper'
import { getReviews, ReviewWithMovie } from 'pages/api/reviews'
import { useReviewSWR } from 'userReviews/useReviewSWR'
import { ReviewGrid } from '@/components/movieReviews/ReviewGrid'
import { Group, LoadingOverlay, Paper, Stack, Title } from '@mantine/core'
import {
    OrderByDirections,
    ReviewOrderBy,
} from '@/components/movieReviews/ReviewOrderBySelect'

import { ReviewFilter } from '@/components/movieReviews/ReviewFilter'
import { useState } from 'react'
import { ReviewModalButton } from '@/components/movieReviews/ReviewModalButton'
import { ReviewBreadcrumbs } from '@/components/movieReviews/ReviewBreadcrumbs'
import { getServerSession } from 'next-auth'
import { GetServerSidePropsContext } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

interface IReviews {
    results: ReviewWithMovie[]
}

const Reviews = ({ results }: IReviews) => {
    const { isLoading } = useReviewSWR({ fallbackData: results })
    const [filteredReviews, setFilteredReviews] = useState<ReviewWithMovie[]>(
        []
    )

    return (
        <PageWrapper title={`Reviews | tofu.movies`} authRequired>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <ReviewBreadcrumbs />
                <Title>Reviews</Title>
                <Paper sx={{ background: 'transparent' }}>
                    <Group position={'right'}>
                        <ReviewModalButton button={true} />
                    </Group>
                    <ReviewFilter setFilteredReviews={setFilteredReviews} />
                </Paper>
                <Stack>
                    <ReviewGrid reviews={filteredReviews} />
                </Stack>
            </Stack>
        </PageWrapper>
    )
}
export default Reviews

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)

    return {
        props: serializePage({
            results: await getReviews(
                ReviewOrderBy.CREATED,
                OrderByDirections.DESC,
                session?.user?.userId
            ),
        }),
    }
}
