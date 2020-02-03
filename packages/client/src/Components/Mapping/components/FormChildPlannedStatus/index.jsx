import React, { useState } from 'react'

const PlannedStatus = ({ store, onStoreUpdate, callbackFunction }) => {
  const [currentMarker] = useState(store.currentMarker)
  const [markerStatus, setMarkerStatus] = useState(store.currentMarkerStatus)
  const [markerSpeed, setMarkerSpeed] = useState(store.currentMarkerSpeed)
  const [turnsInThisState, setTurnsInThisState] = useState(store.turnsInThisState)
  const [isMobile, setIsMobile] = useState(store.currentMarkerIsMobile)

  // Get all of the possible states and speeds
  const { states, speedKts } = currentMarker.platformTypeDetail

  // A copy of the store to capture the updates
  const newStore = store

  // TODO: The functions below are used in another component too and are almost identical. This can defintiely be refactored
  const handleSubmit = (e) => {
    e.preventDefault()
    newStore.formType = 'planned-status'
    callbackFunction(newStore)
  }

  const handleStatusChange = ({ target }) => {
    const isMobileCheck = states.find(state => state.name === target.value).mobile
    setMarkerStatus(target.value)
    setIsMobile(isMobileCheck)

    newStore.currentMarkerStatus = target.value
    newStore.currentMarkerIsMobile = isMobileCheck
    if (!isMobileCheck) {
      setMarkerSpeed(null)
      newStore.currentMarkerSpeed = null
    }
    // save data in helper class to not lose it after popup recreate
    onStoreUpdate(newStore)
  }

  const handleSpeedChange = ({ target }) => {
    const val = parseInt(target.value)
    setMarkerSpeed(val)
    newStore.currentMarkerSpeed = val
    // save data in helper class to not lose it after popup recreate
    onStoreUpdate(newStore)
  }

  const handleMobileChange = ({ target }) => {
    const val = parseInt(target.value)
    setTurnsInThisState(val)
    newStore.turnsInThisState = val
    // save data in helper class to not lose it after popup recreate
    onStoreUpdate(newStore)
  }

  return (
    <div>
      <div className="input-container radio">
        <label htmlFor="state">Status</label>
        <ul>
          {
            states.map(status =>
              <li key={status.name}>
                <label>
                  {status.name}
                  <input onChange={handleStatusChange} name="state" type="radio" value={status.name} checked={markerStatus === status.name}/>
                </label>
              </li>
            )
          }
        </ul>
      </div>
      { (speedKts && speedKts.length && isMobile) &&
        <div className="input-container radio">
          <label htmlFor="speed">Speed (kts)</label>
          <ul>
            {
              speedKts.map(speed =>
                <li key={speed}>
                  <label>
                    {speed}
                    <input onChange={handleSpeedChange} name="speed" type="radio" value={speed} checked={markerSpeed === speed} />
                  </label>
                </li>
              )
            }
          </ul>
        </div>
      }
      {
        !isMobile &&
        <div className="input-container short-number">
          <label>
            For
            <input onChange={handleMobileChange} type="number" value={turnsInThisState} />
            turns
          </label>
        </div>
      }
      <button onClick={handleSubmit}>Plan route</button>
    </div>
  )
}

export default PlannedStatus
