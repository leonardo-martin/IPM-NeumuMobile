import { StyleSheet } from 'react-native'

const LINE_HEIGHT = 25

export const infoAppStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 25,
        justifyContent: 'center'
    },
    version: {
        fontSize: 16,
        paddingVertical: 5
    },
    paragraph: {
        fontFamily: 'System',
        textAlign: 'justify',
        paddingVertical: 10,
        fontSize: 14,
        lineHeight: LINE_HEIGHT
    },
    ordered: {
        fontFamily: 'System',
        textAlign: 'justify',
        paddingVertical: 5,
        fontSize: 14,
    },
    regards: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: LINE_HEIGHT,
        paddingTop: 15,
        textTransform: 'uppercase'
    },
    app: {
        fontWeight: '300',
        fontSize: 13,
        lineHeight: LINE_HEIGHT
    },
    textItem: {
        fontWeight: '600',
        paddingVertical: 15,
        textAlign: 'center'
    },
    title: {
        fontWeight: 'bold',
        paddingVertical: 15,
        textTransform: 'uppercase',
        fontSize: 18
    },
    divider: {
        flexDirection: 'row',
        flexGrow: 1,
        borderWidth: .5,
        borderColor: 'border-basic-color-5'
    },
    moreView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    moreText: {
        paddingHorizontal: 15,
        textTransform: 'uppercase',
        color: 'text-primary-color',
        fontSize: 14,
        fontWeight: 'bold'
    },
    icon: {
        color: 'text-control-color',
    },
})