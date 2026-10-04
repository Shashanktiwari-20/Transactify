import React from "react";
import ThemeToggle from './ThemeToggle.jsx'

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen flex-col">
    <div className="flex justify-end p-4">
      <ThemeToggle />
    </div>
    <div className="flex flex-1 items-start justify-center px-4 pb-10 sm:items-center">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-lg font-bold text-white">T</span>
          <span className="text-2xl font-bold text-body">Transactify</span>
        </div>
        <div className="mt-6 rounded-2xl border border-line bg-card p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-body">{title}</h1>
          <p className="mb-5 mt-1 text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout