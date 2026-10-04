import React from 'react'

const Alert = ({ type = 'error', children }) => {
  if (!children) return null
  const look = type === 'error' ? 'alert-error' : 'alert-success'
  return <div role="alert" className={`rounded-lg border px-3 py-2 text-sm ${look}`}>{children}</div>
}

export default Alert