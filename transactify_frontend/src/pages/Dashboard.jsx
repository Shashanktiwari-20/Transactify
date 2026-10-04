import React from "react";
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAccount, loadAccounts } from '../features/accounts/accountSlice.js'
import { toText } from '../utils/helpers.js'
import AccountCard from '../components/AccountCard.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'

const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const { list, balances, loaded } = useSelector((state) => state.accounts)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  const refresh = () => {
    setError('')
    dispatch(loadAccounts()).unwrap().catch((err) => setError(toText(err)))
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleCreate = async () => {
    setError('')
    setCreating(true)
    try {
      await dispatch(createAccount()).unwrap()
    } catch (err) {
      setError(toText(err))
    }
    setCreating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-body">Hello, {user?.name}</h1>
          <p className="text-sm text-muted">Your accounts and their current balances.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={refresh} className="px-4 py-2.5">Refresh</Button>
          <Button onClick={handleCreate} loading={creating} className="px-4 py-2.5">Open new account</Button>
        </div>
      </div>

      <Alert>{error}</Alert>
      {!loaded && !error && <p className="text-muted">Loading your accounts...</p>}
      {loaded && list.length === 0 && (
        <div className="rounded-2xl border border-line bg-card p-6 text-center">
          <p className="font-semibold text-body">You have no accounts yet</p>
          <p className="mt-1 text-sm text-muted">Open your first account to start sending and receiving money.</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((account) => (
          <AccountCard key={account._id} account={account} balance={balances[account._id]} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard