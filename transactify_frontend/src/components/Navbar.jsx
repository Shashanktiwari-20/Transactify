import React from "react";
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice.js'
import ThemeToggle from './ThemeToggle.jsx'
import Button from './Button.jsx'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transfer', label: 'Transfer' },
  { to: '/add-funds', label: 'Add funds' },
]

const Navbar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const linkClass = ({ isActive }) => `rounded-md px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-white/20 text-gold' : 'text-white hover:bg-white/10'}`

  return (
    <header className="bg-brand">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <span className="text-lg font-bold text-white">Transactify</span>
        <div className="order-last flex w-full gap-1 sm:order-none sm:w-auto">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-white sm:inline">{user?.name}</span>
          <ThemeToggle />
          <Button variant="secondary" onClick={() => dispatch(logout())} className="px-3 py-1.5">Logout</Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar