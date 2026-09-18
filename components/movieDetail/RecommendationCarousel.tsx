import { IConfig } from 'pages/api/config'
import { Carousel } from '@mantine/carousel'
import { IRecommendationResult } from 'pages/api/recommendations'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import RecommendationItem from '@/components/movieDetail/RecommendationItem'

interface IRecommendationCarousel {
    recommendations: IRecommendationResult[]
    config: IConfig | void
}

const RecommendationCarousel = ({
    recommendations,
    config,
}: IRecommendationCarousel) => {
    const { goBack, goForward, setEmbla } = useEmbla()
    const slides = recommendations.map(movie => (
        <RecommendationItem
            key={movie?.id}
            config={config as IConfig}
            movie={movie}
        />
    ))
    return slides?.length > 0 ? (
        <>
            <CarouselTitleControls
                title='Recommended'
                goBack={goBack}
                goForward={goForward}
            />
            <Carousel
                withControls={false}
                withIndicators={false}
                height={500}
                getEmblaApi={setEmbla}
                slideGap='lg'
                slideSize='100%'
                breakpoints={[
                    {
                        slideSize: '50%',
                        minWidth: 'xs',
                    },
                    {
                        slideSize: '33.33%',
                        minWidth: 'sm',
                    },
                    {
                        slideSize: '25%',
                        minWidth: 'lg',
                    },
                    {
                        slideSize: '16.67%',
                        minWidth: 'xl',
                    },
                ]}
                align={'start'}
                loop
            >
                {slides}
            </Carousel>
        </>
    ) : (
        <></>
    )
}

export default RecommendationCarousel
