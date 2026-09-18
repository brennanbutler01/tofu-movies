import { IProviderDetails } from 'pages/api/watchProviders/[id]'
import { useWatchProvidersSWR } from 'useWatchProvidersSWR'

export type ProviderCategories = 'top' | 'free' | 'subscription'

type ProviderData = { data: IProviderDetails | undefined }

type TopProviders =
    | 'netflix'
    | 'disneyPlus'
    | 'appleTvPlus'
    | 'tubi'
    | 'plutoTv'
    | 'hulu'
    | 'starz'
    | 'amazonPrime'
    | 'discoveryPlus'
    | 'crackle'
    | 'showtime'
    | 'fuboTv'
    | 'hboMax'
    | 'paramountPlus'

type FreeProviders =
    | 'crackle'
    | 'tubi'
    | 'plutoTv'
    | 'crunchyroll'
    | 'vudu'
    | 'peacock'
    | 'plex'
    | 'popcornflix'

type SubscriptionProviders =
    | 'britBox'
    | 'criterionChannel'
    | 'epix'
    | 'kanopy'
    | 'shudder'
    | 'fandor'
    | 'hbo'
    | 'hoopla'
    | 'indieFlix'
    | 'mubi'
    | 'acornTv'
    | 'appleTvPlus'
    | 'disneyPlus'
    | 'fuboTv'
    | 'hboMax'
    | 'netflix'
    | 'paramountPlus'
    | 'amazonPrime'
    | 'showtime'
    | 'starz'
    | 'youtubePremium'

export const useProviders = () => {
    const watchProviders = useWatchProvidersSWR({})

    const netflix = watchProviders?.find(p => p.provider_id === 8)
    const disneyPlus = watchProviders?.find(p => p.provider_id === 337)
    const appleTvPlus = watchProviders?.find(p => p.provider_id === 350)
    const tubi = watchProviders?.find(p => p.provider_id === 73)
    const plutoTv = watchProviders?.find(p => p.provider_id === 300)
    const starz = watchProviders?.find(p => p.provider_id === 43)
    const hulu = watchProviders?.find(p => p.provider_id === 15)
    const amazonPrime = watchProviders?.find(p => p.provider_id === 9)
    const discoveryPlus = watchProviders?.find(p => p.provider_id === 520)
    const crackle = watchProviders?.find(p => p.provider_id === 12)
    const showtime = watchProviders?.find(p => p.provider_id === 37)
    const fuboTv = watchProviders?.find(p => p.provider_id === 257)
    const hboMax = watchProviders?.find(p => p.provider_id === 384)
    const paramountPlus = watchProviders?.find(p => p.provider_id === 531)

    const top: Record<TopProviders, ProviderData> = {
        netflix: {
            data: netflix,
        },
        disneyPlus: {
            data: disneyPlus,
        },
        appleTvPlus: {
            data: appleTvPlus,
        },
        tubi: {
            data: tubi,
        },
        plutoTv: {
            data: plutoTv,
        },
        starz: {
            data: starz,
        },
        hulu: { data: hulu },
        amazonPrime: { data: amazonPrime },
        discoveryPlus: { data: discoveryPlus },
        crackle: { data: crackle },
        showtime: { data: showtime },
        fuboTv: { data: fuboTv },
        hboMax: { data: hboMax },
        paramountPlus: { data: paramountPlus },
    }

    const crunchyroll = watchProviders?.find(p => p.provider_id === 283)
    const vudu = watchProviders?.find(p => p.provider_id === 7)
    const peacock = watchProviders?.find(p => p.provider_id === 386)
    const plex = watchProviders?.find(p => p.provider_id === 538)
    const popcornflix = watchProviders?.find(p => p.provider_id === 241)

    const free: Record<FreeProviders, ProviderData> = {
        tubi: { data: tubi },
        plutoTv: { data: plutoTv },
        crackle: { data: crackle },
        crunchyroll: { data: crunchyroll },
        vudu: { data: vudu },
        peacock: { data: peacock },
        plex: { data: plex },
        popcornflix: { data: popcornflix },
    }

    const acornTv = watchProviders?.find(p => p.provider_id === 87)
    const britBox = watchProviders?.find(p => p.provider_id === 151)
    const criterionChannel = watchProviders?.find(p => p.provider_id === 258)
    const epix = watchProviders?.find(p => p.provider_id === 34)
    const kanopy = watchProviders?.find(p => p.provider_id === 191)
    const shudder = watchProviders?.find(p => p.provider_id === 99)
    const fandor = watchProviders?.find(p => p.provider_id === 25)
    const hbo = watchProviders?.find(p => p.provider_id === 118)
    const hoopla = watchProviders?.find(p => p.provider_id === 212)
    const indieFlix = watchProviders?.find(p => p.provider_id === 368)
    const mubi = watchProviders?.find(p => p.provider_id === 11)

    const youtubePremium = watchProviders?.find(p => p.provider_id === 188)

    const subscription: Record<SubscriptionProviders, ProviderData> = {
        acornTv: { data: acornTv },
        appleTvPlus: { data: appleTvPlus },
        britBox: { data: britBox },
        criterionChannel: { data: criterionChannel },
        epix: { data: epix },
        kanopy: { data: kanopy },
        shudder: { data: shudder },
        fandor: { data: fandor },
        hbo: { data: hbo },
        hoopla: { data: hoopla },
        indieFlix: { data: indieFlix },
        mubi: { data: mubi },
        youtubePremium: { data: youtubePremium },
        disneyPlus: { data: disneyPlus },
        fuboTv: { data: fuboTv },
        hboMax: { data: hboMax },
        netflix: { data: netflix },
        paramountPlus: { data: paramountPlus },
        amazonPrime: { data: amazonPrime },
        showtime: { data: showtime },
        starz: { data: starz },
    }

    return { top, free, subscription }
}
