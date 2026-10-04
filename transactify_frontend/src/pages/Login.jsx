import React from "react";
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { login } from '../features/auth/authSlice.js'
import { toText } from '../utils/helpers.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'

const Login = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await dispatch(login({ email: form.email.trim().toLowerCase(), password: form.password })).unwrap()
    } catch (err) {
      setError(toText(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your accounts.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert type="success">{location.state?.message}</Alert>
        <Alert>{error}</Alert>
        <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
        <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Your password" autoComplete="current-password" />
        <Button type="submit" loading={loading}>Sign in</Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">New to Transactify? <Link to="/register" className="font-semibold text-body underline">Create an account</Link></p>
    </AuthLayout>
  )
}

export default Login