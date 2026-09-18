import { Button, createStyles, MantineSize } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { BiTv } from 'react-icons/bi'
import { ProvidersModal } from './ProvidersModal'

const styles = createStyles(theme => ({
    control: {
        paddingLeft: 50,
        paddingRight: 50,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontSize: 22,

        [theme.fn.smallerThan('md')]: {
            width: '100%',
        },
    },
}))

interface IUserProviderButton {
    size?: MantineSize
}

export const UserProviderButton = ({ size = 'xl' }: IUserProviderButton) => {
    const { classes } = styles()
    return (
        <Button
            variant='gradient'
            gradient={{ from: 'pink', to: 'yellow' }}
            size={size}
            className={classes.control}
            mt={40}
            leftIcon={<BiTv />}
            onClick={() =>
                openModal({
                    fullScreen: true,
                    children: <ProvidersModal />,
                    overflow: 'inside',
                    closeButtonLabel: 'Close Modal',
                })
            }
        >
            Configure Providers
        </Button>
    )
}
