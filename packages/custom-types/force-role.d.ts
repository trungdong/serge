/**
 * collect force & role data, including for assigning
 * collaborative working messages to others
 */
export default interface ForceRole {
  readonly forceId: string,
  readonly forceName: string,
  readonly roleId: string,
  readonly roleName: string
}