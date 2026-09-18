import { Embla } from '@mantine/carousel'
import { useState } from 'react'

export const useEmbla = () => {
    const [embla, setEmbla] = useState<Embla | null>(null)
    const goBack = () => embla?.scrollPrev()
    const goForward = () => embla?.scrollNext()
    return { setEmbla, goBack, goForward }
}
