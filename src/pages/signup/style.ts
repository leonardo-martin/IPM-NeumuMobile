import { StyleSheet } from 'react-native'

export const registerStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        flex: 1,
    },
    box: {
        width: '90%',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    label: {
        color: 'text-basic-color',
        textAlign: 'center',
        padding: 4
    },
    text: {
        color: 'text-basic-color',
        alignItems: 'flex-start',
        fontSize: 11,
        padding: 4
    },
    input: {
        paddingVertical: 5
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'color-primary-default'
    },
    toggleButton: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    labelCNSView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelCNSText: {
        color: '#8F9BB3',
        display: 'flex'
    },
    labelCNSViewCard: {
        paddingVertical: 40
    },
    labelCNSTextCenter: {
        textAlign: 'center'
    },
    viewBtn: {
        alignItems: 'flex-end',
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    icon: {
        color: 'color-basic-200'
    },
    iconCns: {
        color: 'color-basic-600'
    },
    autoComplete: {
        paddingBottom: 10
    },
})