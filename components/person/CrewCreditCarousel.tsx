import { Carousel } from '@mantine/carousel'
import { Stack } from '@mantine/core'
import {
    IPersonCastCrewResponse,
    IPersonCrewCredits,
} from 'pages/api/people/[id]'
import { useEmbla } from 'utils/embla/useEmbla'
import { CarouselTitleControls } from '../CarouselTitleControls'
import { PersonCreditCarouselSlide } from '@/components/person/PersonCreditCarouselSlide'

interface ICredits {
    credits: IPersonCastCrewResponse
}

export const CrewCreditCarousel = ({ credits }: ICredits) => {
    const { goBack, goForward, setEmbla } = useEmbla()

    //we will go through our credits and make sure that we don't show the same movie more than once.
    const reducedCrewCredits = credits?.crew?.reduce<IPersonCrewCredits[]>(
        (acc, curr) => {
            //check and see if we already have a credit for this movie.
            const accHasMovie = acc?.some(cred => cred.id === curr.id)
            if (accHasMovie) {
                //if we do , we'll just update that record
                return acc.map(credit =>
                    credit.id === curr.id
                        ? { ...credit, job: `${credit.job}, ${curr.job}` }
                        : credit
                )
            } else {
                //otherwise we will add this record to the acc
                return [...acc, curr]
            }
        },
        []
    )

    return credits?.crew?.length > 0 ? (
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
                {reducedCrewCredits.map(credit => (
                    <PersonCreditCarouselSlide
                        credit={credit}
                        key={credit.id}
                    />
                ))}
            </Carousel>
        </Stack>
    ) : (
        <></>
    )
}
