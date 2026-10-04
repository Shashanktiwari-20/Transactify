import React from 'react'

const Button = ({ children, loading = false, disabled = false, variant = 'primary', type = 'button', onClick, className = 'w-full px-4 py-2.5' }) => {
  const look = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return (
    <button type={type} onClick={onClick} disabled={loading || disabled} className={`rounded-lg text-sm font-semibold ${look} ${className}`}>
      {loading ? 'Please wait...' : children}
    </button>
  )
}

export default Button