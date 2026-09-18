import { IConfig } from 'pages/api/config'
import useSWR from 'swr'

export const useImageConfigSWR = () => {
    const data = useSWR('/api/config')
    return data?.data as IConfig
}
