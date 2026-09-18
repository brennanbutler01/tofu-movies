import React, { useMemo } from 'react'
import { BiLink, BiTrash, BiUnlink } from 'react-icons/bi'
import { useSession } from 'next-auth/react'
import { Button, createStyles, Text } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { useMovieListsCRUD } from '../../movieLists/useMovieListsCRUD'
import { MovieListItemProps } from '@/components/movieLists/MovieListItem'

const useStyles = createStyles(theme => ({
    action: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[5]
                    : theme.colors.gray[1],
        }),
    },
}))

interface LinkButtonProps extends MovieListItemProps {
    sm?: boolean
}

export default function LinkButton({
    list,
    tabFilter,
    sm = false,
}: LinkButtonProps) {
    const { classes, theme } = useStyles()
    const session = useSession()
    const hasPublicList = useMemo(
        () => list.users.some(user => user.id === session?.data?.user?.userId),
        [list, session]
    )
    const { deleteMovieList, linkUserToList, unlinkUserFromList } =
        useMovieListsCRUD()
    const isPublic = list.isPublic
    const deleteList = async () => await deleteMovieList(list.id)
    const unlinkList = async () => await unlinkUserFromList(list.id)
    const linkList = async () => await linkUserToList(list.id)
    const openModal = () => {
        openConfirmModal({
            onConfirm: isPublic ? unlinkList : deleteList,
            title: `${isPublic ? 'Unlink' : 'Delete'} Movie List`,
            centered: true,
            children: isPublic ? (
                <Text size={'sm'}>
                    Are you sure that you want to unlink this list? You can
                    always add it back later
                </Text>
            ) : (
                <Text size='sm'>
                    Are you sure that you want to delete this list? This action
                    cannot be undone.
                </Text>
            ),
            labels: {
                cancel: 'Cancel',
                confirm: `${isPublic ? 'Unlink' : 'Delete'} List`,
            },
            confirmProps: {
                compact: true,
                leftIcon: <BiTrash />,
                variant: 'light',
                radius: 'md',
            },
            cancelProps: {
                compact: true,
                variant: 'light',
                color: 'red',
                radius: 'md',
            },
        })
    }

    const buttonConfig = {
        ['connected']: {
            buttonText: isPublic ? 'Unfollow' : 'Delete',
            onClick: openModal,
            gradient: theme.other.deleteGradient,
            icon: isPublic ? <BiUnlink /> : <BiTrash />,
        },
        ['public']: {
            buttonText: hasPublicList ? 'Unfollow list' : 'Follow List',
            onClick: async () =>
                await (hasPublicList ? unlinkList : linkList)(),
            gradient: hasPublicList
                ? theme.other.deleteGradient
                : theme.other.successGradient,
            icon: hasPublicList ? <BiUnlink /> : <BiLink />,
        },
    }

    return (
        <Button
            className={classes.action}
            variant='gradient'
            gradient={buttonConfig[tabFilter].gradient}
            onClick={buttonConfig[tabFilter].onClick}
            leftIcon={buttonConfig[tabFilter].icon}
            size={sm ? 'xs' : 'sm'}
            compact={sm}
        >
            {buttonConfig[tabFilter].buttonText}
        </Button>
    )
}
