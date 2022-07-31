import { Checkbox, FormControlLabel } from '@material-ui/core'
import { SelectOption } from '@serge/custom-types'
import cx from 'classnames'
import { camelCase } from 'lodash'
import React, { ChangeEvent, useEffect, useState } from 'react'
import InputContainer from '../../atoms/input-container'
import styles from './styles.module.scss'
import PropTypes from './types/props'
import { makeStyles } from '@material-ui/styles'

const buildStyles = (options: SelectOption[]): any => {
  const opts = {}
  options.forEach((option, idx) => {
    opts[`root-${idx}`] = {}
    opts[`root-${idx}`].color = `${option.colour} !important`
  })
  return makeStyles(opts)
}

export const Forces: React.FC<PropTypes> = ({
  options,
  value,
  onChange,
  name,
  label,
  labelPlacement,
  disableOffset,
  className
}) => {
  type SelectionItem = { name: string, selected: boolean };
  const [selectionItems, updateSelectionItems] = useState<SelectionItem[]>([])
  const classes = buildStyles(options)()

  useEffect(() => {
    const selection: SelectionItem[] = options.map(
      (option: SelectOption) => {
        let selected = false
        if (Array.isArray(value)) {
          selected = value.includes(option.name)
        } else {
          selected = value === option.name
        }
        return {
          name: option.name,
          selected
        }
      }
    )
    updateSelectionItems(selection)
  }, [value, options])

  const handleForcesChange = (data: ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = data.target
    const visibleTo: (string | number)[] = []

    const updatedArray: SelectionItem[] = selectionItems.map(
      (item: SelectionItem): SelectionItem => {
        if (item.name === value) {
          item.selected = checked
        }
        if (item.selected) {
          visibleTo.push(item.name)
        }
        return item
      }
    )

    updateSelectionItems(updatedArray)
    onChange && onChange({ visibleTo })
  }

  const inputName = name || camelCase(label)

  return (
    <InputContainer
      label={label}
      className={cx(className, styles['input-container'])}
      disableOffset={disableOffset}
    >
      {options.map((option, idx) => {
        const selected = selectionItems.find(item => item.selected && item.name === option.name)
        const childClass = { root: classes[`root-${idx}`] }
        return (
          <FormControlLabel
            key={idx}
            labelPlacement={labelPlacement}
            title={option.name}
            control={
              <Checkbox
                classes={childClass}
                name={inputName.toString()}
                value={option.name}
                checked={!!selected}
                onChange={handleForcesChange}
                size="small"
              />
            }
            label={option.name}
            value={option.name}
            className={selected ? styles.selected : ''}
          />
        )
      })}
    </InputContainer>
  )
}

export default Forces
