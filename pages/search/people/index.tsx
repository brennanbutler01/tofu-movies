import { PageWrapper } from '@/components/PageWrapper'
import { useRouter } from 'next/router'
import {
    Box,
    Card,
    Container,
    Group,
    Image,
    Pagination,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { SearchBreadcrumbs } from '@/components/search/SearchBreadcrumbs'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IPersonResponse } from '../../api/people'
import Link from 'next/link'
import { useImageConfigSWR } from '../../../imageConfig/useImageConfigSWR'

const PersonSearch = () => {
    const { query } = useRouter()
    const [page, setPage] = useState(1)
    const [people, setPeople] = useState<IPersonResponse>()
    const config = useImageConfigSWR()
    useEffect(() => {
        const getPage = async () =>
            await axios.get<IPersonResponse>(
                `/api/search/people/${query.q}/${page}`
            )
        getPage()
            .then(res => setPeople(res.data))
            .catch(console.error)
    }, [query, page])

    return (
        <PageWrapper title={`Person Search ${query?.q} | tofu.movies`}>
            <Stack>
                <SearchBreadcrumbs />
                <Title>Search Results for {query.q}</Title>
                <SimpleGrid
                    spacing='xl'
                    breakpoints={[
                        { minWidth: 'xs', cols: 2 },
                        { minWidth: 'md', cols: 3 },
                        { minWidth: 'lg', cols: 4 },
                        { minWidth: 'xl', cols: 5 },
                        { minWidth: 1600, cols: 6 },
                        { minWidth: 2000, cols: 7 },
                        { minWidth: 2400, cols: 8 },
                        { minWidth: 2800, cols: 9 },
                    ]}
                >
                    {people?.results?.map(person => (
                        <Container key={person.id}>
                            <Card
                                radius={'md'}
                                shadow={'sm'}
                                p={'lg'}
                                withBorder
                                sx={{ width: '275px' }}
                            >
                                <Card.Section>
                                    <Link
                                        legacyBehavior
                                        passHref
                                        href={'/person/' + person.id}
                                    >
                                        <a>
                                            <Image
                                                src={`${config?.base_url}/${
                                                    config?.profile_sizes[
                                                        config?.profile_sizes
                                                            ?.length - 1
                                                    ]
                                                }/${person?.profile_path}`}
                                                height={375}
                                                sx={theme => ({
                                                    ':hover': {
                                                        opacity: '.7',
                                                        boxShadow:
                                                            theme.shadows.xl,
                                                    },
                                                })}
                                                alt={`Poster for ${person.name}`}
                                                withPlaceholder={
                                                    !person?.profile_path
                                                }
                                                placeholder={
                                                    <Box
                                                        sx={theme => ({
                                                            background:
                                                                theme.fn.gradient(
                                                                    theme.other
                                                                        .errorGradient
                                                                ),
                                                            display: 'flex',
                                                            flex: 'auto',
                                                            height: '100%',
                                                            radius: theme.radius
                                                                .md,
                                                        })}
                                                    />
                                                }
                                            />
                                        </a>
                                    </Link>
                                    <Text size={'lg'} p={'lg'}>
                                        {person.name}
                                    </Text>
                                </Card.Section>
                            </Card>
                        </Container>
                    ))}
                </SimpleGrid>
                <Group position='right'>
                    <Pagination
                        total={people?.total_pages || 1}
                        page={page}
                        onChange={page => setPage(page)}
                    />
                </Group>
            </Stack>
        </PageWrapper>
    )
}
export default PersonSearch

export const getServerSideProps = async () =>
    process.env.VISITOR_DEMO === 'true' ? { notFound: true } : { props: {} }
