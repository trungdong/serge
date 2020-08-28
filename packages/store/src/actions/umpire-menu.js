import ActionConstant from '../constants'

export const setSelectedSchema = (schemaId) => ({
  type: ActionConstant.SET_SELECTED_SCHEMA,
  payload: schemaId
})

export const setPreviewSchema = (schema) => ({
  type: ActionConstant.SET_PREVIEW_SCHEMA,
  payload: schema
})