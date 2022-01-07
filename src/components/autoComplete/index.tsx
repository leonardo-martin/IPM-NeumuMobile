import React, { FC, ReactElement } from 'react'
import { Autocomplete, AutocompleteProps } from '@ui-kitten/components'
import { City, UF } from '@models/Places'

interface AutoCompleteProps extends AutocompleteProps {
    data: UF[] | City[] | string[]
    renderOption: (item: any, index: number) => JSX.Element
}

const AutoCompleteComponent: FC<AutoCompleteProps> = (props): ReactElement => {

    return (
        <Autocomplete
            {...props}   >
            {props.data.map(props.renderOption)}
        </Autocomplete>
    )
}

AutoCompleteComponent.defaultProps = {
    data: [],
    placeholder: 'Place your Text',
    label: '',
    disabled: false,
    autoCapitalize: 'none',
    value: undefined,
    onSelect: undefined,
    onChangeText: undefined,
    keyboardType: 'default'
}

export default AutoCompleteComponent

