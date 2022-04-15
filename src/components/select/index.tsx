import React, { Dispatch, FC, ForwardedRef, forwardRef, ReactElement, useEffect, useState } from 'react'
import { Icon, IndexPath, Select, SelectItem, SelectProps } from '@ui-kitten/components'
import { useCombinedRefs } from '@hooks/useCombinedRefs'
import { ImageProps, View } from 'react-native'

export interface SelectItemData {
    id: number | string
    title: string
    disabled?: boolean
}

type SelectCustomProps = {
    ref?: ForwardedRef<Select>
    items: SelectItemData[]
    clearSelected?: Dispatch<React.SetStateAction<IndexPath | IndexPath[] | undefined>>
} & SelectProps

const SelectComponent: FC<SelectCustomProps> = forwardRef<Select, SelectCustomProps>(({ items, ...props }, ref): ReactElement => {

    const combinedRef = useCombinedRefs(ref, ref)
    const [displayValue, setDisplayValue] = useState<string>('')

    useEffect(() => {
        if (props.selectedIndex)
            setDisplayValue(items[Number(props.selectedIndex) - 1].title)
        else setDisplayValue('')
    }, [props.selectedIndex])

    const renderRightIcon = (_props: Partial<ImageProps> | undefined) => (
        <>
            {displayValue !== '' && props.clearSelected ?
                <View {..._props}>
                    <Icon
                        {..._props}
                        name='close-outline'
                        size={20}
                        onPress={() => props.clearSelected && props.clearSelected(undefined)} />
                </View>
                : null}
        </>
    )

    return (
        <Select
            ref={combinedRef}
            {...props}
            value={displayValue}
            accessoryRight={props.selectedIndex ? renderRightIcon : undefined}
        >
            {items.map(item =>
                <SelectItem
                    disabled={item.disabled}
                    key={item.id}
                    title={item.title} />
            )}
        </Select>
    )
})

export default SelectComponent