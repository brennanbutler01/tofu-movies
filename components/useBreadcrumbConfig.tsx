import { Anchor, Breadcrumbs, useMantineTheme } from '@mantine/core'
import { BiHome } from 'react-icons/bi'

interface IBreadcrumbItem {
    href: string
    text: JSX.Element | string
}

interface IBreadcrumbConfig {
    linkArr: IBreadcrumbItem[]
}

export const useBreadcrumbConfig = ({ linkArr }: IBreadcrumbConfig) => {
    const theme = useMantineTheme()
    const homeLink = { href: '/', text: <BiHome /> }

    const ThemeAnchor = (link: IBreadcrumbItem) => (
        <Anchor
            href={link.href}
            color={
                theme.colorScheme === 'dark'
                    ? theme.other.breadcrumbDark
                    : theme.other.breadcrumbLight
            }
            key={link.href}
        >
            {link.text}
        </Anchor>
    )

    const links = [homeLink, ...linkArr].map(ThemeAnchor)
    return <Breadcrumbs>{links}</Breadcrumbs>
}
