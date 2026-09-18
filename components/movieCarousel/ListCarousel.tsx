import { Carousel } from '@mantine/carousel'
import { FullMovieList } from 'pages/api/movieLists'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import { CarouselItem } from './CarouselItem'

interface IListCarousel {
    list: FullMovieList
}

export const ListCarousel = ({ list }: IListCarousel) => {
    const { goBack, goForward, setEmbla } = useEmbla()

    return (
        <div key={list.id}>
            <CarouselTitleControls
                title={list.title}
                goBack={goBack}
                goForward={goForward}
                href={'/movieLists/' + list.id}
            />
            <Carousel
                height={600}
                slideSize='100%'
                slideGap='md'
                align='start'
                breakpoints={[
                    { slideSize: '50%', minWidth: 'xs' },
                    { slideSize: '33%', minWidth: 'sm' },
                    { slideSize: '25%', minWidth: 'md' },
                    { slideSize: '20%', minWidth: 'lg' },
                    { slideSize: '16.67%', minWidth: 'xl' },
                    { slideSize: '14.28%', minWidth: 2000 },
                ]}
                slidesToScroll={1}
                getEmblaApi={setEmbla}
                withControls={false}
            >
                {list?.movies.map(movie => (
                    <CarouselItem movie={movie} key={movie.id} />
                ))}
            </Carousel>
        </div>
    )
}
