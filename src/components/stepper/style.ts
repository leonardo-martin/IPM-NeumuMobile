import { StyleSheet } from 'react-native'

export const stepperStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    contentIndicator: {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingVertical: 5
    },
    label: {
        color: 'text-control-color',
    },
    icon: {
        color: 'color-basic-200'
    },
    button: {
        padding: 10,
        borderRadius: 4,
        backgroundColor: 'color-primary-default',
    }, 
    step: {
        backgroundColor: 'color-primary-default',
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineProgress: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10
        
    }
})