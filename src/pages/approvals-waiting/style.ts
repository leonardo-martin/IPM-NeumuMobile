import { StyleSheet } from "react-native";

const SPACING = 20

export const approvalsWaitingStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: .9,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: SPACING
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        padding: 15
    },
    containerBottom: {
        flex: .1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        flexWrap: 'wrap'
    },
    contactLink: {
        color: 'color-primary-default',
        fontWeight: '600'
    }
})