import { StyleSheet } from 'react-native'

export const messageItemStyle = StyleSheet.create({
    avatar: {
        marginRight: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        textAlign: 'right',
        minWidth: 64,
    },
    icon: {
        color: 'text-info-color'
    }
})

