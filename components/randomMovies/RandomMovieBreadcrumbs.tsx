import { useBreadcrumbConfig } from '../useBreadcrumbConfig'

export const RandomMovieBreadcrumbs = () => {
    return useBreadcrumbConfig({
        linkArr: [{ href: '/randomMovie', text: 'Random Movie' }],
    })
}
