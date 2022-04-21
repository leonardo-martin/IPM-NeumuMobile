import { combineReducers, configureStore } from '@reduxjs/toolkit'
import rootAuth from '@store/ducks/auth'
import rootProfile from '@store/ducks/profile'

const rootReducer = combineReducers({
  auth: rootAuth,
  profile: rootProfile
})

const store = configureStore({
  reducer: rootReducer,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
