import { StyleSheet } from 'react-native'

export const changePasswdReqStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    box: {
        width: '90%',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    label: {
        color: 'text-hint-color',
        textAlign: 'center',
        padding: 4
    },
    text: {
        color: 'text-hint-color',
        alignItems: 'flex-start',
        padding: 4
    },
    input: {
        paddingVertical: 5
    },
    btn: {
        borderRadius: 50,
        marginVertical: 15
    }
})