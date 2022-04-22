import { UserData } from '@models/User'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileContextType {
   profile: UserData | undefined
}

const initialState: ProfileContextType = {
  profile: undefined
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state = initialState, action: PayloadAction<UserData>) => {
        state.profile = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions

export default profileSlice.reducer