import { StyleSheet } from 'react-native'

const SPACING = 15

export const messageItemStyle = StyleSheet.create({
    avatar: {
        marginRight: SPACING,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        textAlign: 'right',
        minWidth: 64
    },
    icon: {
        color: 'text-info-color'
    },
    listItem: {
        paddingVertical: SPACING,
        paddingHorizontal: SPACING
    }
})

