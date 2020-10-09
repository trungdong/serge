import React from 'react'

export default interface Props {
  adjudicationStartTime: string
  turnEndTime: string
  timeWarning: number
  currentTurn: number
  phase: string
  gameDate: string
  controlUi: boolean
  onNextTurn?: React.ReactEventHandler<any>
}