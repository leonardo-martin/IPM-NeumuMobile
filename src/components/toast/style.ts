import { Platform, StyleSheet } from 'react-native'

export const toastStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '4%',
        left: '4%',
        right: '4%',
        zIndex: 1,
        borderRadius: 4,
        ...Platform.select({
            ios: {
                shadowColor: 'background-alternative-color-1',
                shadowOffset: {
                    height: 10,
                    width: 10
                },
                shadowOpacity: .2,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
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