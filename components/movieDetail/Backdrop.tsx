import { BackgroundImage, Box } from '@mantine/core'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { IOmdbResponse } from 'pages/api/omdb/[id]'
import { IConfig } from 'pages/api/config'
import React from 'react'

interface IBackdrop {
    children: React.ReactNode
    fullMovie: IMovieDetail | void
    config: IConfig | void
    omdbResult: IOmdbResponse | void
}
export const Backdrop = ({
    children,
    fullMovie,
    config,
    omdbResult,
}: IBackdrop) => {
    return (
        <BackgroundImage
            src={
                fullMovie?.backdrop_path
                    ? `${config?.base_url}/${config?.backdrop_sizes[3]}/${fullMovie?.backdrop_path}`
                    : fullMovie?.poster_path
                    ? `${config?.base_url}/${config?.poster_sizes[1]}/${fullMovie?.poster_path}`
                    : omdbResult?.Poster
                    ? omdbResult.Poster
                    : ''
            }
        >
            <Box
                sx={theme => ({
                    backgroundImage:
                        theme.colorScheme === 'dark'
                            ? theme.fn.linearGradient(
                                  70,
                                  ...[
                                      theme.black,
                                      theme.colors.gray[9],
                                      theme.colors.grape[9],
                                  ]
                              )
                            : theme.fn.linearGradient(
                                  70,
                                  ...[
                                      theme.white,
                                      theme.colors.gray[2],
                                      theme.colors.grape[2],
                                  ]
                              ),
                    opacity: 0.95,
                    width: '100%',
                })}
            >
                {children}
            </Box>
        </BackgroundImage>
    )
}
