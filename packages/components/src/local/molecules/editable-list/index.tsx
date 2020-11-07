import React from 'react'

/* Import proptypes */
import PropTypes, { Item } from './types/props'

/* Import Styles */
import styles from './styles.module.scss'

/* Import Components */
import Button from '../../atoms/button'
import SearchList from '../search-list'

/* Render component */
export const EditableList: React.FC<PropTypes> = ({
  onClick,
  items,
  title = 'Add',
  qaType = 'add',
  onCreate,
  onDuplicate,
  onDelete,
  selectedItem,
  filterKey = 'name',
  labelKey = 'name',
  searchLabel = 'Search',
  withSearch
}) => {
  const handleClick = (item: Item): void => {
    if (typeof onClick === 'function') {
      onClick(item)
    }
  }

  const handleCreate = (): void => {
    if (typeof onCreate === 'function') {
      onCreate()
    }
  }

  const handleDuplicate = (item: Item): void => {
    if (typeof onDuplicate === 'function') {
      onDuplicate(item)
    }
  }

  const handleDelete = (item: Item): void => {
    if (typeof onDelete === 'function') {
      onDelete(item)
    }
  }

  const filterChannels = (item: Item, value: string): boolean => {
    return item[filterKey].toLowerCase().indexOf(value.toLowerCase()) > -1
  }

  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <Button
          color="secondary"
          size="large"
          onClick={handleCreate}
          data-qa-type={qaType}
        >
          {title}
        </Button>
      </div>
      <SearchList
        listData={items}
        setSelected={handleClick}
        placeholder={searchLabel}
        activeRow={(item: Item): boolean => item[filterKey] === selectedItem}
        rowLabel={(item: Item): string => item[labelKey]}
        rowFilter={filterChannels}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        withSearch={withSearch === undefined ? true : withSearch}
      />
    </div>
  )
}

export { Item } from './types/props'

export default EditableList
