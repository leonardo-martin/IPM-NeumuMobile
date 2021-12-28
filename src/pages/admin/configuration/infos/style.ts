import { StyleSheet } from 'react-native'

export const infoAppStyle = StyleSheet.create({
    content: {
        flex: 1,
    },
    viewInfoApp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewText: {
        paddingVertical: 15
    },
    text: {
        paddingVertical: 10,
        textAlign: 'center',
        flexShrink: 1,
        flexWrap: 'wrap',
        fontSize: 20,
        lineHeight: 15
    }
})