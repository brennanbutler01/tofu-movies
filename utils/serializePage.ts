import superjson from 'superjson'

export function serializePage(props: unknown) {
    return { serializedPage: superjson.stringify(props) }
}
