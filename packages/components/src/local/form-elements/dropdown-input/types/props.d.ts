export default interface PropTypes {
  updateStore: (value: any) => void
  selectOptions: { value: string, option: string }[]
  disabled?: boolean
  data: string
  className: string
  placeholder: string
}