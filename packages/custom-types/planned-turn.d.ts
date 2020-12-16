import PlannedTurnStatus from './planned-turn-status'

interface PlannedTurn {
  /** when this turn happened */
  turn: number,
  /** the steps followed during the turn */
  route?: Array<String>,
  /** the status during the turn */
  status: PlannedTurnStatus
}

export default PlannedTurn
