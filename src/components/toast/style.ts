import { StyleSheet } from 'react-native'

export const toastStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '4%',
        left: '4%',
        right: '4%',
        zIndex: 1,
        elevation: 1,
        borderRadius: 4,
    },
    text: {
        padding: 14,
        color: 'text-control-color',
        fontSize: 12,
        fontStyle: 'normal',
        fontFamily: 'System',
        textAlign: 'center',
        textTransform: 'uppercase'
    }
})