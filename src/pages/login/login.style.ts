import { StyleSheet } from 'react-native'

export const loginStyle = StyleSheet.create({
    content: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgb(255,255,255)',
    },
    view: {
        width: '85%'
    },
    loginButton: {
        marginTop: '2%',
        color: '#3171AC',
        borderRadius: 10
    },
    registerButton: {
        marginTop: '5%',
        color: '#D55F0A',
        borderRadius: 10

    },

    text: {
        backgroundColor: 'rgb(255,255,255)'
    },

})