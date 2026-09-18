import { Box, Image } from '@mantine/core'

interface IMovieImage {
    src: string | undefined
    alt: string
}

function MovieImage({ src, alt }: IMovieImage) {
    return (
        <Image
            src={src}
            height={375}
            sx={theme => ({
                ':hover': {
                    opacity: '.7',
                    boxShadow: theme.shadows.xl,
                },
            })}
            alt={alt}
            withPlaceholder={!src}
            placeholder={
                <Box
                    sx={theme => ({
                        background: theme.fn.gradient(
                            theme.other.errorGradient
                        ),
                        display: 'flex',
                        flex: 'auto',
                        height: '100%',
                        radius: theme.radius.md,
                        minHeight: '140px',
                    })}
                />
            }
        />
    )
}

export default MovieImage
