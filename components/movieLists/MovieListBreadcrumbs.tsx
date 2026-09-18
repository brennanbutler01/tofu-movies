import { useMovieListsSWR } from 'movieLists/useMovieListsSWR'
import { useRouter } from 'next/router'
import { useBreadcrumbConfig } from '../useBreadcrumbConfig'

export const MovieListBreadcrumbs = () => {
    const { data: swrMovieLists } = useMovieListsSWR({})
    const { query, pathname } = useRouter()
    return useBreadcrumbConfig({
        linkArr: [
            { text: 'Movie Lists', href: '/movieLists' },
            ...(query?.id
                ? [
                      {
                          text:
                              swrMovieLists?.find(list => list.id === query?.id)
                                  ?.title || '',
                          href: pathname,
                      },
                  ]
                : []),
        ],
    })
}
