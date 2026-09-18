import dayjs from '@/dayjs/index'
import { Group, Tooltip, Text, Badge } from '@mantine/core'
import Link from 'next/link'
import { ReviewWithMovie } from 'pages/api/reviews'
import { badgeCountWrapper } from '@/components/movieReviews/ReviewGrid'

interface IReviewMeta {
    review: ReviewWithMovie
    hideTitle?: boolean
}

export const ReviewMeta = ({ review, hideTitle = false }: IReviewMeta) => {
    const {
        movie: { title },
        created,
        reviewer: { name },
    } = review
    return (
        <Group spacing={'lg'}>
            <Group>
                <Text size={'lg'} color='dimmed' span>
                    Rating:
                </Text>
                {badgeCountWrapper(review)}
            </Group>
            {hideTitle ? null : (
                <Link
                    legacyBehavior
                    href={'/movies/' + review.movie.tmdb_id}
                    passHref
                >
                    <a style={{ textDecoration: 'none', color: 'unset' }}>
                        <Group>
                            <Text size={'lg'} color='dimmed'>
                                Film:
                            </Text>
                            <Text size='lg'>{title}</Text>
                        </Group>
                    </a>
                </Link>
            )}
            <Group>
                <Text size={'lg'} color='dimmed' span>
                    Reviewed by:
                </Text>
                <Text size={'lg'} span sx={{ whiteSpace: 'normal' }}>
                    {name || 'Movie fan'}
                </Text>
            </Group>
            <Group>
                <Text size={'lg'} color='dimmed' span>
                    Reviewed:
                </Text>
                <Tooltip
                    withinPortal
                    label={dayjs(created).format('MM-DD-YYYY')}
                >
                    <Badge size='lg'>{dayjs(created).fromNow()}</Badge>
                </Tooltip>
            </Group>
        </Group>
    )
}
