import Link from 'next/link'
import { Image, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { IConfig } from '../../pages/api/config'
import { IRecommendationResult } from '../../pages/api/recommendations'

interface Props {
    config: IConfig
    movie: IRecommendationResult
}

const RecommendationItemDetail = ({ config, movie }: Props) => {
    return (
        <>
            <Link legacyBehavior href={`/movies/${movie.id}`} passHref>
                <a>
                    <Image
                        src={
                            movie.poster_path
                                ? `${config?.base_url}/${
                                      config?.poster_sizes[
                                          config.poster_sizes.length - 1
                                      ]
                                  }/${movie.poster_path}`
                                : undefined
                        }
                        withPlaceholder
                        placeholder={
                            <Text align='center' p='md'>
                                {movie.title}
                            </Text>
                        }
                        height={450}
                        radius='md'
                        sx={{
                            ':hover': {
                                opacity: 0.85,
                            },
                        }}
                        alt={`Poster for ${movie?.title}`}
                    />
                </a>
            </Link>
            <Text size='lg' weight={700}>
                {movie.title}{' '}
                {dayjs(movie.release_date).isValid()
                    ? `(${dayjs(movie.release_date)?.year()})`
                    : ''}
            </Text>
        </>
    )
}

export default RecommendationItemDetail
