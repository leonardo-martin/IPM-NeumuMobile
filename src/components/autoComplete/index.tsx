import React, { FC, ReactElement } from 'react'
import { KeyboardTypeOptions, StyleProp, TextStyle, TouchableWithoutFeedback } from 'react-native'
import { Autocomplete, Icon } from '@ui-kitten/components'
import { City, UF } from '@models/Places'


type AutoCompleteProps = {
    data: UF[] | City[] | string[]
    placeholder?: string
    label?: string
    value?: string | undefined
    onSelect?: (index: number) => void | undefined
    onChangeText?: (text: string) => void | undefined
    renderOption: (item: any, index: number) => JSX.Element
    clearInput: (field?: any) => void
    disabled?: boolean
    keyboardType?: KeyboardTypeOptions
    maxLength?: number | undefined
    autoCapitalize?: "none" | "characters" | "sentences" | "words" | undefined
    style?: StyleProp<TextStyle>
}

const AutoCompleteComponent: FC<AutoCompleteProps> = ({
    style, data, keyboardType, placeholder, maxLength, label, disabled, autoCapitalize, onSelect, onChangeText, renderOption, clearInput, value
}): ReactElement => {

    const renderCloseIcon = (props: any) => (
        <TouchableWithoutFeedback onPress={clearInput}>
            <Icon {...props} name='close' />
        </TouchableWithoutFeedback>
    )

    return (
        <Autocomplete
            style={style}
            label={label}
            keyboardType={keyboardType}
            placeholder={placeholder}
            value={value}
            autoCapitalize={autoCapitalize}
            disabled={disabled}
            maxLength={maxLength}
            accessoryRight={value ? renderCloseIcon : undefined}
            onChangeText={onChangeText}
            onSelect={onSelect}>
            {data.map(renderOption)}
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
