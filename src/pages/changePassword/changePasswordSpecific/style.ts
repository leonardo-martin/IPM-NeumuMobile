import { StyleSheet } from 'react-native'

export const changePasswdReqStyle = StyleSheet.create({
    content: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#FAFAFA'
    },
    box: {
        width: '90%',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    label: {
        color: '#626262',
        textAlign: 'center',
        padding: 4
    },
    text: {
        color: '#626262',
        alignItems: 'flex-start',
        padding: 4
    },
    input: {
        backgroundColor: '#FEFEFE',
        borderRadius: 10,
        borderColor: '#EBEBEB',
        shadowRadius: 4,
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.03)'
    },
    btn: {
        borderRadius: 50,
        marginVertical: 15
    }
})