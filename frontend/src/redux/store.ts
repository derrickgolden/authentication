import { configureStore } from '@reduxjs/toolkit'
import userDetailsReducer from './userDetails'
import callApiReducer from './callApi'

export const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer, 
    callApi: callApiReducer,
  },
})
