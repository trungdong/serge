import { Participant, PlayerUi, Role } from '@serge/custom-types';

export const matchedForceFilter = (
  participant: Participant,
  selectedForceId: string
): boolean => (
  participant.forceUniqid === selectedForceId
)

/**
 * determine if current player role matches defined role in channel
 */
const matchedRole = (role: Role, selectedRole: string): boolean => (
  role.name === selectedRole
)

/** check if the current player role is named for the channel */
export const matchedForceAndRoleFilter = (
  participant: Participant,
  { selectedForce, selectedRole }: PlayerUi
): boolean => (
  selectedForce !== undefined &&
  matchedForceFilter(participant, selectedForce.uniqid) &&
  participant.roles.some(role => matchedRole(role, selectedRole))
)

/**
 *  check if the current player's force is present in the channel
 */
export const matchedAllRolesFilter = (
  participant: Participant,
  selectedForce:string
): boolean => (
  matchedForceFilter(participant, selectedForce) && participant.roles.length === 0
)
