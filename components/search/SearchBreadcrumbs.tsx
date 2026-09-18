import { useBreadcrumbConfig } from '../useBreadcrumbConfig'

export const SearchBreadcrumbs = () => {
    return useBreadcrumbConfig({
        linkArr: [{ href: '/search', text: 'Search' }],
    })
}
