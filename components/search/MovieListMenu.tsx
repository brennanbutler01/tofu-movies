import {
    Badge,
    Button,
    Group,
    Menu,
    Text,
    Tooltip,
    MantineSize,
    ButtonVariant,
    MultiSelect,
    MultiSelectValueProps,
    Box,
    CloseButton,
    SelectItemProps,
} from '@mantine/core'
import { useMovieListsCRUD } from 'movieLists/useMovieListsCRUD'
import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { BiCheck, BiPlus } from 'react-icons/bi'
import { MovieListModalTrigger } from '../movieLists/MovieListModalTrigger'
import { FullMovieList } from '../../pages/api/movieLists'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export enum MovieListTitles {
    Watchlist = 'Watchlist',
}

interface IMovieListMenu {
    tmdb_id: number
    size?: MantineSize
    radius?: MantineSize
    variant?: ButtonVariant
    fullWidth?: boolean
}

function Value({
    value,
    label,
    onRemove,
    classNames,
    ...others
}: MultiSelectValueProps & { value: string }) {
    return (
        <div {...others}>
            <Box
                sx={theme => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    backgroundColor:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[7]
                            : theme.white,
                    border: `1px solid ${
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[7]
                            : theme.colors.gray[4]
                    }`,
                    paddingLeft: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                })}
            >
                <Box
                    sx={theme => ({
                        lineHeight: 1.2,
                        fontSize: theme.fontSizes.xs,
                    })}
                >
                    {label}
                </Box>
                <CloseButton
                    onMouseDown={onRemove}
                    variant='transparent'
                    size={22}
                    iconSize={14}
                    tabIndex={-1}
                />
            </Box>
        </div>
    )
}

const Item = React.forwardRef<
    HTMLDivElement,
    SelectItemProps & { tmdb_id: number }
>(({ label, value, tmdb_id, ...others }, ref) => {
    const { data: swrMovieLists } = useMovieListsSWR({})
    const listHasMovie = swrMovieLists?.some(
        list =>
            list.id === value &&
            list.movies.some(movie => movie.tmdb_id === tmdb_id)
    )
    return (
        <div ref={ref} {...others}>
            <Group align='center' noWrap>
                <Box mr={10}>{listHasMovie ? <BiCheck /> : null}</Box>
                <Text sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                </Text>
            </Group>
        </div>
    )
})
Item.displayName = 'MovieListSelectItem'

export const MovieListMenu = ({
    tmdb_id,
    size = 'xs',
    radius = 'xl',
    variant = 'subtle',
    fullWidth = false,
}: IMovieListMenu) => {
    const { data: swrMovieLists } = useMovieListsSWR({})
    const { createMovieList, addMovieToList, removeMovieFromList } =
        useMovieListsCRUD()
    const [movieLists, setMovieLists] = useState<string[]>([])

    useEffect(() => {
        setMovieLists(
            swrMovieLists
                ? swrMovieLists?.reduce<string[]>((acc, curr) => {
                      const movieInList = curr.movies.some(
                          movie => movie.tmdb_id === tmdb_id
                      )
                      if (movieInList && curr.title !== 'Watchlist') {
                          return [...acc, curr.id]
                      }
                      return acc
                  }, [])
                : []
        )
    }, [tmdb_id, swrMovieLists])

    const watchList = swrMovieLists?.find(
        l => l.title === MovieListTitles.Watchlist
    )

    const listCount = swrMovieLists?.filter(list =>
        list?.movies?.some(movie => movie?.tmdb_id === tmdb_id)
    )?.length

    const session = useSession()

    const menuItem = (list: FullMovieList) => {
        const itemDisabled =
            // disable clicking if we aren't the owner and the group doesn't allow edits
            !list?.allowEdits && list?.createdBy !== session?.data?.user?.email

        return (
            <Tooltip
                disabled={!itemDisabled}
                label={'List cannot be edited other than by the creator'}
            >
                <Box>
                    <Menu.Item
                        disabled={itemDisabled}
                        key={list?.id}
                        onClick={async () =>
                            await (swrMovieLists
                                ?.find(swrList => swrList.id === list?.id)
                                ?.movies?.some(
                                    movie => movie.tmdb_id === tmdb_id
                                )
                                ? removeMovieFromList
                                : addMovieToList)(list?.id, tmdb_id)
                        }
                    >
                        <Group noWrap>
                            <Badge>{list?.movies?.length || 0}</Badge>
                            <Text>{list?.title}</Text>
                            {list?.movies?.find(
                                movie => movie?.tmdb_id === tmdb_id
                            ) && <BiCheck color='green' />}
                        </Group>
                    </Menu.Item>
                </Box>
            </Tooltip>
        )
    }

    return (
        <Menu shadow={'md'} withinPortal>
            <Menu.Target>
                <Button
                    fullWidth={fullWidth}
                    leftIcon={<BiPlus />}
                    rightIcon={
                        listCount && (
                            <Tooltip
                                label={`Movie is a member of ${listCount} lists`}
                            >
                                <Badge variant='dot'>{listCount}</Badge>
                            </Tooltip>
                        )
                    }
                    size={size}
                    radius={radius}
                    variant={variant}
                    onClick={async () =>
                        await createMovieList(
                            MovieListTitles.Watchlist,
                            undefined,
                            false,
                            undefined,
                            '',
                            true
                        )
                    }
                >
                    Lists
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Your Lists</Menu.Label>
                {menuItem(watchList as FullMovieList)}
                {movieLists?.map(id =>
                    menuItem(
                        swrMovieLists?.find(
                            list => list.id === id
                        ) as FullMovieList
                    )
                )}
                <Text
                    p={'sm'}
                    size={'sm'}
                    color={'dimmed'}
                    sx={{ maxWidth: 250 }}
                >
                    Click on a list above to toggle this movie being included. A
                    check means that this movie is already in the list.
                </Text>
                <Menu.Divider />
                <Menu.Item title='Show Lists' closeMenuOnClick={false}>
                    <MultiSelect
                        sx={{ maxWidth: '250px' }}
                        dropdownPosition='flip'
                        valueComponent={Value}
                        itemComponent={Item}
                        data={swrMovieLists
                            ?.filter(
                                list => list.title !== MovieListTitles.Watchlist
                            )
                            ?.map(list => ({
                                label: list.title,
                                value: list.id,
                                tmdb_id: tmdb_id,
                            }))}
                        searchable
                        onChange={setMovieLists}
                        value={movieLists}
                        placeholder={'Show Lists'}
                        maxSelectedValues={5}
                        description={'Select which lists to display.'}
                    />
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item component={'div'}>
                    <MovieListModalTrigger />
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
