import { Column } from '@material-table/core'
import { ATTRIBUTE_TYPE_ENUM, ATTRIBUTE_TYPE_NUMBER, ATTRIBUTE_TYPE_STRING, UNKNOWN_TYPE } from '@serge/config'
import { Asset, AttributeTypes, ForceData, MessagePlanning, NumberAttributeType, PerceivedTypes, PlatformTypeData, Role } from '@serge/custom-types'
import { findPerceivedAsTypes, ForceStyle, PlatformStyle, sortDictionaryByValue } from '@serge/helpers'
import { latLng } from 'leaflet'
import sortBy from 'lodash/sortBy'
import LRUCache from 'lru-cache'
import moment from 'moment'
import React from 'react'
import AssetIcon from '../../../asset-icon'
import SymbolAssetIcon from '../../../symbol-asset-icon'
import styles from '../styles.module.scss'
import { AssetRow } from '../types/props'

type SummaryData = {
  roles: Record<Role['roleId'], Role['name']>
  platformTypes: Record<PlatformStyle['uniqid'], PlatformStyle['name']>
  subTypes: string[]
  statuses: string[]
  conditions: string[]
  forces: string[]
  taskGroups: string[]
}

const storePlatformType = (pType: PlatformTypeData['uniqid'], platformStyles: PlatformStyle[],
  platformTypesDict: Record<PlatformStyle['uniqid'], PlatformStyle['name']>): void => {
  if (!platformTypesDict[pType] && platformStyles.length) {
    const thisP = platformStyles.find((plat: PlatformStyle) => plat.uniqid === pType)
    if (thisP) {
      platformTypesDict[pType] = thisP.name
    } else {
      if (pType === UNKNOWN_TYPE) {
        platformTypesDict[UNKNOWN_TYPE] = UNKNOWN_TYPE
      } else {
        console.error('Platform type not found', pType, UNKNOWN_TYPE, platformStyles)
      }
    }
  }
}

export const getOwnAssets = (forces: ForceData[], forceColors: ForceStyle[], platformIcons: PlatformStyle[], playerForce: ForceData, platformTypes: PlatformTypeData[],
  attributeTypes: AttributeTypes, gameTime: number, selectedAssets: string[]): AssetRow[] => {
  const rows: AssetRow[] = []
  forces.forEach((force: ForceData) => {
    force.assets && force.assets.forEach((asset: Asset) => {
      const assets = collateItem(false, asset, playerForce, force, forceColors, platformIcons, selectedAssets, platformTypes, attributeTypes, gameTime, undefined)
      rows.push(...assets)
    }
    )
  })
  return rows
}

export const getOppAssets = (forces: ForceData[], forceColors: ForceStyle[], platformIcons: PlatformStyle[], playerForce: ForceData, platformTypes: PlatformTypeData[],
  attributeTypes: AttributeTypes, gameTime: number, selectedAssets: string[]): AssetRow[] => {
  const rows: AssetRow[] = []
  forces.forEach((force: ForceData) => {
    // don't generate op-for for umpire
    if (!force.umpire) {
      force.assets && force.assets.forEach((asset: Asset) => {
        const assets = collateItem(true, asset, playerForce, force, forceColors, platformIcons, selectedAssets, platformTypes, attributeTypes, gameTime, undefined)
        rows.push(...assets)
      })
    }
  })
  return rows
}

export const getColumnSummary = (forces: ForceData[], playerForce: ForceData['uniqid'],
  opFor: boolean, platformStyles: PlatformStyle[]): SummaryData => {
  const roleDict: Record<Role['roleId'], Role['name']> = {}
  const platformTypesDict: Record<PlatformStyle['uniqid'], PlatformStyle['name']> = {}
  const statuses: string[] = []
  const conditions: string[] = []
  const forcesNames: string[] = []
  const taskGroups: string[] = []
  const subTypes: string[] = []
  const isUmpireForce = forces.find((force: ForceData) => force.uniqid === playerForce && force.umpire)
  forces.forEach((force: ForceData) => {
    if (opFor) {
      const visibleToThisForce = (force.visibleTo && force.visibleTo.includes(playerForce)) || force.uniqid === playerForce
      // only produce for other forces
      if (force.uniqid !== playerForce) {
        force.assets && force.assets.forEach((asset: Asset) => {
          const perception: PerceivedTypes | null = findPerceivedAsTypes(playerForce, asset.name, !!visibleToThisForce, asset.contactId, force.uniqid, asset.platformTypeId || '', asset.perceptions)
          if (perception) {
            // we can perceive this force, capture the name
            if (!forcesNames.includes(force.name)) {
              forcesNames.push(force.name)
            }
            if (perception.condition) {
              const condition = perception.condition
              if (!conditions.includes(condition)) {
                conditions.push(condition)
              }
            }
            if (perception.typeId) {
              const pType = perception.typeId
              storePlatformType(pType, platformStyles, platformTypesDict)
            }
            if (asset.attributes) {
              const subType = asset.attributes.a_Type as string
              if (!subTypes.includes(subType)) {
                subTypes.push(subType)
              }
            }
          }
        })
      }
    } else {
      // we store roles for own force, or all for an umpire
      if (isUmpireForce || (force.uniqid === playerForce)) {
        force.roles.forEach((role: Role) => { roleDict[role.roleId] = role.name })
        // capture all force names for umpire
        if (isUmpireForce && !forcesNames.includes(force.name)) {
          forcesNames.push(force.name)
        }

        force.assets && force.assets.forEach((asset: Asset) => {
          if (asset.status) {
            const state = asset.status.state
            if (!statuses.includes(state)) {
              statuses.push(state)
            }
          }
          if (asset.condition) {
            if (!conditions.includes(asset.condition)) {
              conditions.push(asset.condition)
            }
          }
          if (asset.attributes) {
            const subType = asset.attributes.a_Type as string
            if (!subTypes.includes(subType)) {
              subTypes.push(subType)
            }
            const group = asset.attributes.a_TaskGroup as string
            if (group !== undefined && group !== '' && !taskGroups.includes(group)) {
              taskGroups.push(group)
            }
          }
          storePlatformType(asset.platformTypeId, platformStyles, platformTypesDict)
        })
      }
    }
  })

  // NOTE: we're getting a localCompare exception thrown.  See if it's in this sort block
  let sortedSubTypes: string[] = []
  let sortedTaskGroups: string[] = []
  let sortedPlatforms = {}
  try {
    // sort sub-types
    sortedSubTypes = subTypes.length ? subTypes.slice().sort() : []
    sortedTaskGroups = taskGroups.length ? taskGroups.slice().sort() : []
    sortedPlatforms = sortDictionaryByValue(platformTypesDict)
  } catch (err) {
    console.log('Exception caught, data:', subTypes, taskGroups, platformTypesDict, sortedSubTypes, sortedTaskGroups, sortedPlatforms)
    console.error(err)
  }

  const res: SummaryData = {
    roles: roleDict,
    platformTypes: sortedPlatforms,
    subTypes: sortedSubTypes,
    conditions: conditions,
    statuses: statuses,
    forces: forcesNames,
    taskGroups: sortedTaskGroups
  }
  return res
}

const renderIcon = (row: AssetRow, assetsCache: LRUCache<string, string>): React.ReactElement => {
  if (!row.icon) return <></>
  const icons = row.icon.split(',')
  if (icons.length === 3) {
    return <span><AssetIcon className={styles['cell-icon']} imageSrc={icons[0]} color={icons[1]} health={+icons[3]} />{icons[2]}</span>
  }

  // test new asset icon component
  if (row.sidc) {
    // SGG*UCIN--
    return <span><SymbolAssetIcon sidc={row.sidc} health={row.health} hideName={true} force={row.force} iconName={icons[2]} assetsCache={assetsCache} />{row.name}</span>
  }
  // end

  return <span><AssetIcon className={styles['cell-icon']} imageSrc={icons[0]} health={+icons[3]} />{icons[2]} <small>({row.id})</small></span>
}

export const arrToDict = (arr: string[]): any => {
  if (arr && arr.length > 0) {
    const res = {}
    const sorted = sortBy(arr, function (name) { return name })
    sorted.forEach((item: string) => {
      res[item] = item
    })
    return res
  } else {
    return undefined
  }
}

const renderPlatformType = (row: AssetRow, platformTypes: Record<string, string>): React.ReactElement => {
  const match = row.platformType && platformTypes[row.platformType]
  if (match) {
    return <>{match}</>
  } else {
    return <></>
  }
}

