import { Button, CopyButton } from '@mantine/core'
import { IMovieDetail } from 'pages/api/movieDetails/[id]'
import useIsClient from 'utils/useIsClient'

interface ILocationButton {
    fullMovie: IMovieDetail | void
}

export const CopyLocationButton = ({ fullMovie }: ILocationButton) => {
    const isClient = useIsClient()

    return (
        <>
            {isClient && (
                <CopyButton
                    value={`${window?.location?.origin}/movies/${fullMovie?.id}`}
                    timeout={5000}
                >
                    {({ copied, copy }) => (
                        <Button
                            color={copied ? 'teal' : 'gray'}
                            onClick={copy}
                            variant='filled'
                        >
                            {copied ? 'Copied url' : 'Share Link'}
                        </Button>
                    )}
                </CopyButton>
            )}
        </>
    )
}
