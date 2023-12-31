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
        paddingVertical: 10
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
        paddingTop: 10,
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
    },
    contactLink: {
        color: 'color-primary-default',
        fontWeight: '600'
    },
    partnerContainer: {
        paddingHorizontal: 20,
        paddingTop: 5,
        alignItems: 'center',
    },
    partnerTitle: {
        color: 'text-hint-color',
        fontFamily: "System",
        fontSize: 12,
        fontWeight: "800",
        marginBottom: 5,
        textAlign: "left"
    },
    partnerText: {
        fontSize: 18,
        fontWeight: '600'
    },
    partnerBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'color-primary-500',
        borderColor: 'border-basic-color-5',
        borderWidth: .5,
        borderRadius: 4,
        padding: 5
    },
    partnerTextContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-between'
    }
})