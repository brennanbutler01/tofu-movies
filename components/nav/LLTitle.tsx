import { Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Link from 'next/link'

export const LLTitle = () => {
    const isMobile = useMediaQuery('(max-width: 576px)', true, {
        getInitialValueInEffect: false,
    })

    return (
        <Link legacyBehavior href={'/'} passHref>
            <a>
                <Title
                    sx={theme => ({
                        background: theme.fn.gradient({
                            from: 'pink.5',
                            to: 'yellow.3',
                            deg: 10,
                        }),
                        display: 'inline-block',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        whiteSpace: 'nowrap',
                        fontWeight: 900,
                    })}
                    mr='lg'
                >
                    {isMobile ? <span>t.m</span> : 'tofu.movies'}
                </Title>
            </a>
        </Link>
    )
}
