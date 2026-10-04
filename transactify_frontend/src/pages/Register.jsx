import React from "react";
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { completeRegistration, register, resendOtp, verifyOtp } from '../features/auth/authSlice.js'
import { toText } from '../utils/helpers.js'
import AuthLayout from '../components/AuthLayout.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const registrationId = useSelector((state) => state.auth.registrationId)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [otp, setOtp] = useState('')
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (form.name.trim().length < 3) return setError('Name must be at least 3 characters.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setLoading(true)
    try {
      await dispatch(register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password })).unwrap()
      setInfo('We emailed you a 6-digit code. It expires in 5 minutes.')
      setStep(2)
    } catch (err) {
      setError(toText(err))
    }
    setLoading(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (!verified) {
        await dispatch(verifyOtp({ registrationId, otp })).unwrap()
        setVerified(true)
      }
      await dispatch(completeRegistration({ registrationId })).unwrap()
      navigate('/login', { state: { message: 'Account created. Please sign in.' }, replace: true })
    } catch (err) {
      setError(toText(err))
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    try {
      await dispatch(resendOtp({ registrationId })).unwrap()
      setInfo('A new code is on its way to your email.')
    } catch (err) {
      setError(toText(err))
    }
  }

  if (step === 2) {
    return (
      <AuthLayout title="Check your email" subtitle={`Enter the code we sent to ${form.email}.`}>
        <form onSubmit={handleVerify} className="space-y-4">
          <Alert type="success">{info}</Alert>
          <Alert>{error}</Alert>
          <Input label="Verification code" id="otp" name="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="123456" maxLength={6} inputMode="numeric" autoComplete="one-time-code" />
          <Button type="submit" loading={loading}>Verify and create account</Button>
          <Button variant="secondary" onClick={handleResend} disabled={loading}>Send a new code</Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={handleRegister} className="space-y-4">
        <Alert>{error}</Alert>
        <Input label="Full name" id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" />
        <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
        <Input label="Password" id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" autoComplete="new-password" />
        <Input label="Confirm password" id="confirm" name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Type it again" autoComplete="new-password" />
        <Button type="submit" loading={loading}>Send verification code</Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-semibold text-body underline">Sign in</Link></p>
    </AuthLayout>
  )
}

export default Register