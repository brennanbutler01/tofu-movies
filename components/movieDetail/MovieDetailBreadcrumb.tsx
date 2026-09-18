import { Breadcrumbs, Anchor, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import { BiChevronDown, BiChevronRight } from 'react-icons/bi'

interface IBreadcrumb {
    fullMovie: IMovieDetail | void
}

export const MovieDetailBreadcrumb = ({ fullMovie }: IBreadcrumb) => {
    const matches = useMediaQuery('(min-width: 576px)')
    const theme = useMantineTheme()
    console.log(theme.colors.dark[9])
    const links = [
        { href: '/', text: 'Home' },
        { href: '/search?q= ', text: 'Movies' },
        { href: '/movies/' + fullMovie?.id, text: fullMovie?.title },
    ].map(a => (
        <Anchor
            weight={900}
            size='xl'
            href={a.href}
            key={a.href}
            sx={theme => ({
                color:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[1]
                        : theme.colors.dark[3],
            })}
        >
            {a.text}
        </Anchor>
    ))
    return (
        <Breadcrumbs
            separator={
                matches ? (
                    <BiChevronRight size={32} />
                ) : (
                    <BiChevronDown size={32} />
                )
            }
            {...(matches && { p: 'lg' })}
            sx={() => ({
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'start',

                '@media (min-width: 576px)': {
                    flexDirection: 'row',
                    alignItems: 'center',
                },
            })}
        >
            {links}
        </Breadcrumbs>
    )
}
