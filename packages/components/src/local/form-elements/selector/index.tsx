import React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { camelCase, capitalize, kebabCase } from 'lodash'

/* Import Types */
import PropTypes from './types/props'

/* Import Stylesheet */
// import styles from './styles.module.scss'

import InputContainer from '../../input-container'

export const renderOptions = (options: Array<string | number>) => options.map(option => (
  <MenuItem
    key={option}
    value={kebabCase(option.toString())}
  >
    {capitalize(option.toString())}
  </MenuItem>
))

/* Render component */
export const Selector: React.FC<PropTypes> = ({ name, label, options, selected, updateState }: PropTypes) => {
  const handleChange = (event: any): void => updateState(event.target.value)

  const inputName = name || camelCase(label)

  return <InputContainer label={label}>
    <Select labelId={label} id={inputName} value={selected} onChange={handleChange}>
      {renderOptions(options)}
    </Select>
  </InputContainer>
}

export default Selector
