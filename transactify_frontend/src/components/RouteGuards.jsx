import React from "react";
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from './Loader.jsx'

export const ProtectedRoute = () => {
  const { user, initialized } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!initialized) return <Loader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

export const GuestRoute = () => {
  const { user, initialized } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!initialized) return <Loader />
  if (user) return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
  return <Outlet />
}