import { createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import makeThunk from '../../api/makeThunk.js'
import { logout } from '../auth/authSlice.js'

export const loadAccounts = makeThunk('accounts/load', async () => {
  const { data } = await api.get('/account/getUserAccounts')
  const balances = {}
  await Promise.all(
    data.accounts.map(async (account) => {
      const res = await api.get(`/account/Balance/${account._id}`)
      balances[account._id] = res.data.balance
    })
  )
  return { list: data.accounts, balances }
})

export const createAccount = makeThunk('accounts/create', () => api.post('/account/createAccount').then((res) => res.data.account))

const initialState = { list: [], balances: {}, loaded: false }

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAccounts.fulfilled, (state, action) => {
        state.list = action.payload.list
        state.balances = action.payload.balances
        state.loaded = true
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.list.push(action.payload)
        state.balances[action.payload._id] = 0
      })
      .addCase(logout.fulfilled, () => initialState)
  },
})

export default accountSlice.reducer