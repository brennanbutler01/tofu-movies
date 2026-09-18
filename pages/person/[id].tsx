import { serializePage } from 'utils/serializePage'
import { PageWrapper } from '@/components/PageWrapper'
import { PersonBreadcrumbs } from '@/components/person/PersonBreadcrumbs'
import { PersonDetails } from '@/components/person/PersonDetails'
import { Container } from '@mantine/core'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import {
    getPersonCredits,
    getPersonDetails,
    IPersonCastCrewResponse,
    IPersonDetail,
} from 'pages/api/people/[id]'

interface IPerson {
    person: IPersonDetail | void
    credits: IPersonCastCrewResponse | void
}

const Person = ({ credits, person }: IPerson) => {
    const { query } = useRouter()
    return (
        <PageWrapper title={`${query?.id as string} | tofu.movies`}>
            <PersonBreadcrumbs name={person?.name} id={query?.id as string} />
            <Container>
                <>
                    {person && (
                        <PersonDetails person={person} credits={credits} />
                    )}
                </>
            </Container>
        </PageWrapper>
    )
}

export default Person

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const person = await getPersonDetails(ctx.query.id as string)
    let credits
    if (person) {
        credits = await getPersonCredits(person?.id as number)
    }
    return { props: serializePage({ person, credits }) }
}
