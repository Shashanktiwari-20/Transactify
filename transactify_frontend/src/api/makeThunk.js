import { createAsyncThunk } from '@reduxjs/toolkit'
import { errMsg } from './axios.js'

const makeThunk = (type, apiCall) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await apiCall(arg)
    } catch (error) {
      return rejectWithValue(errMsg(error))
    }
  })

export default makeThunk