import React from "react";
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadAccounts } from '../features/accounts/accountSlice.js'
import { sendMoney } from '../features/transactions/transactionThunks.js'
import { formatMoney, isAccountId, newKey, toText } from '../utils/helpers.js'
import Input from '../components/Input.jsx'
import Select from '../components/Select.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'

const Transfer = () => {
  const dispatch = useDispatch()
  const { list, balances } = useSelector((state) => state.accounts)
  const [form, setForm] = useState({ fromAccount: '', toAccount: '', amount: '' })
  const [key, setKey] = useState(newKey)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const activeAccounts = list.filter((account) => account.status === 'ACTIVE')
  const fromId = form.fromAccount || activeAccounts[0]?._id || ''

  useEffect(() => {
    dispatch(loadAccounts())
  }, [dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const amount = Number(form.amount)
    const toAccount = form.toAccount.trim()
    if (!fromId) return setError('Open an account on the dashboard first.')
    if (!isAccountId(toAccount)) return setError('Enter a valid recipient account ID (24 characters).')
    if (toAccount === fromId) return setError('You cannot send money to the same account.')
    if (!amount || amount <= 0) return setError('Enter an amount greater than zero.')
    if (amount > (balances[fromId] ?? 0)) return setError('The selected account does not have enough balance.')
    setLoading(true)
    try {
      await dispatch(sendMoney({ fromAccount: fromId, toAccount, amount, idempotencyKey: key })).unwrap()
      setSuccess(`${formatMoney(amount)} sent successfully.`)
      setForm({ fromAccount: fromId, toAccount: '', amount: '' })
      setKey(newKey())
      dispatch(loadAccounts())
    } catch (err) {
      setError(toText(err))
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-body">Send money</h1>
      <p className="mb-5 text-sm text-muted">Ask the recipient for their account ID. They can copy it from their dashboard.</p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
        <Alert type="success">{success}</Alert>
        <Alert>{error}</Alert>
        <Select label="From account" id="fromAccount" name="fromAccount" value={fromId} onChange={handleChange}>
          {activeAccounts.length === 0 && <option value="">No active accounts</option>}
          {activeAccounts.map((account) => (
            <option key={account._id} value={account._id}>{`...${account._id.slice(-6)} (${formatMoney(balances[account._id] ?? 0, account.currency)})`}</option>
          ))}
        </Select>
        <Input label="Recipient account ID" id="toAccount" name="toAccount" value={form.toAccount} onChange={handleChange} placeholder="Paste the 24-character ID" autoComplete="off" />
        <Input label="Amount" id="amount" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" min="0" step="0.01" inputMode="decimal" />
        <Button type="submit" loading={loading}>Send money</Button>
      </form>
    </div>
  )
}

export default Transfer