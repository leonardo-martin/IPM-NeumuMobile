import { StyleSheet } from "react-native"

export const detailsAboutStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        paddingHorizontal: 25
    },
    heading: {
        paddingBottom: 15
    },
    blockquote: {
        flexDirection: 'row',
        borderLeftWidth: 5,
        borderStyle: 'solid',
        borderLeftColor: 'color-basic-400',
        padding: 10,
        marginTop: 6,
        marginLeft: 6
    }
})