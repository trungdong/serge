import React from 'react'

import cx from 'classnames'

/* Import proptypes */
import PropTypes from './types/props'

/* Import Styles */
import styles from './styles.module.scss'

/* Render component */
export const Button: React.FC<PropTypes> = ({ children, size, type, onClick, disabled }) => {
  const handeClick = (e: any) => {
    if (typeof onClick === 'function') {
      onClick(e)
    }
  }
  return (
    <button
      onClick={handeClick}
      disabled={disabled}
      type={type || 'button'}
      className={cx(styles.main, size && styles[size], disabled && styles.disabled)}
    >
      {children}
    </button>
  )
}

export default Button
