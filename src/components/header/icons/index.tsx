import React from 'react'
import { Icon, IconElement, IconProps, useTheme } from "@ui-kitten/components"
import { Platform } from "react-native"

export const BackIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name={Platform.OS === 'ios' ? 'chevron-back-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'arrow-back-outline'} size={25} pack='ionicons' />
    )
}

export const MenuIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="menu-outline" size={25} pack='ionicons' />
    )
}

export const ChatIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="chatbubbles" size={25} pack='ionicons' />
    )
}

export const OptionsIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="ellipsis-vertical-outline" size={25} pack='ionicons' />
    )
}

export const FolderAddIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="folder-add-outline" size={25} pack='eva' />
    )
}

export const ReceiptIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="receipt-outline" size={25} pack='ionicons' />
    )
}

export const PlusIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="add-outline" size={25} pack='ionicons' />
    )
}