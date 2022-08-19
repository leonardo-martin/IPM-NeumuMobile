import { UserData } from '@models/User'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User extends UserData {
  phone1: string
}

interface ProfileContextType {
  profile: User | undefined
  profilePic: string | undefined
  profilePicId: number | undefined
}

const initialState: ProfileContextType = {
  profile: undefined,
  profilePic: undefined,
  profilePicId: undefined
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state = initialState, action: PayloadAction<User>) => {
      state.profile = action.payload
    },
    setProfilePic: (state = initialState, action: PayloadAction<{ base64: string, id: number }>) => {
      state.profilePic = action.payload.base64
      state.profilePicId = action.payload.id
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProfile, setProfilePic } = profileSlice.actions

export default profileSlice.reducer