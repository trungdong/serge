import React from 'react'

/* Import Types */
import PropTypes from './types/props'
import Form from '../form'
import { Button } from '@material-ui/core'
import ForcePicker from '../form-elements/force-picker'

/* Import helpers */
import { getSelectedItem } from '@serge/helpers'
/* Render component */
export const PerceptionForm: React.FC<PropTypes> = ({ formHeader, formData, postBack }) => {
  const { perceivedForce } = formData

  console.log(postBack)

  return <Form type="perceived-as" headerText={formHeader}>
    <fieldset>
      <ForcePicker label="Perceived Force" options={perceivedForce} selected={getSelectedItem(perceivedForce).name} />
    </fieldset>
    <Button>Save</Button>
  </Form>
}

export default PerceptionForm
