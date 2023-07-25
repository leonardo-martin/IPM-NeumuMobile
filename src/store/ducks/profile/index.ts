import { UserData } from '@models/User'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VisitAddressDTO } from 'models/VisitAddress'

interface User extends UserData {
  phone1: string
}

interface ProfileContextType {
  profile: User | undefined
  profilePic: string | undefined
  profilePicId: number | undefined
  visitAddress?: VisitAddressDTO[]
}

const initialState: ProfileContextType = {
  profile: undefined,
  profilePic: undefined,
  profilePicId: undefined,
  visitAddress: undefined
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state = initialState, action: PayloadAction<User>) => {
      state.profile = action.payload
    },
    setProfilePic: (state = initialState, action: PayloadAction<{ base64: string, id: number } | null>) => {
      state.profilePic = action.payload?.base64 || undefined
      state.profilePicId = action.payload?.id || undefined
    },
    setVisitAddress: (state = initialState, action: PayloadAction<VisitAddressDTO[]>) => {
      state.visitAddress = action.payload.length > 0 ? action.payload : undefined
    },
  },
})

// Action creators are generated for each case reducer function
export const { setProfile, setProfilePic, setVisitAddress } = profileSlice.actions

export default profileSlice.reducer