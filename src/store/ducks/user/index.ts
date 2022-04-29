import { UserRelatedIdsDto } from '@models/User'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserContextType {
  ids: UserRelatedIdsDto | undefined
}

const initialState: UserContextType = {
  ids: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state = initialState, action: PayloadAction<UserRelatedIdsDto>) => {
      state.ids = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions

export default userSlice.reducer