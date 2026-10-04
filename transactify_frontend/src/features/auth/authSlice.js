import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import makeThunk from '../../api/makeThunk.js'

const post = (url) => (body) => api.post(url, body).then((res) => res.data)

export const restoreSession = makeThunk('auth/restore', post('/auth/refresh-token'))
export const login = makeThunk('auth/login', post('/auth/login'))
export const register = makeThunk('auth/register', post('/auth/register'))
export const verifyOtp = makeThunk('auth/verifyOtp', post('/auth/verify-otp'))
export const resendOtp = makeThunk('auth/resendOtp', post('/auth/resend-otp'))
export const completeRegistration = makeThunk('auth/complete', post('/auth/complete-registration'))

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout')
  } catch (error) {
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, initialized: false, registrationId: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.initialized = true
      })
      .addCase(restoreSession.rejected, (state) => {
        state.initialized = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registrationId = action.payload.registrationId
      })
      .addCase(completeRegistration.fulfilled, (state) => {
        state.registrationId = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer