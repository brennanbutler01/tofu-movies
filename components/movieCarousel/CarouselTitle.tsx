import { Group, Title, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { BiChevronRight } from 'react-icons/bi'

interface ICarouselTitle {
    title: string
    href?: string
}

export const CarouselTitle = ({ title, href }: ICarouselTitle) => {
    const theme = useMantineTheme()
    const renderTitle = (
        <Group>
            <Title
                order={4}
                sx={{
                    fontWeight: 900,
                    borderBottom: '1px solid',
                    borderColor: theme.colors.gray[3],
                    textTransform: 'uppercase',
                }}
            >
                {title}
            </Title>
            <BiChevronRight size={60} />
        </Group>
    )

    return href ? (
        <Link legacyBehavior href={href} passHref>
            <a style={{ textDecoration: 'none', color: 'unset' }}>
                {renderTitle}
            </a>
        </Link>
    ) : (
        renderTitle
    )
}
