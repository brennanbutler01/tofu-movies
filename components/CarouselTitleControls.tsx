import { Group } from '@mantine/core'
import { CarouselTitle } from './movieCarousel/CarouselTitle'
import { CarouselArrows } from './movieCarousel/CarouselArrows'

interface ICarouselControls {
    title: string
    goForward: () => void
    goBack: () => void
    href?: string
}

export const CarouselTitleControls = ({
    title,
    href,
    ...rest
}: ICarouselControls) => {
    return (
        <Group position='apart'>
            <CarouselTitle title={title} href={href} />
            <CarouselArrows {...rest} />
        </Group>
    )
}
