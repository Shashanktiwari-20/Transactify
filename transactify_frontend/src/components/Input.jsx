import React from "react";
import { fieldClass } from '../utils/helpers.js'

const Input = ({ label, id, name, value, onChange, type = 'text', placeholder = '', required = true, ...rest }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-body">{label}</label>
    <input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className={fieldClass} {...rest} />
  </div>
)

export default Input