export const renderOwner = (row: AssetRow, roles: Record<string, string>): React.ReactElement => {
  const match = row.owner && roles[row.owner]
  if (match) {
    return <>{match}</>
  } else {
    return <></>
  }
}

export const collateActivities = (rows: MessagePlanning[]): string[] => {
  const activities: string[] = []
  rows.forEach((row: MessagePlanning) => {
    const force = row.details.from.forceId || ''
    const activity = row.message.activity.slice(force.length + 1)
    if (!activities.includes(activity)) {
      activities.push(activity)
    }
  })
  return activities
}

export const renderAttributes = (row: AssetRow): React.ReactElement => {
  const keys = Object.keys(row.attributes)
  if (keys.length) {
    return <ul>
      {keys.map((key: string, index: number) => {
        return <li key={index}>{key}: {row.attributes[key]}</li>
      })}
    </ul>
  } else {
    return <></>
  }
}

// type ColumnType = {
//   title: string
//   field: string
//   render: any
//   lookup: any
// }

/**
 * Helper function to provide the columns for the table
 * @param opFor whether we're displaying perceived other platforms
 * @param playerForce the force of the current player
 * @returns
 */
export const getColumns = (opFor: boolean, forces: ForceData[], playerForce: ForceData['uniqid'], platformStyles: PlatformStyle[], assetsCache: LRUCache<string, string>): Column<any>[] => {
  const summaryData = getColumnSummary(forces, playerForce, opFor, platformStyles)
  const fixedColWidth = 100
  const fixedColWidth2 = 200

  const nameWidth = opFor ? fixedColWidth2 : fixedColWidth

  const ownAssets = !!(playerForce && !opFor)

  const columns: Column<any>[] = [
    { title: 'Icon', field: 'icon', render: (row: AssetRow) => renderIcon(row, assetsCache), width: nameWidth, minWidth: nameWidth },
    { title: 'Force', field: 'force', width: 'auto', hidden: ownAssets, lookup: arrToDict(summaryData.forces) },
    { title: 'Type', field: 'platformType', width: 'auto', render: (row: AssetRow): React.ReactElement => renderPlatformType(row, summaryData.platformTypes), lookup: summaryData.platformTypes },
    { title: 'SubType', type: 'string', width: 'auto', field: 'subType', hidden: !ownAssets, lookup: arrToDict(summaryData.subTypes) },
    { title: 'Domain', type: 'string', field: 'domain', width: fixedColWidth, minWidth: fixedColWidth, lookup: arrToDict(['Land', 'Maritime', 'Air']) },
    { title: 'Health', type: 'numeric', field: 'health', width: fixedColWidth, minWidth: fixedColWidth },
    { title: 'C4', type: 'string', field: 'c4', width: fixedColWidth, minWidth: fixedColWidth }
  ]

  // show attributes for own forces (or if we're umpire)
  if (ownAssets) {
    columns.push({ title: 'Task Group', field: 'taskGroup', width: 'auto', hidden: false, lookup: arrToDict(summaryData.taskGroups) })
    columns.push({ title: 'Attributes', field: 'attributes', width: 'auto', render: renderAttributes })
  } else {
    columns.push({ title: 'Age', field: 'lastUpdated', width: 'auto', type: 'string' })
  }

  return columns
}

const getModernAttributes = (asset: Asset, attributeTypes: AttributeTypes, skipThese: string[]): Record<string, unknown> => {
  const attrDict = {}
  const ids = asset.attributes || {}
  Object.keys(ids).forEach((attrId: string) => {
    if (skipThese && skipThese.includes(attrId)) {
      return
    }
    const aType = attributeTypes.find((aType) => aType.attrId === attrId)
    if (aType) {
      switch (aType.attrType) {
        case ATTRIBUTE_TYPE_NUMBER: {
          const nType = aType as NumberAttributeType
          const units = nType.units ? ' ' + nType.units : ''
          attrDict[nType.name] = ids[attrId] + units
          break
        }
        case ATTRIBUTE_TYPE_STRING: {
          // trim the field, if necessary
          let val = ids[attrId]
          if (typeof (val) === 'string') {
            const str = val as string
            if (str.length > 30) {
              val = str.substring(0, 30) + '...'
            }
          }
          attrDict[aType.name] = val
          break
        }
        case ATTRIBUTE_TYPE_ENUM: {
          attrDict[aType.name] = ids[attrId]
          break
        }
        default: {
          console.warn('Haven\'t handled attribute', attrId)
        }
      }
    } else {
      // just shoe-horn the value in
      const name = attrId
      const prefix = name.indexOf('a_')
      if (prefix === 0) {
        const name2 = name.substring('a_'.length)
        const name3 = name2.replace('_', ' ')
        // yes, it's an attribute
        attrDict[name3] = ids[attrId]
      }
    }
  })
  return attrDict
}

