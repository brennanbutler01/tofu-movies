import { IConfig } from 'pages/api/config'
import { Carousel } from '@mantine/carousel'
import { IMovieAPIResults } from 'pages/api/search/[...params]'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import TrendingItem from '@/components/trending/TrendingItem'

interface ITrendingCarousel {
    trending: IMovieAPIResults[]
    config: IConfig
}

const TrendingCarousel = ({ trending, config }: ITrendingCarousel) => {
    const { goBack, goForward, setEmbla } = useEmbla()
    return (
        <>
            <CarouselTitleControls
                goBack={goBack}
                goForward={goForward}
                title={
                    process.env.NEXT_PUBLIC_VISITOR_DEMO === 'true'
                        ? 'Sample films'
                        : 'Trending'
                }
                href='/trending'
            />
            <Carousel
                align='start'
                getEmblaApi={setEmbla}
                withControls={false}
                withIndicators={false}
                height={420}
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
                {trending?.map(t => (
                    <TrendingItem trending={t} config={config} key={t?.id} />
                ))}
            </Carousel>
        </>
    )
}

export default TrendingCarousel
