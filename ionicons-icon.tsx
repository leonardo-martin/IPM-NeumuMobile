import { IconProps } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export const IoniconsIconsPack = {
    name: 'ionicons',
    icons: createIconsMap(),
}

function createIconsMap() {
    return new Proxy({}, {
        get(target, name) {
            return IconProvider(name)
        },
    })
}

const IconProvider = (name: any) => ({
    toReactElement: (props: any) => IoniconsIcon({ name, ...props }),
})

function IoniconsIcon(props: IconProps) {

    const style = StyleSheet.flatten(props.style)
    const { ...iconStyle } = style

    return (
        <Icon
            name={props.name}
            size={props.size !== undefined ? props.size : iconStyle?.height !== undefined ? iconStyle.height : 15}
            color={props.color !== undefined ? props.color : iconStyle?.color !== undefined ? iconStyle.color : iconStyle.tintColor}
            onPress={props.onPress} />
    )
}