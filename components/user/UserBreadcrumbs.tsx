import { Breadcrumbs } from '@mantine/core'
import { useBreadcrumbConfig } from '../useBreadcrumbConfig'

export const UserBreadcrumbs = () => {
    const links = useBreadcrumbConfig({
        linkArr: [{ href: '/user', text: 'Profile' }],
    })
    return <Breadcrumbs>{links}</Breadcrumbs>
}
