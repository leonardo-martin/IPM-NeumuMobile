import React, { FC, ForwardedRef, forwardRef, ReactElement } from 'react'
import { Autocomplete, AutocompleteProps } from '@ui-kitten/components'
import { City, Country, UF } from '@models/Places'

interface AutoCompleteProps extends AutocompleteProps {
    ref?: ForwardedRef<Autocomplete>
    data: UF[] | City[] | Country[] | string[]
    renderOption: (item: any, index: number) => JSX.Element
}

const AutoCompleteComponent: FC<AutoCompleteProps> = forwardRef<Autocomplete, AutoCompleteProps>(({ ...props }, ref): ReactElement => {

    return (
        <Autocomplete ref={ref} {...props}>
            {props.data.map(props.renderOption)}
        </Autocomplete>
    )
})

AutoCompleteComponent.defaultProps = {
    data: [],
    placeholder: '',
    label: '',
    disabled: false,
    autoCapitalize: 'none',
    value: undefined,
    onSelect: undefined,
    onChangeText: undefined,
    keyboardType: 'default'
}

export default AutoCompleteComponent

