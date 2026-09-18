import { Card } from '@mantine/core'
import React from 'react'

interface IAuthCard {
    children: React.ReactNode
}

export const AuthCard = ({ children }: IAuthCard) => {
    return (
        <Card
            shadow='sm'
            p='xl'
            radius='sm'
            withBorder
            sx={() => ({ minWidth: '300px' })}
        >
            {children}
        </Card>
    )
}
