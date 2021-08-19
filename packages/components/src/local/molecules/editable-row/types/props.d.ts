import { EDITABLE_SELECT_ITEM, EDITABLE_SWITCH_ITEM } from '..'

export interface Option {
  name: string
  uniqid: string
  [property: string]: any
}
export interface SelectItem {
  readonly uniqid: string
  type: typeof EDITABLE_SELECT_ITEM
  title?: string
  active?: Array<number>
  multiple?: boolean
  emptyTitle?: string
  options: Array<Option>
}
export interface SwitchItem {
  readonly uniqid: string
  type: typeof EDITABLE_SWITCH_ITEM
  title?: string
  active?: boolean
  emptyTitle?: string
}

export type Item = SelectItem | SwitchItem

export default interface PropTypes {
  items: Array<Item>
  onChange: (nextItems: Array<Item>, changedKey: number) => Array<Item>
  onSave?: (nextItems: Array<Item>) => void
  onRemove?: () => void
  actions?: boolean
  defaultMode: 'view' | 'edit'
  noSwitchOnReset?: boolean
  isGenerator?: boolean
}
