import {
    TypographyStylesProvider,
    Paper,
    Divider,
    Spoiler,
    Group,
    Text,
    Box,
    Button,
} from '@mantine/core'
import Link from 'next/link'
import { reviewHtml } from '../../utils/reviewHtml'
import { ReviewWithMovie } from 'pages/api/reviews'

interface IReviewBody {
    matches: boolean
    review: ReviewWithMovie
    sm?: boolean
}

export const ReviewBody = ({
    review: { review, title, id },
    matches,
    sm,
}: IReviewBody) => {
    return (
        <TypographyStylesProvider>
            <Paper radius='lg' p='xs' shadow={'md'}>
                <Group align={'center'} mb='sm' position='left'>
                    <Link legacyBehavior href={'/reviews/' + id} passHref>
                        <Button
                            color={'blue'}
                            component={'a'}
                            variant='white'
                            radius='sm'
                        >
                            View Review
                        </Button>
                    </Link>
                    <Text
                        size='xl'
                        weight={700}
                        sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {title}
                    </Text>
                </Group>
                <Divider mb='sm' />
                <Spoiler
                    maxHeight={sm || matches ? 150 : 300}
                    showLabel={sm ? null : 'See full review'}
                    hideLabel='Hide review'
                >
                    <Box
                        id={'box'}
                        sx={theme => ({
                            fontSize: theme.fontSizes.sm,
                            color: theme.colors.dimmed,
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                        })}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: reviewHtml(review),
                            }}
                        />
                    </Box>
                </Spoiler>
            </Paper>
        </TypographyStylesProvider>
    )
}
