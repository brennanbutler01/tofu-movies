export const prepareStringForMerge = (arg: string) => {
    if (arg.includes(',')) {
        return arg.split(',').map(part => part.trim())
    } else {
        return [arg.trim()]
    }
}

export const mergeWithoutDuplicates = (arr1: string[], arr2: string[]) => {
    return Array.from(new Set([...arr1, ...arr2]))
}
