import React from "react";
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <h1 className="text-2xl font-bold text-body">Page not found</h1>
    <p className="mb-4 mt-1 text-sm text-muted">The page you are looking for does not exist.</p>
    <Link to="/dashboard" className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Go to dashboard</Link>
  </div>
)

export default NotFound