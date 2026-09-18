import {
    Box,
    Text,
    Container,
    SimpleGrid,
    Card,
    Grid,
    Badge,
    Image,
    useMantineTheme,
    Stack,
    LoadingOverlay,
    MantineSize,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Link from 'next/link'
import { ReviewWithMovie } from 'pages/api/reviews'
import LikeDislike from './LikesDislikes'
import { ReviewBody } from './ReviewBody'
import { ReviewMeta } from './ReviewMeta'
import { ReviewModalButton } from './ReviewModalButton'
import { useReviewSWR } from '../../userReviews/useReviewSWR'

interface IReviewGrid {
    reviews: ReviewWithMovie[]
}

export const badgeCountWrapper = ({
    rating,
    size,
}: ReviewWithMovie & { size?: MantineSize }) => (
    <Badge
        variant='filled'
        color={rating > 7 ? 'teal' : rating <= 4 ? 'red' : 'grape'}
        size={size ? size : 'xl'}
    >
        {rating} / 10
    </Badge>
)

export const ReviewGrid = ({ reviews }: IReviewGrid) => {
    const theme = useMantineTheme()
    const matches = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
    const { isLoading, data: swrReviews } = useReviewSWR({
        fallbackData: reviews,
    })
    return (
        <Container p='xl'>
            <SimpleGrid cols={1} spacing='xl'>
                {swrReviews?.length > 0 ? (
                    swrReviews?.map((review, i) => (
                        <Card shadow='lg' radius='md' withBorder key={i}>
                            <Grid
                                justify={'apart'}
                                gutter='xl'
                                align='space-between'
                            >
                                {!matches && (
                                    <Grid.Col span={12}>
                                        <ReviewMeta review={review} />
                                    </Grid.Col>
                                )}
                                <Grid.Col span={12} sm={4}>
                                    <Link
                                        legacyBehavior
                                        passHref
                                        href={'/movies/' + review.movie.tmdb_id}
                                    >
                                        <a>
                                            <Image
                                                src={
                                                    review?.movie?.poster || ''
                                                }
                                                radius='lg'
                                                alt={`Poster for ${review.movie.title}`}
                                            />
                                        </a>
                                    </Link>
                                </Grid.Col>
                                <Grid.Col span={12} sm={8}>
                                    {matches ? (
                                        <ReviewMeta review={review} />
                                    ) : (
                                        <ReviewBody
                                            matches={matches}
                                            review={review}
                                        />
                                    )}
                                </Grid.Col>

                                {matches && (
                                    <Grid.Col span={12}>
                                        <ReviewBody
                                            matches={matches}
                                            review={review}
                                        />
                                    </Grid.Col>
                                )}
                                <Card.Section inheritPadding>
                                    <LikeDislike reviewId={review.id} />
                                </Card.Section>
                            </Grid>
                        </Card>
                    ))
                ) : isLoading ? (
                    <LoadingOverlay visible={true} />
                ) : (
                    <Container>
                        <Stack>
                            <Box>
                                <Text weight={700} size='xl'>
                                    Movie List Empty!
                                </Text>
                                <Text align='center' color='dimmed'>
                                    Search and add some movies to the list to
                                    get started!
                                </Text>
                            </Box>
                            <Image
                                src={'/empty-vector.png'}
                                height={320}
                                radius='lg'
                                alt='Image to display when we have no movies in the list'
                            />
                            <ReviewModalButton button />
                        </Stack>
                    </Container>
                )}
            </SimpleGrid>
        </Container>
    )
}
