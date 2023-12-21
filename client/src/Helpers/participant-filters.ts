import { Role } from 'src/custom-types'
import { CoreParticipant } from 'src/custom-types/participant'

/** determine if the participant force matches the supplied force */
export const matchedForceFilter = (
  participantForceId: string,
  selectedForceId: string
): boolean => (
  participantForceId === selectedForceId
)

/**
 * determine if current player role matches defined role in channel
 */
const matchedRole = (role: Role['roleId'], selectedRole: string): boolean => (
  role === selectedRole
)

// Finds the first participant in the given array of channel participants
export const findParticipatingForce = (channelParts: CoreParticipant[], selectedForce: string): CoreParticipant | undefined => {
  return channelParts && channelParts.find((p: CoreParticipant) => matchedForceFilter(p.forceUniqid, selectedForce))
}

// Filters the array of channel participants based on selectedForce and selectedRole
export const filterParticipatingRoles = (channelParts: CoreParticipant[], selectedForce: string, selectedRole: Role['roleId']): CoreParticipant[] => {
  return channelParts.filter(p => matchedForceAndRoleFilter(p, selectedForce, selectedRole))
}

/** check if the current player role is named for the channel, or if no roles are named */
export const matchedForceAndRoleFilter = (participant: CoreParticipant, selectedForce: string | undefined, selectedRole: Role['roleId']): boolean => (
  selectedForce !== undefined &&
  matchedForceFilter(participant.forceUniqid, selectedForce) &&
  (participant.roles.length === 0 || participant.roles.some(role => matchedRole(role, selectedRole)))
)

/** check if the current player role is named for the channel, or if no roles are named */
export const matchedV3ForceAndRoleFilter = (participant: CoreParticipant, selectedForce: string | undefined, selectedRole: Role['roleId']): boolean => (
  selectedForce !== undefined &&
  matchedForceFilter(participant.forceUniqid, selectedForce) &&
  (participant.roles.length === 0 || participant.roles.some(role => matchedRole(role, selectedRole)))
)

/**
 * check if the current player's force is present in the channel,
 * but no specific roles are identified, so they all are
 */
export const matchedAllRolesFilter = (participant: CoreParticipant, selectedForce: string): boolean => (
  matchedForceFilter(participant.forceUniqid, selectedForce) && participant.roles.length === 0
)

/**
 * check if the current player's force is present in the channel,
 * but no specific roles are identified, so they all are
 */
export const matchedV3AllRolesFilter = (participant: CoreParticipant, selectedForce: string): boolean => (
  matchedForceFilter(participant.forceUniqid, selectedForce) && participant.roles.length === 0
)
