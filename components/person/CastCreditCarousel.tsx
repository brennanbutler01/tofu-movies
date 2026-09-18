import { Carousel } from '@mantine/carousel'
import { IPersonCastCrewResponse } from 'pages/api/people/[id]'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import { PersonCreditCarouselSlide } from '@/components/person/PersonCreditCarouselSlide'
import { Stack } from '@mantine/core'

interface ICredits {
    credits: IPersonCastCrewResponse
}

export const CastCreditCarousel = ({ credits }: ICredits) => {
    const { goBack, goForward, setEmbla } = useEmbla()

    return credits?.cast?.length > 0 ? (
        <Stack>
            <CarouselTitleControls
                goBack={goBack}
                goForward={goForward}
                title={'Cast Credits'}
            />
            <Carousel
                slideGap={'lg'}
                align={'start'}
                breakpoints={[
                    { minWidth: 'xs', slideSize: '100%' },
                    { minWidth: 'sm', slideSize: '33%' },
                ]}
                getEmblaApi={setEmbla}
                height={500}
                withControls={false}
                withIndicators={false}
            >
                {credits?.cast?.map(credit => (
                    <PersonCreditCarouselSlide
                        credit={credit}
                        key={credit?.id}
                    />
                ))}
            </Carousel>
        </Stack>
    ) : (
        <></>
    )
}
