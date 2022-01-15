import { HeartbeatChecker } from '@serge/components'
import preval from 'preval.macro'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { addNotification, hideNotification } from '../ActionsAndReducers/Notification/Notification_ActionCreators'
import { PlayerLogPayload } from '../ActionsAndReducers/PlayerLog/PlayerLog_types'
import { pingServer as pingServerApi, sendPlayerLog } from '../api/wargames_api'
import { SERVER_PING_INTERVAL, UMPIRE_FORCE } from '../consts'
import { usePlayerUiState } from '../Store/PlayerUi'

type Notification = {
  message: string,
  type: string,
  id: number,
  autoHide: boolean,
  subType: string
}

type VersionProps = {
  notifications: Notification[]
  playerLog: PlayerLogPayload
}

const appBuildDate = preval`module.exports = new Date().toISOString().slice(0, 19).replace('T', ' ')`
// trim off the seconds
const trimmedAppBuildDate = appBuildDate.substring(0, appBuildDate.length - 3)

const mapStateToProps = ({ notifications, playerLog }: { notifications: Notification[], playerLog: PlayerLogPayload }) => ({ notifications, playerLog })

const Version: React.FC<VersionProps> = ({ notifications, playerLog }) => {
  const dispatch = useDispatch()
  const [toggleBeat, setToggleBeat] = useState(false)
  const [serverStatus, setServerStatus] = useState('')
  const [serverPingTime, setServerPingTime] = useState<number>(0)
  const isUmpire = (window as any).selectedChannel && (window as any).selectedChannel === UMPIRE_FORCE

  useEffect(() => {
    // check for previous heartbeat notification
    const prevNotification = notifications.filter(i => i.subType === 'HeartbeatAlert')
    if (serverStatus === 'NOT_OK') {
      if (prevNotification.length === 0) {
        const message = isUmpire ? 'Server down' : 'Check connection - please check with admin'
        dispatch(addNotification(message, 'warning', false, 'HeartbeatAlert'))
      }
    } else {
      if (prevNotification.length > 0) {
        dispatch(hideNotification(prevNotification[0]))
      }
    }

    if (serverPingTime) {
      setToggleBeat(true)
    }
  }, [serverStatus, serverPingTime])

  const pingServer = () => {
    return pingServerApi().then(res => {
      setServerStatus(res)
      setServerPingTime(new Date().getTime())
      return res
    })
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      pingServer()
      sendPlayerLog(playerLog)
    }, SERVER_PING_INTERVAL)

    return () => {
      clearInterval(timerId)
    }
  }, [playerLog])

  return (
    <ul className='version-container'>
      <li>
        <HeartbeatChecker
          enableHeartbeat={serverStatus === 'OK'}
          animate={toggleBeat} onAnimateComplete={() => setToggleBeat(false)}
          className="heartbeat-checker"
        />
      </li>
      <li>V:<span>{process.env.REACT_APP_VERSION}</span></li>
      <li><span>{trimmedAppBuildDate}</span></li>
    </ul>
  )
}

export default connect(mapStateToProps)(Version)
