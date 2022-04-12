import { Dimensions, StyleSheet } from "react-native"

const { width } = Dimensions.get('screen')

export const notesStyle = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    contentContainerList: {
        width: '100%',
    },
    listStyle: {
        backgroundColor: 'transparent',
        width: '100%'
    },
    footerCard: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    viewCard: {
        height: 160,
        width: '50%',
        padding: 10
    },
    card: {
        height: '100%'
    },
    viewList: {
        padding: 8,
        width: width
    },
    input: {
        paddingHorizontal: 16
    },
    icon: {
        color: 'text-basic-color'
    }
})