import { Avatar, Group, Text } from '@mantine/core'
import { IRating, RatingSources } from 'utils/movieRatings'

export const RatingIcon = ({ Source, Value }: IRating) => {
    const config: Record<
        RatingSources,
        { value: string; icon: string; source: RatingSources }
    > = {
        'Internet Movie Database': {
            icon: '/imdb.png',
            source: RatingSources.IMDB,
            value: Value || 'N/A',
        },
        Metacritic: {
            icon: '/metacritic.png',
            source: RatingSources.META,
            value: Value || 'N/A',
        },
        'Rotten Tomatoes': {
            icon: '/rottentomatoes.png',
            source: RatingSources.RT,
            value: Value || 'N/A',
        },
    }

    return (
        <>
            {Source && (
                <Group spacing={'xs'} align='center'>
                    <Avatar src={config[Source]?.icon} />
                    <Text size='xl'>{config[Source]?.value}</Text>
                </Group>
            )}
        </>
    )
}
