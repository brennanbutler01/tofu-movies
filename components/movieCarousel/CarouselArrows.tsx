import { ActionIcon } from '@mantine/core'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

interface ICarouselArrows {
    goForward: () => void
    goBack: () => void
}

export const CarouselArrows = ({ goForward, goBack }: ICarouselArrows) => {
    return (
        <div style={{ display: 'flex' }}>
            <ActionIcon size={'xl'}>
                <BiChevronLeft size={36} onClick={goBack} />
            </ActionIcon>
            <ActionIcon size='xl'>
                <BiChevronRight size={36} onClick={goForward} />
            </ActionIcon>
        </div>
    )
}
