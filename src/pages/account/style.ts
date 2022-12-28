import { StyleSheet } from "react-native";

const SPACING = 20

export const accountVerificationStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: SPACING
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        flexWrap: 'wrap'
    },
    containerText: {
        paddingBottom: SPACING
    },
    button: {
        borderRadius: 60
    }
})