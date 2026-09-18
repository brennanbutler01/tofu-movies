import { useEmbla } from '../../utils/embla/useEmbla'
import { CarouselTitleControls } from '@/components/CarouselTitleControls'
import { Carousel } from '@mantine/carousel'
import { useMovieListsSWR } from '../../movieLists/useMovieListsSWR'
import MovieListCarouselItem from '@/components/movieLists/MovieListCarouselItem'

const MovieListCarousel = () => {
    const { data } = useMovieListsSWR({})
    const { goBack, goForward, setEmbla } = useEmbla()
    return (
        <>
            <CarouselTitleControls
                goBack={goBack}
                goForward={goForward}
                title='Movie Lists'
                href='/movieLists'
            />
            <Carousel
                align='start'
                getEmblaApi={setEmbla}
                withControls={false}
                withIndicators={false}
                height={500}
                slideGap='md'
                slideSize={'100%'}
                breakpoints={[
                    { minWidth: 'xs', slideSize: '50%' },
                    { minWidth: 'sm', slideSize: '33%' },
                    { minWidth: 'lg', slideSize: '25%' },
                    { minWidth: 'xl', slideSize: '20%' },
                    { minWidth: 2000, slideSize: '16.67%' },
                    { minWidth: 2400, slideSize: '14.28%' },
                ]}
            >
                {data?.map(list => (
                    <MovieListCarouselItem list={list} key={list.id} />
                ))}
            </Carousel>
        </>
    )
}

export default MovieListCarousel
