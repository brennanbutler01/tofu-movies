import { SimpleGrid } from '@mantine/core'
import React from 'react'

interface IProviderSimpleGrid {
    children: React.ReactNode
}
export const ProviderSimpleGrid = ({ children }: IProviderSimpleGrid) => {
    return (
        <SimpleGrid
            cols={1}
            breakpoints={[
                { minWidth: 'xs', cols: 2 },
                { minWidth: 'sm', cols: 3 },
            ]}
        >
            {children}
        </SimpleGrid>
    )
}
