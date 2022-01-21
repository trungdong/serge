import { faAddressBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircularProgress from '@material-ui/core/CircularProgress'
import RefreshIcon from '@material-ui/icons/Cached'
import { ForceData, PlayerLog, PlayerLogInstance, Role } from '@serge/custom-types'
import cx from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { PlayerLogPayload } from '../../ActionsAndReducers/PlayerLog/PlayerLog_types'
import { getPlayerLogs } from '../../api/wargames_api'
import { usePlayerUiState } from '../../Store/PlayerUi'
import styles from './styles.module.scss'
import { PlayerLogModal, PLayerLogProps } from './types/props'
import { uniq } from 'lodash'

const REFRESH_PLAYER_LOG_INTERVAL = 5000

// the player must have been active within this threshold to be treated as `ACTIVE`
const AGE_FOR_ACTIVE_MILLIS = 60000

const PlayerLogComponent: React.FC<PLayerLogProps> = ({ isOpen, onClose }): React.ReactElement => {
  const { allForces, playerLog: messageLog, currentWargame } = usePlayerUiState()
  const [loop, setLoop] = useState<any>();
  const [playerLogData, setPlayerLogData] = useState<PlayerLogModal[]>([])
  const [refreshing, setRefreshState] = useState<boolean>(false)

  const fetchPlayerlog = (messageLog: PlayerLog): void => {
    setRefreshState(true)
    getPlayerLogs().then((payload: PlayerLogPayload[]) => {
      setRefreshState(false)
      const logDataModal: PlayerLogModal[] = []
      const activityLogsForThisWargame = payload && payload.length && payload.filter((value: PlayerLogPayload) => value.wargame === currentWargame) || []
      const activityRoles = activityLogsForThisWargame.map((value: PlayerLogPayload) => value.role)
      const messageRoles = Object.values(messageLog).map((value: PlayerLogInstance) => value.roleId)
      const knownRoles = activityRoles.concat(messageRoles)
      const uniqueRoles = uniq(knownRoles)

      allForces.forEach((force: ForceData) => {
        force.roles.forEach((role: Role) => {
          if (uniqueRoles.includes(role.roleId)) {
            const activity = activityLogsForThisWargame.find((value: PlayerLogPayload) => value.role === role.roleId)
            const lastMessage = messageLog[role.roleId]
            const message = lastMessage && lastMessage.lastMessageTitle || 'N/A'
            const messageTime = lastMessage && lastMessage.lastMessageTime
            logDataModal.push({
              forceName: force.name,
              forceColor: force.color,
              roleName: role.name,
              message,
              lastMessage: messageTime ? moment(messageTime).fromNow() : 'N/A',
              lastActive: activity ? moment(activity.updatedAt).fromNow() : 'N/A',
              active: activity && (moment().diff(moment(activity.updatedAt))) < AGE_FOR_ACTIVE_MILLIS || false
            })
          }
        })
      })
      setPlayerLogData(logDataModal)
    })
  }

  useEffect(() => {
    clearInterval(loop)
    if (isOpen) {
      setLoop(setInterval(() => {
        fetchPlayerlog(messageLog)
      }, REFRESH_PLAYER_LOG_INTERVAL))

    }
  }, [isOpen, messageLog])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <div className={styles.modalHeader}>
        <div className={styles.closeIcon} onClick={onClose}>x</div>
        <div className={styles.playerLogIcon}>
          <FontAwesomeIcon icon={faAddressBook} />
          <div className={styles.title}>
            <span className={styles.titleMain}>Player Log</span>
            <span className={styles.titleHint}>Use this log to track player activity and status</span>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.tableContent}>
          <span className={cx({ [styles.refreshIcon]: true, [styles.rotate]: refreshing })}><RefreshIcon /></span>
          <div className={cx(styles.row, styles.header)}>
            <span>Force</span>
            <span>Role</span>
            <span>Last Active</span>
            <span>Message</span>
            <span>Sent at</span>
          </div>
          {playerLogData.length === 0 &&
            <div className={styles.loader}>
              <CircularProgress />
            </div>}
          <div className={styles.logContent}>
            {playerLogData.map((log, idx) => (
              <div key={idx} className={cx(styles.row, styles.item)}>
                <span>
                  <img key={'force_icon_' + idx} className={styles['role-icon']} alt="" style={{ backgroundColor: log.forceColor }} />&nbsp;
                  {log.forceName}
                </span>
                <span>
                  <img key={'active_icon_' + idx} className={cx({ [styles.active]: log.active, [styles.inactive]: !log.active })} alt="" />&nbsp;{log.roleName}
                </span>
                <span>{log.lastActive}</span>
                <span>{log.message}</span>
                <span>{log.lastMessage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PlayerLogComponent