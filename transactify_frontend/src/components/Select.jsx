import React from "react";
import { fieldClass } from '../utils/helpers.js'

const Select = ({ label, id, name, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-body">{label}</label>
    <select id={id} name={name} value={value} onChange={onChange} className={fieldClass}>{children}</select>
  </div>
)

export default Select