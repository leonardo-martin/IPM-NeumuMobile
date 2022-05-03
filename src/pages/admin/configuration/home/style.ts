import { StyleSheet } from 'react-native'

export const configurationStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
        margin: 20
    },
    item: {
        marginVertical: 4,
    },
    badge: {
        borderWidth: 2,
        borderColor: 'color-danger-500',
        paddingVertical: 1,
        paddingHorizontal: 6,
        backgroundColor: 'color-danger-500',
        borderRadius: 50
    },
    badgeText: {
        color: 'text-control-color',
        fontWeight: 'bold'
    }
})