import { Accordion, Checkbox, Group, NumberInput } from '@mantine/core'
import React from 'react'
interface IIMdbFilter {
    filterByIMDB: boolean
    setFilterByIMDB: React.Dispatch<React.SetStateAction<boolean>>
    imdbRating: number | undefined
    setImdbRating: React.Dispatch<React.SetStateAction<number | undefined>>
}
export const IMDBFilter = ({
    filterByIMDB,
    setFilterByIMDB,
    imdbRating,
    setImdbRating,
}: IIMdbFilter) => {
    return (
        <Accordion variant='filled'>
            <Accordion.Item value='filters'>
                <Accordion.Control>Additional Filters</Accordion.Control>
                <Accordion.Panel>
                    <Group mt='md'>
                        <Checkbox
                            label='Filter by IMDB?'
                            checked={filterByIMDB}
                            onChange={e =>
                                setFilterByIMDB(e.currentTarget.checked)
                            }
                        />
                        {filterByIMDB && (
                            <NumberInput
                                label='Imdb Rating'
                                precision={1}
                                min={0}
                                step={0.5}
                                max={10}
                                value={imdbRating}
                                onChange={setImdbRating}
                            />
                        )}
                    </Group>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
