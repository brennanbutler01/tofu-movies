import { useRouter } from 'next/router'
import { useBreadcrumbConfig } from '../useBreadcrumbConfig'

interface IPersonBreadcrumbs {
    name?: string
    id: string
}

export const PersonBreadcrumbs = ({ name, id }: IPersonBreadcrumbs) => {
    const { pathname } = useRouter()
    return useBreadcrumbConfig({
        linkArr: [
            { href: pathname, text: 'Person' },
            { href: '/person/' + id, text: name || id },
        ],
    })
}
