import {
    Badge,
    Box,
    Card,
    Group,
    Image,
    SimpleGrid,
    Spoiler,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import dayjs from '@/dayjs/index'
import { useImageConfigSWR } from 'imageConfig/useImageConfigSWR'
import { IPersonCastCrewResponse, IPersonDetail } from 'pages/api/people/[id]'
import { CastCreditCarousel } from './CastCreditCarousel'
import { CrewCreditCarousel } from './CrewCreditCarousel'

interface IPersonDetails {
    person: IPersonDetail
    credits: IPersonCastCrewResponse | void
}

export const PersonDetails = ({ person, credits }: IPersonDetails) => {
    const config = useImageConfigSWR()
    console.log('credits', credits)
    return (
        <Card withBorder radius='md' shadow={'lg'} m='xl' p='xl'>
            <>
                <SimpleGrid
                    cols={2}
                    breakpoints={[
                        { cols: 1, maxWidth: 'sm' },
                        { cols: 2, minWidth: 'md' },
                    ]}
                >
                    <Stack>
                        <Title>{person?.name}</Title>
                        <Group>
                            {person?.known_for_department && (
                                <Badge>{person?.known_for_department}</Badge>
                            )}
                            {dayjs(person?.birthday)?.isValid() && (
                                <>
                                    <Badge color={'green'}>
                                        <Text span>Born:</Text>
                                        <Text span>
                                            {dayjs(person.birthday).format(
                                                'LL'
                                            )}
                                        </Text>
                                    </Badge>
                                    {person?.place_of_birth && (
                                        <Badge color='indigo'>
                                            Birthplace: {person.place_of_birth}
                                        </Badge>
                                    )}
                                </>
                            )}
                            {dayjs(person?.deathday).isValid() && (
                                <Badge color='red'>
                                    <Text span>Died:</Text>
                                    <Text span>
                                        {dayjs(person.deathday).format('LL')}
                                    </Text>
                                </Badge>
                            )}
                        </Group>
                        <Spoiler
                            maxHeight={550}
                            hideLabel={'Hide'}
                            showLabel={'Show More'}
                        >
                            <Text color='dimmed' size='md'>
                                {person.biography}
                            </Text>
                        </Spoiler>
                    </Stack>
                    <Image
                        radius={'md'}
                        src={`${config?.base_url}/${
                            config?.profile_sizes[
                                config?.profile_sizes.length - 1
                            ]
                        }/${person?.profile_path}`}
                        alt={`Picture of ${person?.name}`}
                        withPlaceholder={!person?.profile_path}
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
                </SimpleGrid>
                {credits && (
                    <Stack spacing={'xs'}>
                        <CastCreditCarousel credits={credits} />
                        <CrewCreditCarousel credits={credits} />
                    </Stack>
                )}
            </>
        </Card>
    )
}
