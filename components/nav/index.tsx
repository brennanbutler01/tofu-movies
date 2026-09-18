import { Group, Header, useMantineColorScheme } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { BurgerMenu } from './BurgerMenu'
import { DarkModeToggle } from './DarkModeToggle'
import { LLTitle } from './LLTitle'
import { SearchAuto } from './SearchAuto'

export const Nav = () => {
    const { toggleColorScheme } = useMantineColorScheme()

    useHotkeys([
        [
            'ctrl + shift + l',
            () => {
                console.log('toggling color scheme')
                toggleColorScheme()
            },
        ],
    ])

    return (
        <Header
            height={60}
            p='md'
            sx={() => ({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            })}
        >
            <LLTitle />
            <Group noWrap>
                <SearchAuto />
                <DarkModeToggle />
                {/* {isMobile ? <BurgerMenu /> : rightMenu} */}
                <BurgerMenu />
            </Group>
        </Header>
    )
}
