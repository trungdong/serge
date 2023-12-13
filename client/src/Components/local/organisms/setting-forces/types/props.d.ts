import { ForceData } from 'src/custom-types'
import { Item } from '../../molecules/sortable-list'

type Forces = Array<ForceData>

export default interface PropTypes {
  forces: Forces
  onChange: (updates: { forces: Forces }) => void
  onSave: (forces: Array<ForceData>) => void
  onRejectedIcon?: (rejected: any) => void
  onSidebarClick?: (selectedForce: ForceData) => void
  onCreate?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  selectedForce?: ForceData
  iconUploadUrl?: string
  /** Handler for when user tries to delete role with Game Control privileges */
  customDeleteHandler?: (NewItems: Item[], key: number, handleChange: (changedItems: Item[]) => void) => void
}

export { ForceData, Role } from 'src/custom-types'
