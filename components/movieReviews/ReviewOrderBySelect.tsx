import { Group, NativeSelect } from '@mantine/core'
import { Prisma } from '@prisma/client'
import { useRouter } from 'next/router'
import React from 'react'

export enum ReviewOrderBy {
    CREATED = 'created',
    RATING = 'rating',
}

export enum OrderByDirections {
    DESC = 'desc',
}

interface IReviewOrderBySelect {
    orderBy: ReviewOrderBy
    sortOrder: Prisma.SortOrder
    setOrderBy: React.Dispatch<React.SetStateAction<ReviewOrderBy>>
    setSortOrder: React.Dispatch<React.SetStateAction<Prisma.SortOrder>>
}
export const ReviewOrderBySelect = ({
    orderBy,
    sortOrder,
    setOrderBy,
    setSortOrder,
}: IReviewOrderBySelect) => {
    const { push } = useRouter()
    return (
        <Group>
            <NativeSelect
                size='xl'
                data={Object.values(ReviewOrderBy)}
                placeholder='Date Created'
                label='Order reviews by: '
                value={orderBy}
                onChange={async val => {
                    setOrderBy(val.currentTarget.value as ReviewOrderBy)
                    await push({
                        pathname: '/reviews',
                        query: {
                            orderBy: val.currentTarget.value,
                            sortOrder,
                        },
                    })
                }}
            />
            <NativeSelect
                size='xl'
                data={Object.values(OrderByDirections)}
                label='Sort Order'
                value={sortOrder}
                onChange={async val => {
                    setSortOrder(val.currentTarget.value as Prisma.SortOrder)
                    await push({
                        pathname: '/reviews',
                        query: {
                            orderBy,
                            sortOrder: val.currentTarget
                                .value as Prisma.SortOrder,
                        },
                    })
                }}
            />
        </Group>
    )
}
