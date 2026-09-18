import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { BiMoon, BiSun } from 'react-icons/bi'

const themeConfig = {
    light: {
        iconColor: 'blue',
        icon: <BiSun size={20} />,
    },
    dark: {
        iconColor: 'yellow',
        icon: <BiMoon size={20} />,
    },
}

export const DarkModeToggle = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()

    return (
        <ActionIcon
            onClick={() => toggleColorScheme()}
            title='Dark-Mode toggle'
            variant='outline'
            radius={'md'}
            color={themeConfig[colorScheme].iconColor}
            size='lg'
        >
            {themeConfig[colorScheme].icon}
        </ActionIcon>
    )
}
