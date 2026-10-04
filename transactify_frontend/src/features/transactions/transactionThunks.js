import api from '../../api/axios.js'
import makeThunk from '../../api/makeThunk.js'

export const sendMoney = makeThunk('transactions/send', (body) => api.post('/transaction/createTransaction', body).then((res) => res.data))
export const addFunds = makeThunk('transactions/addFunds', (body) => api.post('/transaction/system/initial-funds', body).then((res) => res.data))