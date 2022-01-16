import { faAddressBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Tabs } from '@serge/components'
import cx from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { PlayerLogPayload } from '../../ActionsAndReducers/PlayerLog/PlayerLog_types'
import { getPlayerLogs } from '../../api/wargames_api'
import { usePlayerUiState } from '../../Store/PlayerUi'
import styles from './styles.module.scss'
import { PlayerLogModal, PLayerLogProps } from './types/props'

const playerLogTabs = [
  'overview'
]

const REFRESH_PLAYER_LOG_INTERVAL = 5000

const PlayerLog: React.FC<PLayerLogProps> = ({ isOpen, onClose }): React.ReactElement => {
  const { allForces } = usePlayerUiState()
  const [loop, setLoop] = useState<any>();
  const [activeTab, setActivaTab] = useState<string>(playerLogTabs[0])
  const [playerLog, setPlayerLog] = useState<PlayerLogModal[]>([])

  const onTabChanged = (changedTab: string): void => {
    setActivaTab(changedTab)
  }

  const fetchPlayerlog = (): void => {
    getPlayerLogs().then((payload: PlayerLogPayload[]) => {
      const logDataModal: PlayerLogModal[] = []
      payload.forEach(log => {
        for (let i = 0; i < allForces.length; i++) {
          const role = allForces[i].roles.find(role => role.roleId === log.role)
          if (role) {
            logDataModal.push({
              roleName: role.name,
              message: 'message', // TODO: get message info
              updatedAt: moment(log.updatedAt).fromNow(),
              active: (moment().diff(moment(log.updatedAt)) / 60000) < 1
            })
            break;
          }
        }
      })
      setPlayerLog(logDataModal)
    })
  }

  useEffect(() => {
    if (isOpen) {
      setLoop(setInterval(() => {
        fetchPlayerlog()
      }, REFRESH_PLAYER_LOG_INTERVAL))

    } else {
      fetchPlayerlog()
      clearInterval(loop)
    }
  }, [isOpen])

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
        <Tabs activeTab={activeTab} onChange={onTabChanged} tabs={playerLogTabs} />
        {
          activeTab === 'overview' && (
            <div className={styles.tableContent}>
              <div className={cx(styles.row, styles.header)}>
                <span>Role</span>
                <span>Message</span>
                <span>Sent at</span>
              </div>
              {playerLog.length === 0 &&
                <div className={styles.loader}>
                  <CircularProgress />
                </div>}
              <div className={styles.logContent}>
                {playerLog.map((log, idx) => (
                  <div key={idx} className={cx(styles.row, styles.item)}>
                    <span><p className={cx({ [styles.active]: log.active, [styles.inactive]: !log.active })}>●</p> {log.roleName}</span>
                    <span>{log.message}</span>
                    <span>{log.updatedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>
    </Modal>
  )
}

export default PlayerLog