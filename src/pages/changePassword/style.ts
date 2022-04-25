import { Platform, StyleSheet } from 'react-native'

export const changePasswdReqStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: .9,
    },
    label: {
        textAlign: 'center',
        fontSize: Platform.OS === 'ios' ? 20 : Platform.OS === 'android' ? 24 : 24,
        padding: Platform.OS === 'ios' ? 15 : Platform.OS === 'android' ? 5 : 5
    },
    controlContainer: {
        padding: 25
    },
    radioText: {
        fontSize: Platform.OS === 'ios' ? 14 : Platform.OS === 'android' ? 16 : 16,
        paddingHorizontal: 10,
        color: 'text-hint-color',
        fontWeight: 'normal'
    },
    viewDetails: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    message: {
        color: 'text-hint-color',
        textAlign: 'center'
    },
    boldText: {
        color: 'color-primary-default',
        fontWeight: '600',
        textAlign: 'center'
    }
})