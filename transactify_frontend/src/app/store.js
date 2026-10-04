import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import accountReducer from '../features/accounts/accountSlice.js'
import themeReducer from '../features/theme/themeSlice.js'

export const store = configureStore({
  reducer: { 
    auth: authReducer, 
    accounts: accountReducer, 
    theme: themeReducer 
},
})