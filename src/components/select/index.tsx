import React, { FC, ReactElement, useEffect, useState } from 'react'
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components'

interface Item {
    id: number | string
    title: string
    disabled: boolean
}

type SelectProps = {
    items: Item[]
    selectedIndex: IndexPath | IndexPath[] | undefined
    onSelect?: (index: IndexPath | IndexPath[]) => void
}

const SelectComponent: FC<SelectProps> = ({ items, selectedIndex, onSelect }): ReactElement => {

    const [displayValue, setDisplayValue] = useState<string>(items[Number(selectedIndex) - 1].title)

    useEffect(() => {
        setDisplayValue(items[Number(selectedIndex) - 1].title)
    }, [selectedIndex])

    return (
        <Layout level='1'>
            <Select
                selectedIndex={selectedIndex}
                onSelect={onSelect}
                value={displayValue}
            >
                {items.map(item =>
                    <SelectItem
                        disabled={item.disabled}
                        key={item.id}
                        title={item.title} />
                )}
            </Select>
        </Layout>
    )
}

export default SelectComponent