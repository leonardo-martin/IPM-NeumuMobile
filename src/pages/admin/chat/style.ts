import { StyleSheet } from 'react-native'

export const chatRoomStyle = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    messageInputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 20,
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

