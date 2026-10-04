export const fieldClass = 'field'

export const newKey = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)
export const formatMoney = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
export const isAccountId = (value) => /^[a-f0-9]{24}$/i.test(value)
export const toText = (error) => (typeof error === 'string' ? error : error?.message || 'Something went wrong')