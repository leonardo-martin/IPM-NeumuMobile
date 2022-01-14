import { Platform, StyleSheet } from 'react-native'

export const changePasswdReqStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {        
        flex: 1,
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
        fontSize: Platform.OS === 'ios' ? 14 : Platform.OS === 'android' ? 18 : 18,
        paddingHorizontal: 10,
        color: 'color-basic-700'
    }
})