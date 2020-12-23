import { SUBMIT_PLANS } from '@serge/config'
import { MessageSubmitPlans, PlannedRoute, PlannedTurn, PlannedTurnStatus } from '@serge/custom-types'
import { Route, RouteStep } from '@serge/custom-types'

const collatePlanningOrders = (routes: Array<Route>): MessageSubmitPlans => {

  const results: Array<PlannedRoute> = routes.map((route: Route): PlannedRoute => {
      const res: PlannedTurn[] = []
      route.planned.forEach((step: RouteStep) => {
        const coords: string[] | undefined = step.coords
        const status: PlannedTurnStatus = step.status.speedKts ? {
          state: step.status.state,
          speedKts: step.status.speedKts
        } : {
          state: step.status.state
        }
        const newStep: PlannedTurn = coords !== undefined ? {        
          turn: step.turn,
          route: coords,
          status: status
        } :  {        
          turn: step.turn,
          status: status
        }
        res.push(newStep)
      })
      const plannedRoute: PlannedRoute = {
        uniqid: route.uniqid,
        plannedTurns: res
      }
      return plannedRoute
    })
  const message: MessageSubmitPlans = {
    messageType: SUBMIT_PLANS,
    plannedRoutes: results
  }
  return message

}

export default collatePlanningOrders
