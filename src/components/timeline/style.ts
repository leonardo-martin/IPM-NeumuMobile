import { StyleSheet } from "react-native"

export const timelineStyle = StyleSheet.create({
    container: {
        padding: 8,
        height: '100%'
    },
    list: {
        backgroundColor: 'transparent'
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5
    },
    containerItemColumnDate: {
        flex: .2,
        flexDirection: 'column',
        alignItems: 'center',
    },
    containerItemColumnInfo: {
        flex: .8,
        flexDirection: 'column'
    },
    titleItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4
    },
    containerTitleItem: {
        borderRadius: 4,
        backgroundColor: 'color-primary-default',
        padding: 5,
        paddingHorizontal: 8
    },
    viewTimeline: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5
    },
    viewTimelineItem: {
        flex: .95,
        flexDirection: 'column'
    },
    text: {
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    button: {
        paddingHorizontal: 15
    },
    verticleLine: {
        width: 2,
        height: '100%',
        opacity: 1,
        flexDirection: 'row'
    }
})