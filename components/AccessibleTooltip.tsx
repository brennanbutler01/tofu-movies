import { Tooltip, useMantineTheme } from '@mantine/core'
import React from 'react'

interface IAccessibleTooltip {
    label: string | React.ReactNode
    children: React.ReactNode
    withinPortal?: boolean
}

export const AccessibleTooltip = ({
    label,
    children,
    withinPortal = false,
}: IAccessibleTooltip) => {
    const theme = useMantineTheme()
    return (
        <Tooltip
            label={label}
            events={{ hover: true, focus: true, touch: false }}
            withinPortal={withinPortal}
            withArrow
            color={theme.primaryColor}
        >
            {children}
        </Tooltip>
    )
}
