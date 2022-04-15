import { Platform, StyleSheet } from 'react-native'

export const signupStyle = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 30,
        backgroundColor: 'color-primary-default'
    },
    stepIndicator: {
        backgroundColor: 'color-primary-default',
        width: 40,
        height: 40,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsModal: {
        padding: 25
    },
    checkbox: {
        margin: 2,
    },
    viewCheckbox: {
        alignItems: 'flex-start',
        paddingVertical: 20
    },
    text: {
        color: 'text-basic-color',
        alignItems: 'flex-start',
        fontSize: 11,
        padding: 4
    },
    content: {
        flex: 1,
        paddingHorizontal: 15
    },
    viewBtn: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingVertical: 15
    }
})

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
    radioGroup: {
        padding: 25,
        paddingVertical: 10
    },
    box: {
        padding: 15
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
        fontSize: 16,
        padding: Platform.OS === 'ios' ? 15 : Platform.OS === 'android' ? 5 : 5,
        textAlign: 'justify'
    },
    viewLabel: {
        alignItems: 'flex-start'
    },
    text: {
        color: 'text-basic-color',
        alignItems: 'flex-start',
        fontSize: 12,
        padding: 4
    },
    input: {
        paddingVertical: 5
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
    modal: {
        width: '90%'
    },
    labelCNSView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    iconCns: {
        color: 'color-basic-600'
    },
    registerBtn: {
        borderRadius: 50,
        marginVertical: 5
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
    },
    backdropDatepicker: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    titleModal: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingVertical: 15,
        color: 'text-basic-color',
        alignItems: 'flex-start',
    }
})