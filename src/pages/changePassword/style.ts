import { Platform, StyleSheet } from 'react-native'

export const changePasswdReqStyle = StyleSheet.create({
    content: {
        display: 'flex',
        alignItems: 'flex-start',
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 15
    },
    label: {
        fontSize: Platform.OS === 'ios' ? 20 : Platform.OS === 'android' ? 24 : 24,
        color: '#626262',
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