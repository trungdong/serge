import { ChannelData } from "@serge/custom-types"
import { SpecialChannelTypes } from "../config/build"

const GameChannels: ChannelData[] = [
  {
    name: "Channel 16",
    participants: [
      { force: "White", forceUniqid: "umpire", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pjpfv", templates: [] },
      { force: "Red", forceUniqid: "Red", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pjsbv", templates: [] },
      { force: "Blue", forceUniqid: "Blue", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pju7l", templates: [] }],
    uniqid: "channel-k63pjit0"
  },
  {
    name: "Blue Net",
    participants: [
      { force: "White", forceUniqid: "umpire", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pk0d3", templates: [] },
      { force: "Blue", forceUniqid: "Blue", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pk2o6", templates: [] }],
    uniqid: "channel-k63pjvpb"
  },
  {
    name: "Mapping",
    participants: [
      { force: "White", forceUniqid: "umpire", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k53tifeo", templates: [] },
      { force: "Blue", forceUniqid: "Blue", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k53tij98", templates: [] },
      { force: "Red", forceUniqid: "Red", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k53tiqdf", templates: [] },
      { force: "Green", forceUniqid: "Green", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k53tivj5", templates: [] }],
    uniqid: "channel-k53ti36p"
  },
  {
    name: "Blue RFI",
    format: SpecialChannelTypes.CHANNEL_COLLAB_RESPONSE,
    collabOptions: {
      mode: 'response',
      returnVerbs: [],
      startWithReview : false,
      originatorsSeeChanges: true,
      extraColumns: []
    },
    participants: [
      { force: "White", canCollaborate: true, canReleaseMessages: true, forceUniqid: "umpire", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pk0d3", templates: [] },
      { force: "Blue", canCollaborate: false, canReleaseMessages: false, forceUniqid: "Blue", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pk2o6", templates: [
        {
          title: 'RFI',
          _id: 'k16eedkj'
        }
      ] 
    },       
    { force: "Blue", canCollaborate: false, canReleaseMessages: false, forceUniqid: "Blue", icon: "default_img/umpireDefault.png", roles: [ {
      "canSubmitPlans": true,
      "isGameControl": true,
      "isInsightViewer": true,
      "isObserver": true,
      "isRFIManager": false,
      "name": "CO",
      "password": "pkoiqu5ev"
  }], subscriptionId: "kwepk2o6", templates: [
      {
        title: 'RFI',
        _id: 'k16eedkj'
      },
      {
        title: 'Weather',
        _id: 'k16eedkh'
      }
    ] 
  }],
    uniqid: "channel-BlueRFI"
  },
  {
    name: "Blue COA",
    format: SpecialChannelTypes.CHANNEL_COLLAB_RESPONSE,
    collabOptions: {
      mode: 'edit',
      returnVerbs: ['Endorse', 'Request Changes'],
      startWithReview : true,
      originatorsSeeChanges: false,
      extraColumns: []
    },
    participants: [
      { force: "Blue", canCollaborate: true, canReleaseMessages: true, forceUniqid: "Blue", icon: "default_img/umpireDefault.png", roles: [], subscriptionId: "k63pk2o6", templates: [
        {
          title: 'COA',
          _id: 'k16eedkj'
        }
      ] 
    }],
    uniqid: "channel-BlueCOA"
  }]

export default GameChannels
