import { IProviderDetails } from 'pages/api/watchProviders/[id]'
import useSWR from 'swr'

interface IUseWatchProviders {
    fallbackData?: IProviderDetails[]
}

export const useWatchProvidersSWR = ({ fallbackData }: IUseWatchProviders) => {
    const data = useSWR('/api/watchProviders', { fallbackData })
    return data?.data as IProviderDetails[]
}
