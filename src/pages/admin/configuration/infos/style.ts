import { StyleSheet } from 'react-native'

export const infoAppStyle = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    viewInfoApp: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewText: {
        paddingVertical: 10
    },
    text: {
        textAlign: 'center',
        flexShrink: 1,
        flexWrap: 'wrap',
        fontStyle: 'normal',
        lineHeight: 15,
        color: '#626262'
    },
    viewEasterEgg: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 30,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        color: '#626262'
    },
    textEasterEgg: {
        fontSize: 12,
        textAlign: 'center',
        color: '#626262'
    }
});
