import { UserData } from '@models/User'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User extends UserData {
  phone1: string
}

interface ProfileContextType {
  profile: User | undefined
}

const initialState: ProfileContextType = {
  profile: undefined
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state = initialState, action: PayloadAction<User>) => {
      state.profile = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions

export default profileSlice.reducer