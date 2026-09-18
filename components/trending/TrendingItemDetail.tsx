import Link from 'next/link'
import { Image, Stack, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { TrendingItemProps } from '@/components/trending/TrendingItem'

const TrendingItemDetail = ({ trending, config }: TrendingItemProps) => {
    return (
        <Stack>
            <Link legacyBehavior href={'/movies/' + trending?.id} passHref>
                <a>
                    <Image
                        height={340}
                        withPlaceholder={!trending.poster_path}
                        placeholder={
                            <Text p='xl' size='xl' weight={700}>
                                {trending.title}
                            </Text>
                        }
                        src={
                            trending.poster_path
                                ? `${config.base_url}/${config.poster_sizes.at(
                                      -1
                                  )}${trending.poster_path}`
                                : undefined
                        }
                        radius='md'
                        sx={theme => ({
                            ':hover': {
                                opacity: 0.85,
                                radius: theme.radius.md,
                            },
                        })}
                        alt={`Poster for ${trending?.title}`}
                    />
                </a>
            </Link>
            <Text size='lg' weight={700}>
                {trending?.title}{' '}
                {dayjs(trending?.release_date)?.isValid()
                    ? `(${dayjs(trending?.release_date).year()})`
                    : null}
            </Text>
        </Stack>
    )
}
export default TrendingItemDetail
