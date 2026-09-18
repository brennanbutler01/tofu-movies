import {
    Accordion,
    ActionIcon,
    Box,
    Container,
    Group,
    Title,
    useMantineTheme,
} from '@mantine/core'
import { MovieListMenu } from '@/components/search/MovieListMenu'
import { BiCheck, BiInfoCircle, BiRefresh, BiTv } from 'react-icons/bi'
import { openModal } from '@mantine/modals'
import { ProviderAccordion } from '@/components/movieDetail/ProviderAccordion'
import { CreditsTable } from '@/components/movieDetail/CreditsTable'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { IProviderResult } from 'pages/api/watchProviders/[id]'
import { IConfig } from 'pages/api/config'
import { IOmdbResponse } from 'pages/api/omdb/[id]'
import { AccessibleTooltip } from '@/components/AccessibleTooltip'
import { useUserMovieSWR } from 'userMovies/useUserMovieSWR'
import { useUserMovieCRUD } from 'userMovies/useUserMovieCRUD'
import { useMovieSWR } from 'movies/useMovieSWR'
import { useMediaQuery } from '@mantine/hooks'

interface IRandomMovieActions {
    fullMovie: IMovieDetail | void
    watchProviders: IProviderResult | void
    config: IConfig | void
    getRandomMovie: () => Promise<void>
    omdbDetails: IOmdbResponse | void
}

export const RandomMovieActions = ({
    fullMovie,
    watchProviders,
    config,
    getRandomMovie,
    omdbDetails,
}: IRandomMovieActions) => {
    const swrUserMovies = useUserMovieSWR({})
    const { createUserMovie, updateUserMovie } = useUserMovieCRUD()
    const swrMovies = useMovieSWR({})
    const thisMovie = swrMovies?.find(m => m.tmdb_id === fullMovie?.id)
    const theme = useMantineTheme()
    const matchesXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

    const openProviders = () =>
        openModal({
            children: (
                <Container>
                    <Title mb='sm'>Watch Providers </Title>
                    <ProviderAccordion
                        config={config}
                        watchProviders={watchProviders}
                        restrictWidth={false}
                    />
                </Container>
            ),
            centered: true,
            withCloseButton: false,
        })

    const openCredits = () =>
        openModal({
            withCloseButton: false,
            children: (
                <Container>
                    <Title mb={'sm'}>Movie Credits</Title>
                    <>
                        {fullMovie && (
                            <CreditsTable
                                fullMovie={fullMovie}
                                omdbResult={omdbDetails}
                                caption={'none'}
                            />
                        )}
                    </>
                </Container>
            ),
            centered: true,
        })

    const iconSize = { size: 24 }

    const actionConfig: Record<
        string,
        {
            onClick: () => void
            icon: JSX.Element
            tooltipLabel: string
            visible: boolean
            color?: string
        }
    > = {
        getRandom: {
            onClick: getRandomMovie,
            icon: <BiRefresh {...iconSize} />,
            visible: true,
            tooltipLabel: 'Get a new movie',
        },
        seenButton: {
            onClick: async () => {
                const thisUserMovie = swrUserMovies?.find(
                    m => m.movieId === thisMovie?.id
                )
                console.log(thisUserMovie)
                if (!thisUserMovie && fullMovie?.id) {
                    await createUserMovie({
                        tmdb_id: fullMovie?.id,
                        seen: true,
                    })
                } else {
                    thisUserMovie?.id &&
                        (await updateUserMovie({
                            userMovieId: thisUserMovie?.id,
                            seen: !thisUserMovie?.seen,
                        }))
                }
            },
            visible: true,
            tooltipLabel: 'Seen Movie?',
            icon: <BiCheck {...iconSize} />,
            color: swrUserMovies?.some(
                m => m.movieId === thisMovie?.id && m.seen
            )
                ? 'grape'
                : 'gray',
        },
        watchProviders: {
            onClick: openProviders,
            icon: <BiTv {...iconSize} />,
            tooltipLabel: 'Streaming Providers',
            visible: !!watchProviders && !!config,
        },
        credits: {
            onClick: openCredits,
            icon: <BiInfoCircle {...iconSize} />,
            tooltipLabel: 'View Movie Details',
            visible: !!fullMovie && !!omdbDetails,
        },
    }

    const actions = (
        <Group align='center'>
            {fullMovie?.id && <MovieListMenu tmdb_id={fullMovie?.id} />}
            {Object.values(actionConfig)
                .filter(val => val.visible)
                .map((val, i) => (
                    <AccessibleTooltip
                        label={val?.tooltipLabel}
                        key={i}
                        withinPortal
                    >
                        <ActionIcon
                            size={'xl'}
                            variant={'filled'}
                            radius={'md'}
                            onClick={val.onClick}
                            color={val?.color || 'gray'}
                        >
                            {val.icon}
                        </ActionIcon>
                    </AccessibleTooltip>
                ))}
        </Group>
    )

    return matchesXs ? (
        <Box sx={{ position: 'relative', display: 'block', width: '100%' }}>
            <Accordion sx={{ display: 'block' }} variant={'separated'}>
                <Accordion.Item value={'main'}>
                    <Accordion.Control>Movie Actions</Accordion.Control>
                    <Accordion.Panel>{actions}</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Box>
    ) : (
        actions
    )
}
