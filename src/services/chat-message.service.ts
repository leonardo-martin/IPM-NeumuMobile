import { ChatListEntryDto, ChatMessageDto, ChatMessageHistoryRequest } from "@models/ChatMessage"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { api } from "./api.service"

const SKIP = 0
const TAKE = 5

export const getMessageHistory = async (options: ChatMessageHistoryRequest, config?: AxiosRequestConfig): Promise<AxiosResponse<ChatMessageDto[]>> => {

    const params = new URLSearchParams()
    if (options.receiverId)
        params.append('receiverId', options.receiverId.toString())

    params.append('skip', options.skip?.toString() ?? SKIP.toString())
    params.append('take', options.take?.toString() ?? TAKE.toString())

    return await api.get('chat-message/message-history?' + params, config)
}

export const getChatList = async (config?: AxiosRequestConfig): Promise<AxiosResponse<ChatListEntryDto[]>> => {
    return await api.get('chat-message/chat-list', config)
}