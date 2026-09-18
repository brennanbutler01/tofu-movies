import { useBreadcrumbConfig } from '../useBreadcrumbConfig'

interface IReviewBreadcrumbs {
    id?: string
}

export const ReviewBreadcrumbs = ({ id }: IReviewBreadcrumbs) => {
    return useBreadcrumbConfig({
        linkArr: [
            {
                href: '/reviews',
                text: 'Reviews',
            },
            ...(id ? [{ href: '/reviews/' + id, text: 'This Review' }] : []),
        ],
    })
}
