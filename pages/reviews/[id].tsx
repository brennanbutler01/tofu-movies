import { serializePage } from 'utils/serializePage'
import { DetailButtons } from '@/components/movieDetail/DetailButtons'
import { ReviewBreadcrumbs } from '@/components/movieReviews/ReviewBreadcrumbs'
import { badgeCountWrapper } from '@/components/movieReviews/ReviewGrid'
import { ReviewTable } from '@/components/movieReviews/ReviewTable'
import { PageWrapper } from '@/components/PageWrapper'
import {
    Box,
    Container,
    Divider,
    Grid,
    Group,
    Image,
    Indicator,
    Paper,
    Stack,
    Title,
    TypographyStylesProvider,
    useMantineTheme,
} from '@mantine/core'
import { useMediaQuery, useScrollIntoView } from '@mantine/hooks'
import { GetServerSidePropsContext } from 'next'
import { ReviewWithMovie } from 'pages/api/reviews'
import { getReview } from '../api/reviews/[id]'
import Link from 'next/link'

interface IReviewPage {
    thisReview: ReviewWithMovie
}

const ReviewPage = ({ thisReview }: IReviewPage) => {
    const { targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 60,
    })
    const theme = useMantineTheme()
    const matchesSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`)
    const matchesLarge = useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`)

    return (
        <PageWrapper
            title={`Review ${thisReview?.title} | tofu.movies`}
            authRequired
        >
            <ReviewBreadcrumbs id={thisReview.id} />
            <Container p='xl'>
                <Paper p='xl' radius='md' shadow='md'>
                    <Stack spacing='xl'>
                        <Stack mb={'sm'}>
                            <Group position={'apart'}>
                                <Group>
                                    <Title
                                        sx={theme => ({
                                            background: theme.fn.gradient({
                                                from: theme.colors.pink[8],
                                                to: theme.colors.grape[8],
                                                deg: 45,
                                            }),
                                            display: 'inline-block',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        })}
                                    >
                                        Review for
                                    </Title>
                                    <Title order={1}>
                                        {thisReview.movie.title}
                                    </Title>
                                </Group>
                                {badgeCountWrapper(thisReview)}
                            </Group>
                        </Stack>
                        <Grid>
                            <Grid.Col span={12} sm={4}>
                                <Link
                                    legacyBehavior
                                    href={'/movies/' + thisReview.movie.tmdb_id}
                                    passHref
                                >
                                    <a>
                                        <Image
                                            src={`${thisReview?.movie?.poster}`}
                                            sx={{
                                                ':hover': {
                                                    opacity: 0.85,
                                                },
                                            }}
                                            radius='lg'
                                            alt={`Movie Poster: ${thisReview.movie.title}`}
                                        />
                                    </a>
                                </Link>
                            </Grid.Col>
                            <Grid.Col span={12} sm={8}>
                                <Stack>
                                    <Box mb={'sm'}>
                                        <DetailButtons
                                            tmdb_id={
                                                thisReview.movie
                                                    .tmdb_id as number
                                            }
                                            fullWidth={matchesSmall}
                                            size={
                                                matchesSmall || matchesLarge
                                                    ? 'xl'
                                                    : 'md'
                                            }
                                        />
                                    </Box>
                                    <ReviewTable thisReview={thisReview} />
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={12} sm={12}>
                                <Stack mt={'md'}>
                                    <Title
                                        sx={{
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {thisReview?.title}
                                    </Title>
                                    <Divider />
                                    <TypographyStylesProvider
                                        sx={{
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                        }}
                                    >
                                        <div
                                            ref={targetRef}
                                            dangerouslySetInnerHTML={{
                                                __html: thisReview?.review,
                                            }}
                                        />
                                    </TypographyStylesProvider>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>
            </Container>
        </PageWrapper>
    )
}
export default ReviewPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const id = context?.params?.id

    let thisReview: ReviewWithMovie | null = null

    if (id && !Array.isArray(id)) {
        thisReview = await getReview(id)
    }

    return {
        props: serializePage({ thisReview }),
    }
}
