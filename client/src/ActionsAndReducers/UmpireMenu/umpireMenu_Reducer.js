import * as ActionConstant from 'src/config'
import deepCopy from '../../Helpers/copyStateHelper.js'

const initialState = {
  selectedSchemaID: '',
  previewSchema: {}
}

export const umpireMenuReducer = (state = initialState, action) => {
  const newState = deepCopy(state)

  switch (action.type) {
    case ActionConstant.SET_SELECTED_SCHEMA:
      newState.selectedSchemaID = action.payload
      return newState

    case ActionConstant.SET_PREVIEW_SCHEMA:
      newState.previewSchema = action.payload
      return newState

    default:
      return newState
  }
}
