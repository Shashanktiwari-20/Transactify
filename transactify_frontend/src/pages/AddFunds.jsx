import React from "react";
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addFunds } from '../features/transactions/transactionThunks.js'
import { formatMoney, isAccountId, newKey, toText } from '../utils/helpers.js'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'

const AddFunds = () => {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ toAccount: '', amount: '' })
  const [key, setKey] = useState(newKey)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const amount = Number(form.amount)
    const toAccount = form.toAccount.trim()
    if (!isAccountId(toAccount)) return setError('Enter a valid account ID (24 characters).')
    if (!amount || amount <= 0) return setError('Enter an amount greater than zero.')
    setLoading(true)
    try {
      await dispatch(addFunds({ toAccount, amount, idempotencyKey: key })).unwrap()
      setSuccess(`${formatMoney(amount)} added to the account.`)
      setForm({ toAccount: '', amount: '' })
      setKey(newKey())
    } catch (err) {
      setError(toText(err))
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-body">Add funds</h1>
      <p className="mb-5 text-sm text-muted">Available to system users only. Money is credited from the system account.</p>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-6">
        <Alert type="success">{success}</Alert>
        <Alert>{error}</Alert>
        <Input label="Account ID to credit" id="toAccount" name="toAccount" value={form.toAccount} onChange={handleChange} placeholder="Paste the 24-character ID" autoComplete="off" />
        <Input label="Amount" id="amount" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" min="0" step="0.01" inputMode="decimal" />
        <Button type="submit" loading={loading}>Add funds</Button>
      </form>
    </div>
  )
}

export default AddFunds