import { RouteStore, Route, RouteStep } from '@serge/custom-types'
import { cloneDeep } from 'lodash'

/** add the step to this route
 * @param {RouteStore} store wargame data object
 * @param {string} selectedId uniqid route to be extended
 * @param {Array<RouteStep>} steps new step to store
 * @returns {RouteStore} updated route store
 */
const routeAddSteps = (store: RouteStore, selectedId: string, steps: Array<RouteStep>): RouteStore => {
  // take deep copy
  const modified: RouteStore = cloneDeep(store)
  // find the matching route
  const route: Route | undefined = modified.routes.find((route: Route) => route.uniqid === selectedId)
  if (route) {
    // ok, add the planned step
    route.planned = route.planned.concat(steps)
  }
  return modified
}

export default routeAddSteps