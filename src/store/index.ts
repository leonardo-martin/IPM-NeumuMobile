import { combineReducers, configureStore } from '@reduxjs/toolkit'
import rootAuth from '@store/ducks/auth'
import rootProfile from '@store/ducks/profile'
import rootUser from '@store/ducks/user'
import rootChat from '@store/ducks/chat'
import rootCommon from '@store/ducks/common'

const rootReducer = combineReducers({
  auth: rootAuth,
  profile: rootProfile,
  user: rootUser,
  chat: rootChat,
  common: rootCommon
})

const store = configureStore({
  reducer: rootReducer,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
