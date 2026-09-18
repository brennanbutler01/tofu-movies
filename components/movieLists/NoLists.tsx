import { Box, Container, Image, Stack, Text } from '@mantine/core'

export default function NoLists() {
    return (
        <Container>
            <Stack>
                <Box>
                    <Text weight={700} size='xl'>
                        No Movie Lists!
                    </Text>
                    <Text align='center' color='dimmed'>
                        Create a list to get started
                    </Text>
                </Box>
                <Image
                    src={'/empty-vector.png'}
                    height={320}
                    radius='lg'
                    alt='Image to display when we have no movies in the list'
                />
            </Stack>
        </Container>
    )
}
