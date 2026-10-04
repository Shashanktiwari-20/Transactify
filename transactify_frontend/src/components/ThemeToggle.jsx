import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/theme/themeSlice.js'

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const mode = useSelector((state) => state.theme.mode)

  return (
    <button type="button" onClick={() => dispatch(toggleTheme())} aria-label="Switch colour mode" className="btn-secondary rounded-lg px-3 py-1.5 text-sm font-semibold">{mode === 'dark' ? 'Light' : 'Dark'}</button>
  )
}

export default ThemeToggle