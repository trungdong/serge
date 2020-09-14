import React from 'react'

/* Import Types */
import PropTypes from './types/props'
import { Message as MessageType } from '@serge/custom-types'

/* Import Stylesheet */
import styles from './styles.module.scss'

/* Import Components */
import AdminMessage from '../../molecules/admin-message'
import { Box, Button } from '@material-ui/core'

/* Render component */
export const AdminMessagesList: React.FC<PropTypes> = ({ messages, markAllAsRead, force }: PropTypes) => {
  return (
    <div className={styles['message-list']}>
      <Box mb={2}>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={markAllAsRead}
        >
          <span className={styles['action-label']}>Mark all as read</span>
        </Button>
      </Box>
      {
        messages && messages.map((message: MessageType) => <AdminMessage force={force} key={message._id} message={message} />)
      }
    </div>
  )
}

export default AdminMessagesList
