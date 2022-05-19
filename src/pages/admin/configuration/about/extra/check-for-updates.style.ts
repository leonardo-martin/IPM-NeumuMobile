import { StyleSheet } from 'react-native'

export const checkForUpdateStyle = StyleSheet.create({
    checkForUpdatesBtn: {
        flexDirection: 'row',
        borderRadius: 50,
        padding: 10,
        backgroundColor: 'color-primary-400',
    },
    checkForUpdatesText: {
        color: 'text-control-color',
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '600',
        textAlign: 'center',
        paddingEnd: 5
    }
})