import { combineReducers, configureStore } from '@reduxjs/toolkit'
import rootAuth from '@store/ducks/auth'

const rootReducer = combineReducers({
  auth: rootAuth,
})

const store = configureStore({
  reducer: rootReducer,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
