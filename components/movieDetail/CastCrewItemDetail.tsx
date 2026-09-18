import Link from 'next/link'
import { Image, Text } from '@mantine/core'
import React from 'react'
import { CastCrewItemProps } from '@/components/movieDetail/CastCrewItem'

const CastCrewItemDetail = ({ castCrew, config }: CastCrewItemProps) => {
    return (
        <Link legacyBehavior href={'/person/' + castCrew.id} passHref>
            <a
                style={{
                    textDecoration: 'none',
                }}
            >
                <Image
                    src={`${config.base_url}/${config.profile_sizes[2]}/${castCrew.profile_path}`}
                    height={400}
                    caption={
                        <Text weight={700} size='xl'>
                            {castCrew.name} as{' '}
                            {'character' in castCrew
                                ? castCrew?.character
                                : 'job' in castCrew
                                ? castCrew?.job
                                : ''}
                        </Text>
                    }
                    radius='md'
                    sx={{
                        ':hover': {
                            opacity: 0.85,
                        },
                    }}
                    alt={`Picture of person - ${castCrew?.name}`}
                />
            </a>
        </Link>
    )
}
export default CastCrewItemDetail
