import Badge from '@components/badge'
import { Icon, IconElement, IconProps, useTheme } from "@ui-kitten/components"
import React from 'react'
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

export const ChatIcon = (props: IconProps, _showBadge: boolean = false, count?: number) => {
    const theme = useTheme()
    return (
        <>
            <Icon {...props} style={[props.style, {
                color: theme['color-basic-600']
            }]} name="chatbubbles" size={25} pack='ionicons' />
            {_showBadge && (<Badge position='absolute' count={count} />)}
        </>
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
        }]} name="folder-add" size={25} pack='eva' />
    )
}

export const ReceiptIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="receipt" size={25} pack='ionicons' />
    )
}

export const PlusIcon = (props: IconProps): IconElement => {
    const theme = useTheme()
    return (
        <Icon {...props} style={[props.style, {
            color: theme['color-basic-600']
        }]} name="add" size={25} pack='ionicons' />
    )
}