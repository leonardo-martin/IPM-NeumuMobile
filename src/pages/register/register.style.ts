import { StyleSheet } from 'react-native'

export const registerStyle = StyleSheet.create({
    content: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgb(255,255,255)',
    },
    view: {
        width: '90%'
    },
    text: {
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 20,
        maxHeight: '50%',
    },
    continuedButton: {
        marginTop: '2%',
        color: '#3171AC',
        borderRadius: 10,
        marginLeft: '20%',
        marginRight: '20%'
    },


})