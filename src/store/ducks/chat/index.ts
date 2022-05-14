import { ChatListEntryDto } from '@models/ChatMessage'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatContextType {
  messages: ChatListEntryDto[]
}

const initialState: ChatContextType = {
  messages: []
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatList: (state = initialState, action: PayloadAction<ChatListEntryDto[]>) => {
      state.messages = action.payload
    },
    updateMessageList: (state = initialState, action: PayloadAction<{
      message: string, senderID: number, receiverId: number, timestamp: Date | string
    }>) => {
      const { message, senderID, receiverId, timestamp } = action.payload
      const list = state.messages
      const index = list.findIndex(e => e.receiverId === receiverId && e.senderID === senderID)
      if (list[index] && index >= 0) {
        list[index].payload = receiverId + ' ' + senderID + ' ' + message
        list[index].timestamp = timestamp
      }

      state.messages = list
    }
  },
})

// Action creators are generated for each case reducer function
export const { setChatList, updateMessageList } = chatSlice.actions

export default chatSlice.reducer