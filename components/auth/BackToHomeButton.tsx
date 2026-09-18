import { Button, MantineSize } from '@mantine/core'
import Link from 'next/link'
import { BiArrowBack } from 'react-icons/bi'
import useIsClient from 'utils/useIsClient'

interface IBackToHomeButton {
    size?: MantineSize
}

export const BackToHomeButton = ({ size = 'md' }: IBackToHomeButton) => {
    const isClient = useIsClient()
    return (
        <Link
            legacyBehavior
            href={isClient ? window?.location?.origin : '/'}
            passHref
        >
            <Button
                component='a'
                leftIcon={<BiArrowBack />}
                fullWidth
                variant='outline'
                color={'teal.4'}
                size={size}
            >
                Go Home!
            </Button>
        </Link>
    )
}
