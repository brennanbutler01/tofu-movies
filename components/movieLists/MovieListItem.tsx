import {
    Box,
    Card,
    Badge,
    Text,
    Button,
    List,
    Group,
    Image,
    createStyles,
    Menu,
    Stack,
} from '@mantine/core'
import dayjs from '@/dayjs/index'
import { useMovieListsCRUD } from 'movieLists/useMovieListsCRUD'
import { BiMovie, BiStar, BiStopwatch, BiWorld } from 'react-icons/bi'
import { FullMovieList } from 'pages/api/movieLists'
import { MovieListTitles } from '../search/MovieListMenu'
import { MdPrivacyTip } from 'react-icons/md'
import { ListTabs } from './MovieListTabs'
import Link from 'next/link'
import { usePublicMovieListSWR } from '../../movieLists/usePublicMovieListSWR'
import React from 'react'
import LinkButton from '@/components/movieLists/LinkButton'
import { useSession } from 'next-auth/react'

export interface MovieListItemProps {
    list: FullMovieList
    tabFilter: ListTabs
    fullDetail?: boolean
}

const useStyles = createStyles(theme => ({
    card: {
        position: 'relative',
        backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    action: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.gray[1],
        }),
    },
}))

//TODO - check this
const MovieListItem = ({
    list,
    tabFilter,
    fullDetail = true,
}: MovieListItemProps) => {
    const { incrementListViews } = useMovieListsCRUD()

    const { data: publicMovieListSWR } = usePublicMovieListSWR({})

    const viewList = async () => await incrementListViews(list.id)
    const session = useSession()
    const isPublic = list?.isPublic ? 'true' : 'false'
    const { classes } = useStyles()

    const listPublicBadge = {
        true: {
            badgeIcon: <BiWorld />,
            badgeColor: 'orange',
            badgeText: 'Public',
        },
        false: {
            badgeIcon: <MdPrivacyTip />,
            badgeColor: 'blue',
            badgeText: 'Private',
        },
    }

    return (
        <Card
            withBorder
            p='xl'
            py='xl'
            pt={'0'}
            shadow='lg'
            className={classes.card}
        >
            <Card.Section mb={'lg'}>
                <Stack>
                    <a>
                        <Image
                            src={
                                list?.image
                                    ? list.image
                                    : list.movies?.length > 0 &&
                                      list.movies[0]?.backdrop
                                    ? list.movies[0]?.backdrop
                                    : undefined
                            }
                            withPlaceholder={
                                !list?.image || list?.movies?.length === 0
                            }
                            placeholder={
                                <Box
                                    sx={theme => ({
                                        background: theme.fn.gradient(
                                            theme?.colorScheme === 'dark'
                                                ? {
                                                      from: theme.colors
                                                          .dark[9],
                                                      to: theme.colors.dark[6],
                                                  }
                                                : {
                                                      from: theme.colors
                                                          .dark[0],
                                                      to: theme.colors.dark[2],
                                                      deg: 345,
                                                  }
                                        ),
                                        display: 'flex',
                                        flex: 'auto',
                                        height: '100%',
                                    })}
                                />
                            }
                            height={240}
                            alt={`Image for list : ${list.title}`}
                        />
                    </a>
                    <Group px={'md'} align={'end'} position={'apart'}>
                        <Text
                            weight={700}
                            sx={theme => ({
                                fontSize: theme.fontSizes.xl,
                                fontFamily: theme.headings.fontFamily,
                            })}
                        >
                            {list.title}
                        </Text>
                        {list.createdBy === 'System Generated' ? (
                            <Text color={'dimmed'}>System Generated</Text>
                        ) : (
                            <Group>
                                {list.createdBy !==
                                session?.data?.user?.email ? (
                                    <Menu withArrow withinPortal shadow={'sm'}>
                                        <Menu.Target>
                                            <Text
                                                title={
                                                    'Click to see more lists'
                                                }
                                                sx={{
                                                    textOverflow: 'ellipsis',
                                                    textDecoration: 'underline',
                                                    overflow: 'hidden',
                                                    textDecorationStyle:
                                                        'dotted',
                                                    cursor: 'pointer',
                                                }}
                                                color={'dimmed'}
                                            >
                                                Created by {list.createdBy}
                                            </Text>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Label>
                                                Lists by {list.createdBy}
                                            </Menu.Label>
                                            {publicMovieListSWR?.reduce<
                                                React.ReactNode[]
                                            >(
                                                (acc, curr) =>
                                                    curr.createdBy ===
                                                    list.createdBy
                                                        ? [
                                                              ...acc,
                                                              <Menu.Item
                                                                  key={curr.id}
                                                              >
                                                                  <Group
                                                                      position={
                                                                          'apart'
                                                                      }
                                                                  >
                                                                      {curr.id ===
                                                                      list.id ? (
                                                                          <BiStar />
                                                                      ) : null}
                                                                      <Text
                                                                          sx={{
                                                                              overflow:
                                                                                  'hidden',
                                                                              textOverflow:
                                                                                  'ellipsis',
                                                                          }}
                                                                      >
                                                                          {
                                                                              curr.title
                                                                          }
                                                                      </Text>
                                                                      <LinkButton
                                                                          sm
                                                                          list={
                                                                              curr
                                                                          }
                                                                          tabFilter={
                                                                              tabFilter
                                                                          }
                                                                      />
                                                                  </Group>
                                                              </Menu.Item>,
                                                          ]
                                                        : acc,
                                                []
                                            )}
                                        </Menu.Dropdown>
                                    </Menu>
                                ) : (
                                    <Text
                                        sx={{ textOverflow: 'ellipsis' }}
                                        color={'dimmed'}
                                    >
                                        Created by {list.createdBy}
                                    </Text>
                                )}
                            </Group>
                        )}
                    </Group>
                </Stack>
            </Card.Section>
            {fullDetail ? (
                <Card.Section inheritPadding my='lg'>
                    <List center spacing={'sm'}>
                        <List.Item icon={<BiStopwatch />}>
                            <Badge>
                                Created {dayjs(list.created).fromNow(false)}
                            </Badge>
                        </List.Item>
                        <List.Item icon={<BiMovie />}>
                            <Badge color='teal'>
                                {list.movies?.length} Movies in List
                            </Badge>
                        </List.Item>
                        <List.Item
                            icon={
                                list?.isPublic ? <BiWorld /> : <MdPrivacyTip />
                            }
                        >
                            <Badge
                                color={listPublicBadge[isPublic]?.badgeColor}
                            >
                                {listPublicBadge[isPublic]?.badgeText}
                            </Badge>
                        </List.Item>
                    </List>
                </Card.Section>
            ) : null}
            {fullDetail ? (
                <Card.Section inheritPadding mb={'lg'}>
                    <Text
                        size={'lg'}
                        sx={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        About this list:
                    </Text>
                    <Text color={'dimmed'}>{list?.description}</Text>
                </Card.Section>
            ) : null}
            <Card.Section inheritPadding pb={'lg'}>
                <Group position={'right'} noWrap>
                    <Link
                        legacyBehavior
                        href={'/movieLists/' + list.id}
                        passHref
                    >
                        <Button
                            component={'a'}
                            variant={'subtle'}
                            onClick={viewList}
                            rightIcon={
                                <Badge radius={'lg'} variant={'light'}>
                                    {list.views}
                                </Badge>
                            }
                        >
                            View
                        </Button>
                    </Link>
                    {list.title !== MovieListTitles.Watchlist ? (
                        <LinkButton list={list} tabFilter={tabFilter} />
                    ) : null}
                </Group>
            </Card.Section>
        </Card>
    )
}

export default MovieListItem
