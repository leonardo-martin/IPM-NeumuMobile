import { Platform, StyleSheet } from 'react-native'

export const changePasswdReqStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        display: 'flex',
        alignItems: 'flex-start',
        flex: 1,
        paddingHorizontal: 15
    },
    label: {
        fontSize: Platform.OS === 'ios' ? 20 : Platform.OS === 'android' ? 24 : 24,
        color: 'text-hint-color',
        padding: Platform.OS === 'ios' ? 15 : Platform.OS === 'android' ? 5 : 5
    },
    controlContainer: {
        paddingVertical: 30,
        paddingHorizontal: 15
    },
    radioText: {
        fontSize: Platform.OS === 'ios' ? 14 : Platform.OS === 'android' ? 18 : 18,
        paddingHorizontal: 10
    }
})