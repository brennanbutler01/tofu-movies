export const minutesToHours = (duration: number) => {
    if (duration < 60) {
        console.log(duration, ' minutes')
        return duration + ' minutes'
    } else {
        const remainder = duration % 60
        const hours = (duration - remainder) / 60
        const singularOrPlural = hours > 1 ? 'hours' : 'hour'
        if (remainder === 0) {
            return hours + singularOrPlural
        } else {
            return (
                hours +
                ' ' +
                singularOrPlural +
                ' and ' +
                remainder +
                ' minutes'
            )
        }
    }
}
