import { Platform, StyleSheet } from 'react-native'

export const registerStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        alignItems: 'center',
        flex: 1,
    },
    contentPage3: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1
    },
    radioGroup: {
        padding: 25,
        paddingVertical: 10
    },
    box: {
        flex: 1,
        paddingVertical: 0,
        padding: 25,
        justifyContent: 'center'
    },
    boxMultiplesInputs: {
        paddingVertical: 0,
        padding: 25,
    },
    label: {
        color: 'text-basic-color',
        textAlign: 'center',
        padding: 4
    },
    labelTitle: {
        fontSize: Platform.OS === 'ios' ? 20 : Platform.OS === 'android' ? 24 : 24,
        padding: Platform.OS === 'ios' ? 15 : Platform.OS === 'android' ? 5 : 5,
    },
    viewLabel: {
        alignItems: 'flex-start',
        paddingHorizontal: 20
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
        paddingVertical: 25
    },
    icon: {
        color: 'color-basic-200'
    },
    iconCns: {
        color: 'color-basic-600'
    },
    registerBtn: {
        borderRadius: 50,
        marginVertical: 5
    },
    radioText: {
        fontSize: Platform.OS === 'ios' ? 14 : Platform.OS === 'android' ? 16 : 16,
        paddingHorizontal: 10,
        color: 'text-hint-color',
        fontWeight: 'normal'
    },
    checkbox: {
        margin: 2,
    },
    viewCheckbox: {
        alignItems: 'flex-start',
        padding: 25
    },
    viewConfirmBtn: {
        width: '85%',
    },
    labelBasic: {
        color: "text-hint-color",
        fontFamily: "System",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 8,        
        textAlign: "left"
    },
    backdropSpinner: {
        position: 'absolute',
        flex: 1,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'background-basic-color-2',
        opacity: 0.6
    }
})