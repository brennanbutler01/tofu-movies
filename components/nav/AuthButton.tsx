import {
    Button,
    ButtonVariant,
    MantineGradient,
    MantineSize,
    useMantineTheme,
} from '@mantine/core'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface IAuthConfig {
    buttonText: string
    onClick?: () => Promise<void>
    loading?: boolean
    gradient?: MantineGradient
    variant?: ButtonVariant
    color?: string
    size?: MantineSize
}

interface IAuthButton {
    size?: MantineSize
    variant?: ButtonVariant
}

export const AuthButton = ({
    size = 'md',
    variant = 'gradient',
}: IAuthButton) => {
    const { status } = useSession()
    const theme = useMantineTheme()

    const [loading, setLoading] = useState(false)

    const handleAuthClick = async (onClick: IAuthConfig['onClick']) => {
        if (onClick) {
            setLoading(true)
            await onClick()
            setLoading(false)
        }
    }

    const authButtonConfig: Record<SessionStatus, IAuthConfig> = {
        loading: {
            buttonText: 'Checking Auth',
            loading: true,
            color: 'gray',
            size,
        },
        authenticated: {
            buttonText: 'Sign Out',
            onClick: async () => await handleAuthClick(signOut),
            variant,
            gradient: theme.other.errorGradient,
            loading,
            size,
        },
        unauthenticated: {
            buttonText: 'Sign In',
            onClick: async () => await signIn(),
            variant,
            gradient: { from: 'teal.9', to: 'lime.4', deg: 35 },
            loading,
            size,
        },
    }

    const { buttonText, ...authButtonProps } = authButtonConfig[status]

    return <Button {...authButtonProps}>{buttonText}</Button>
}
