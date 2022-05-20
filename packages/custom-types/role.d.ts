export default interface Role {
  readonly roleId: string,
  name: string,
  /**
   * If this role is `Game Control` - a role which cannot be deleted
   */
  isGameControl: boolean,
  /**
   * whether this role can monitor all channels (umpire force only)
   */
  isObserver: boolean,
  /**
   * whether this role can view user insights/feedback (umpire force only)
   */
  isInsightViewer: boolean,
  /**
   * whether this role can submit plans from the Mapping component
   * @deprecated now that we have per role permissions in mapping channel
   */
  canSubmitPlans?: boolean
  /** 
   * whether this role can manage (release) RFIs 
   */
  isRFIManager?: boolean
}
