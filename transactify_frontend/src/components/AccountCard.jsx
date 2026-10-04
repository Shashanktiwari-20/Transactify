import React from "react";
import { useState } from 'react'
import { formatMoney } from '../utils/helpers.js'

const AccountCard = ({ account, balance }) => {
  const [copied, setCopied] = useState(false)

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(account._id)
      setCopied(true)
    } catch (error) {
      setCopied(false)
    }
  }

  return (
    <div className="min-w-0 rounded-2xl bg-brand p-5 text-white">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-white/80">{account.currency} account</span>
        <span className="badge rounded-full px-2 py-0.5 text-xs font-semibold">{account.status}</span>
      </div>
      <p className="mt-5 text-sm text-white/80">Available balance</p>
      <p className="text-2xl font-bold sm:text-3xl">{balance === undefined ? '...' : formatMoney(balance, account.currency)}</p>
      <p className="mt-5 text-xs text-white/80">Account ID</p>
      <p className="break-all text-xs font-medium">{account._id}</p>
      <button type="button" onClick={copyId} className="mt-3 rounded-lg border border-white/40 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">{copied ? 'Copied' : 'Copy ID'}</button>
    </div>
  )
}

export default AccountCard