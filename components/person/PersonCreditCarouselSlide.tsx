import Link from 'next/link'
import { Box, Image, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { Carousel } from '@mantine/carousel'
import { useImageConfigSWR } from 'imageConfig/useImageConfigSWR'
import { IPersonCastCredits, IPersonCrewCredits } from 'pages/api/people/[id]'

interface IPersonCreditCarouselSlide {
    credit: IPersonCrewCredits | IPersonCastCredits
}

export const PersonCreditCarouselSlide = ({
    credit,
}: IPersonCreditCarouselSlide) => {
    const config = useImageConfigSWR()
    return (
        <Carousel.Slide key={credit.id}>
            <Link legacyBehavior href={'/movies/' + credit.id} passHref>
                <a>
                    <Image
                        height={375}
                        src={`${config?.base_url}/${
                            config?.poster_sizes[
                                config?.poster_sizes?.length - 1
                            ]
                        }/${credit?.poster_path}`}
                        radius='md'
                        alt={`Poster for ${credit?.title}`}
                        withPlaceholder={!credit?.poster_path}
                        sx={{
                            ':hover': {
                                opacity: 0.75,
                            },
                        }}
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
            <Text span>{credit.title}</Text>
            {dayjs(credit?.release_date).isValid() && (
                <Text span ml='xs'>
                    ({dayjs(credit?.release_date).year()})
                </Text>
            )}
            <Text color='dimmed'>
                {('job' in credit && credit?.job) ||
                    ('character' in credit && credit?.character)}
            </Text>
        </Carousel.Slide>
    )
}
