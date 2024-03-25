import React, { useEffect, useState, useMemo } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl } from '@material-ui/core'
import ms from 'milsymbol'
import { convertLetterSidc2NumberSidc } from '@orbat-mapper/convert-symbology'
import 'leaflet/dist/leaflet.css'
import renderDropdown from './helpers/renderDeopdown'
import useStyles from './helpers/SidcGeneratorStyles'
import PropsTypes from './PropsTypes/types'
import replaceNumber from './helpers/replace-number'
import { dropdownOptions } from './helpers/SharedData'

const SIDCGenerator: React.FC<PropsTypes> = (props) => {
  const { onClose, onSave, sidcValue } = props

  const [symbolElement, setSymbolElement] = useState<any | ms.Symbol>(null)
  const [sidcCode, setSidCode] = useState<string>('')
  const [originalNumber, setOriginalNumber] = useState<string>('')
  const [symbolCode, setSymbolCode] = useState<string>('')
  const classes = useStyles()

  const memoizedDropdownOptions = useMemo(() => dropdownOptions(symbolCode), [symbolCode])

  useEffect(() => {
    const options = { size: 70 }
    const symbol = new ms.Symbol(originalNumber, options)
    setSidCode(originalNumber)
    setSymbolElement(symbol.asDOM())
  }, [originalNumber])

  useEffect(() => {
    let value = sidcValue
    const isValid = !isNaN(Number(value))
    if (!isValid) {
      const { sidc } = convertLetterSidc2NumberSidc(value)
      value = sidc
      console.log(`${value} is not a valid number.`)
    }
    const originValue = value
    setSymbolCode(originValue[4] + originValue[5])
    setOriginalNumber(originValue)
  }, [sidcValue])

  const handleSave = () => {
    onSave(originalNumber)
    onClose && onClose()
  }

  const handleDropdownChange = (e: React.ChangeEvent<{ value: unknown }>, key: number) => {
    const replesNumber = replaceNumber(originalNumber, e.target.value as string, key)
    const newSymbolCode = replesNumber[4] + replesNumber[5]
    setSymbolCode(newSymbolCode)
    setOriginalNumber(replesNumber)
  }

  const renderDropdownOptions = useMemo(() => {
    return memoizedDropdownOptions.map(option =>
      renderDropdown({
        index: option.index,
        endindex: option.endindex,
        data: option.value,
        onChange: (e: React.ChangeEvent<{ value: unknown }>) => handleDropdownChange(e, option.index),
        label: option.name,
        originalNumber
      })
    )
  }, [memoizedDropdownOptions, originalNumber])

  return (
    <>
      {onClose && (
        <Dialog className={classes.root} open={true} onClose={onClose}>
          <DialogTitle>SIDC Code: {sidcCode}</DialogTitle>
          <DialogContent>
            {symbolElement && (
              <div className={classes.symbolContainer} dangerouslySetInnerHTML={{ __html: symbolElement.outerHTML }} />
            )}
          </DialogContent>
          <DialogTitle>SIDC Generator</DialogTitle>
          <DialogContent className={classes.content}>
            <FormControl className={classes.formControl}>
              {renderDropdownOptions}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} onClick={handleSave} color="primary">Done</Button>
            <Button className={classes.button} onClick={onClose} color="primary">Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default SIDCGenerator
