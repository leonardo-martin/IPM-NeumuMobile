import { StyleSheet } from 'react-native'

export const chatRoomStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    messageInputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 16,
        backgroundColor: 'background-basic-color-1',
    },
    attachButton: {
        borderRadius: 24,
        marginHorizontal: 8,
    },
    messageInput: {
        flex: 1,
        marginHorizontal: 8,
    },
    sendButton: {
        marginRight: 4,
    },
    iconButton: {
        width: 24,
        height: 24,
    },
})