/** helper function, so we can apply to assets and child assets
 *
 * @param opFor if we're providing a list of opFor assets
 * @param asset the asset to process (including children)
 * @param playerForce the force for the current player (or undefined to see all assets)
 * @param assetForce the force for the asset
 * @param parentId the (optional) parent for this asset
 * @returns a list of rows, representing the asset and it's children
 */
export const collateItem = (opFor: boolean, asset: Asset, playerForce: ForceData, assetForce: ForceData,
  forceColors: ForceStyle[], platformIcons: PlatformStyle[], selectedAssets: string[],
  platformTypes: PlatformTypeData[], attributeTypes: AttributeTypes, gameTime: number, parentId?: string): AssetRow[] => {
  const itemRows: AssetRow[] = []
  const iconFor = (platformType: string): string => {
    const pType = platformIcons.find((value: PlatformStyle) => value.uniqid === platformType)
    return (platformType === UNKNOWN_TYPE) ? 'unknown.svg' : (pType && pType.icon) || ''
  }
  const colorFor = (forceId: string): string => {
    const colorMatch = forceColors.find((value: ForceStyle) => value.forceId === forceId)
    return (forceId === UNKNOWN_TYPE) ? '#999' : (colorMatch && colorMatch.color) || ''
  }

  const isUmpire = playerForce.umpire
  const platformType = platformTypes && platformTypes.find((plat) => plat.uniqid === asset.platformTypeId)

  const nationsWithGodsEyeView = ['f-blue', 'f-green']
  const hasGodsEyeView = nationsWithGodsEyeView.includes(playerForce.uniqid.toLowerCase())

  const domainFor = (travelMode?: string): string => {
    if (travelMode) {
      switch (travelMode) {
        case 'sea':
          return 'Maritime'
        case 'air':
          return 'Air'
        case 'land':
          return 'Land'
        default:
          console.warn('Unexpected travel mode encountered:', travelMode)
          return 'ERR'
      }
    }
    return 'Unk'
  }
  const domain = platformType ? domainFor(platformType.travelMode) : 'Unk'
  const subType = asset.attributes ? asset.attributes.a_Type as string : 'n/a'
  // we don't show some attributes, since they are shown in other columns
  const attributesToSkip = ['a_Type', 'a_C4_Status', 'a_TaskGroup', 'a_SIDC']
  if (opFor && !isUmpire) {
    // all assets of this force may be visible to player, or player
    // may be from umpire force (so no player force shown)
    if (assetForce.uniqid !== playerForce.uniqid) {
      const visibleToThisForce = !!(assetForce.visibleTo && assetForce.visibleTo.includes(playerForce.uniqid))
      const perceptionTypes = findPerceivedAsTypes(playerForce.uniqid, asset.name, visibleToThisForce, asset.contactId, assetForce.uniqid, asset.platformTypeId || '', asset.perceptions)
      const perception = asset.perceptions.find((perc) => perc.by === playerForce.uniqid)
      // as a performance measure, we don't create attributes for OpFor assets
      // const modernAttrDict = platformType ? getModernAttributes(asset, attributeTypes, attributesToSkip) : {}
      const modernAttrDict = {} // platformType ? getModernAttributes(asset, attributeTypes, attributesToSkip) : {}
      const health = hasGodsEyeView ? asset.health : (perception && (perception.health !== undefined)) ? perception.health : undefined
      const c4 = hasGodsEyeView ? ((asset.attributes && asset.attributes.a_C4_Status as string) || 'Unk') : 'Unk'
      if ((perceptionTypes && perception) || hasGodsEyeView) {
        const lastUpdate = perception && perception.lastUpdate
        let updatePeriod
        if (lastUpdate) {
          const tNow = moment.utc(gameTime)
          const tThen = moment.utc(lastUpdate)
          const diff = moment.duration(tNow.diff(tThen))
          updatePeriod = diff.humanize()
        } else {
          updatePeriod = 'unk'
        }
        const forceStyle = perceptionTypes ? forceColors.find((value: ForceStyle) => value.forceId === perceptionTypes.forceId) : ''
        const position = hasGodsEyeView ?  (asset.location && latLng(asset.location[0], asset.location[1])) : (perception && perception.position && latLng(perception.position[0], perception.position[1]))

        const res: AssetRow = {
          id: asset.uniqid,
          icon: hasGodsEyeView ? iconFor(asset.platformTypeId) + ',' + assetForce.color + ',' + asset.name + ',' + health : perceptionTypes ? iconFor(perceptionTypes.typeId) + ',' + colorFor(perceptionTypes.forceId) + ',' + perceptionTypes.name + ',' + health : '',
          force: hasGodsEyeView ? assetForce.name : forceStyle ? forceStyle.force : UNKNOWN_TYPE,
          name: hasGodsEyeView ? asset.name : perceptionTypes ? perceptionTypes.name : '',
          platformType: hasGodsEyeView ? asset.platformTypeId : perceptionTypes ? perceptionTypes.typeId : '',
          subType: subType,
          position: position ,
          tableData: { checked: selectedAssets.includes(asset.uniqid) },
          health: health,
          c4: c4,
          domain: domain,
          attributes: modernAttrDict,
          taskGroup: '',
          lastUpdated: updatePeriod
        }

        if (asset.attributes && asset.attributes.a_SIDC) {
          res.sidc = asset.attributes.a_SIDC as string
        } else {
          const perceivedPlatformType = perception && perception.typeId && platformTypes.find((pType: PlatformTypeData) => pType.uniqid === perception.typeId)
          if (perceivedPlatformType && perceivedPlatformType.sidc) {
            res.sidc = perceivedPlatformType.sidc
          } else if (platformType && platformType.sidc) {
            res.sidc = platformType.sidc
          }
        }

        itemRows.push(res)
      }
    }
  } else {
    const visibleToThisForce = !!(assetForce.visibleTo && assetForce.visibleTo.includes(playerForce.uniqid))
    const myForce = assetForce.uniqid === playerForce.uniqid
    const umpireInOwnFor = (isUmpire && !opFor)
    const modernAttrDict = platformType ? getModernAttributes(asset, attributeTypes, attributesToSkip) : {}
    const health = asset.health === 0 ? 0 : (asset.health || 100)
    const c4 = asset.attributes ? asset.attributes.a_C4_Status : 'Unk'
    const tg = asset.attributes ? asset.attributes.a_TaskGroup as string : ''
    if (umpireInOwnFor || myForce || visibleToThisForce) {
      const res: AssetRow = {
        id: asset.uniqid,
        icon: iconFor(asset.platformTypeId) + ',' + assetForce.color + ',' + asset.name + ',' + health,
        force: assetForce.name,
        name: asset.name,
        platformType: asset.platformTypeId || '',
        subType: subType,
        owner: asset.owner ? asset.owner : '',
        position: asset.location && latLng(asset.location[0], asset.location[1]),
        tableData: { checked: selectedAssets.includes(asset.uniqid) },
        health: health,
        c4: '' + c4,
        domain: domain,
        attributes: modernAttrDict,
        taskGroup: tg,
        lastUpdated: ''
      }

      // check if we have an SIDC for this asset
      if (asset.attributes && asset.attributes.a_SIDC) {
        res.sidc = asset.attributes.a_SIDC as string
      } else {
        if (platformType && platformType.sidc) {
          res.sidc = platformType.sidc
        }
      }

      // if we're handling the child of an asset, we need to specify the parent
      if (parentId) {
        res.parentId = parentId
      }
      itemRows.push(res)
    }
  }

  // also sort out the comprising entries
  if (asset.comprising) {
    asset.comprising.forEach((asset2: Asset) => {
      itemRows.push(...collateItem(opFor, asset2, playerForce, assetForce, forceColors, platformIcons, selectedAssets, platformTypes, attributeTypes, gameTime, asset.uniqid))
    })
  }
  return itemRows
}
