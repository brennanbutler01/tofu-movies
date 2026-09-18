import Link from 'next/link'
import { Box, Image, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { ICarouselItem } from '@/components/movieCarousel/CarouselItem'
import { useEffect, useState } from 'react'

const CarouselItemDetail = ({ movie }: ICarouselItem) => {
    const [src, setSrc] = useState<string | undefined>(undefined)

    useEffect(() => {
        setSrc(movie.poster || undefined)
    }, [movie])
    return (
        <Stack>
            <Link legacyBehavior passHref href={`/movies/${movie.tmdb_id}`}>
                <a>
                    <Image
                        radius={'md'}
                        src={src}
                        height={500}
                        sx={() => ({
                            ':hover': {
                                opacity: '.85',
                            },
                            height: '100%',
                        })}
                        alt={`Poster for ${movie.title}`}
                        withPlaceholder={!src}
                        placeholder={
                            <Box
                                sx={theme => ({
                                    background: theme.fn.gradient(
                                        theme.other.errorGradient
                                    ),
                                    display: 'flex',
                                    flex: 'auto',
                                    height: '100%',
                                    borderRadius: theme.radius.md,
                                })}
                            />
                        }
                    />
                </a>
            </Link>
            <Text size='lg' weight={700}>
                {movie.title}{' '}
                {dayjs(movie.release_date).isValid()
                    ? `(${dayjs(movie.release_date).year()})`
                    : ''}
            </Text>
        </Stack>
    )
}
export default CarouselItemDetail
