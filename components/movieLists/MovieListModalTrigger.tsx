import {
    ActionIcon,
    ActionIconVariant,
    Button,
    ButtonVariant,
    MantineSize,
    Title,
    useMantineTheme,
} from '@mantine/core'
import { openModal } from '@mantine/modals'
import { BiPlus } from 'react-icons/bi'
import { AccessibleTooltip } from '../AccessibleTooltip'
import { MovieListForm } from './MovieListForm'

interface IMovieListModalTrigger {
    capitalize?: boolean
    variant?: 'actionIcon' | 'button'
    fullWidth?: boolean
}

const icon = <BiPlus />
const commonProps = {
    onClick: () =>
        openModal({
            centered: true,
            title: <Title>Create Movie List</Title>,
            children: <MovieListForm />,
        }),
}
const actionIconProps = {
    size: 'xl' as MantineSize,
    radius: 'md' as MantineSize,
    variant: 'light' as ActionIconVariant,
}
const buttonProps = {
    leftIcon: icon,
    variant: 'light' as ButtonVariant,
}

export const MovieListModalTrigger = ({
    capitalize,
    variant = 'button',
    fullWidth = true,
}: IMovieListModalTrigger) => {
    const text = capitalize ? 'ADD NEW LIST' : 'add new list'
    const theme = useMantineTheme()
    return variant === 'actionIcon' ? (
        <AccessibleTooltip label='Create New List'>
            <ActionIcon {...commonProps} {...actionIconProps}>
                {icon}
            </ActionIcon>
        </AccessibleTooltip>
    ) : (
        <Button
            {...buttonProps}
            {...commonProps}
            fullWidth={fullWidth}
            variant={theme.colorScheme === 'dark' ? 'filled' : 'light'}
            size={'lg'}
        >
            {text}
        </Button>
    )
}
