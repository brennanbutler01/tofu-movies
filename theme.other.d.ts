// noinspection JSUnusedGlobalSymbols

import { MantineGradient } from '@mantine/core'

declare module '@mantine/core' {
    export interface MantineThemeOther {
        errorGradient: MantineGradient
        deleteGradient: MantineGradient
        successGradient: MantineGradient
        breadcrumbDark: string
        breadcrumbLight: string
    }
}
