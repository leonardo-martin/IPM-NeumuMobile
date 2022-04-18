import { TokenModel } from '@models/TokenModel'
import { AuthenticationPayload } from '@models/User'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode'

interface AuthContextType {
  isAuthenticated: boolean
  payload: AuthenticationPayload | undefined
  sessionUser: TokenModel | undefined
}

const initialState: AuthContextType = {
  isAuthenticated: false,
  payload: undefined,
  sessionUser: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state = initialState, action: PayloadAction<AuthenticationPayload>) => {

      state.payload = action.payload
      state.isAuthenticated = true
      state.sessionUser = jwt_decode(action.payload.accessToken) as TokenModel
    },
    logout: (_state = initialState) => {
      return { ...initialState }
    }
  },
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer