import { openModal } from '@mantine/modals'
import { ActionIcon, Button, Title, useMantineTheme } from '@mantine/core'
import { ReviewForm } from '@/components/movieReviews/ReviewForm'
import { BiStar } from 'react-icons/bi'
import { IMovieAPIResults } from '../../pages/api/search/[...params]'
import React from 'react'

interface IReviewModalButton {
    movie?: IMovieAPIResults
    button?: boolean

    disabled?: boolean
}

interface IReviewTriggerWrapper {
    children: React.ReactNode
    button?: boolean
    onClick: () => void
    disabled: boolean
}

const ReviewTriggerWrapper = ({
    button = false,
    onClick,
    disabled = false,
}: IReviewTriggerWrapper) => {
    const icon = <BiStar />
    const theme = useMantineTheme()
    return button ? (
        <Button
            onClick={onClick}
            variant={theme.colorScheme === 'light' ? 'light' : 'filled'}
            size={'lg'}
            leftIcon={icon}
            disabled={disabled}
        >
            Add Review
        </Button>
    ) : (
        <ActionIcon
            onClick={onClick}
            variant={'filled'}
            size={'xl'}
            radius={'xl'}
            disabled={disabled}
        >
            {icon}
        </ActionIcon>
    )
}

export const ReviewModalButton = ({
    movie,
    button = false,
    disabled = false,
}: IReviewModalButton) => {
    const onClick = () =>
        openModal({
            title: <Title order={2}>Review {movie?.title || 'Movie'}</Title>,
            children: <ReviewForm tmdb_id={movie?.id} />,
            centered: true,
            withCloseButton: false,
        })

    return (
        <ReviewTriggerWrapper
            button={button}
            onClick={onClick}
            disabled={disabled}
        >
            <BiStar size={32} />
        </ReviewTriggerWrapper>
    )
}
