import { Carousel } from '@mantine/carousel'
import { Box, Card, Group, Stack, useMantineTheme } from '@mantine/core'
import { ReviewWithMovie } from 'pages/api/reviews'
import { useReviewSWR } from 'userReviews/useReviewSWR'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import { badgeCountWrapper } from './ReviewGrid'
import { ReviewMeta } from '@/components/movieReviews/ReviewMeta'
import { ReviewBody } from '@/components/movieReviews/ReviewBody'
import { useMediaQuery } from '@mantine/hooks'

export const ReviewCarousel = ({ tmdb_id }: { tmdb_id: number }) => {
    const { goBack, goForward, setEmbla } = useEmbla()

    const { data: swrReviews } = useReviewSWR({})
    const thisMoviesReviews = swrReviews?.filter(
        review => review.movie.tmdb_id === tmdb_id
    )
    const theme = useMantineTheme()
    const matches = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
    const reviewSlide = (review: ReviewWithMovie) => (
        <Carousel.Slide
            key={review.id}
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Box
                sx={_theme => ({
                    '& >div': {
                        height: '500px',
                    },
                })}
            >
                <Card shadow='lg' radius='md' withBorder p={'lg'}>
                    <Stack
                        p={'md'}
                        sx={{ height: '100%' }}
                        justify={'space-between'}
                    >
                        <ReviewMeta review={review} hideTitle />
                        <ReviewBody sm matches={matches} review={review} />
                    </Stack>
                </Card>
            </Box>
        </Carousel.Slide>
    )

    return (
        <>
            {thisMoviesReviews?.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CarouselTitleControls
                        goBack={goBack}
                        goForward={goForward}
                        title={'Reviews'}
                    />
                    <Carousel
                        getEmblaApi={setEmbla}
                        slideSize='100%'
                        breakpoints={[
                            { minWidth: 'xs', slideSize: '100%' },
                            { minWidth: 'sm', slideSize: '50%' },
                            {
                                minWidth: 'md',
                                slideSize: '33.33333333333%',
                            },
                        ]}
                        slideGap='md'
                        withControls={false}
                        withIndicators={false}
                        align='start'
                        height={500}
                    >
                        {thisMoviesReviews.map(reviewSlide)}
                    </Carousel>
                </Box>
            )}
        </>
    )
}
