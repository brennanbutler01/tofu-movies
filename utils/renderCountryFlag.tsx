import Flag from 'react-world-flags'
import { countryToAlpha2 } from 'country-to-iso'

export const renderCountryFlag = (country: string) => {
    return <Flag height={16} code={countryToAlpha2(country.trim()) || ''} />
}
