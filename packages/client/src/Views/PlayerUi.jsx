import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getWargame,
  setForce,
  setRole,
  showHideObjectives,
  startListening,
  setAllTemplates,
  failedLoginFeedbackMessage,
  initiateGame,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";
import { addNotification } from "../ActionsAndReducers/Notification/Notification_ActionCreators";
import { getSergeGameInformation } from "../ActionsAndReducers/sergeInfo/sergeInfo_ActionCreators";
import { umpireForceTemplate, expiredStorage } from "../consts";
import { populateWargameStore } from "../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import { populateMessageTypesDb } from "../ActionsAndReducers/dbMessageTypes/messageTypes_ActionCreators";
import LoaderScreen from "../Components/LoaderScreen";
import PlayerUiLandingScreen from "./PlayerUiLandingScreen";
import PlayerUiInitiate from "./PlayerUiInitiate";
import PlayerUiLobby from "./PlayerUiLobby";
import GameChannelsWithTour from "./GameChannelsWithTour";
import { PlayerStateContext } from "../Store/PlayerUi";
import "@serge/themes/App.scss";

class PlayerUi extends Component {
  static contextType = PlayerStateContext;

  constructor(props) {
    super(props);
    this.state = {
      screen: 'landing',
      selectedWargame: '',
      wargameAccessCode: '',
      rolePassword: '',
      tourIsOpen: false,
    };

    this.props.dispatch(populateMessageTypesDb());
    this.props.dispatch(populateWargameStore());
    this.props.dispatch(getSergeGameInformation());
  };

  componentDidMount() {
    window.channelTabsContainer = window.channelTabsContainer || {};
  }

  componentDidUpdate() {
    const [ state ] = this.context;
    if(state.selectedForce && state.selectedRole) {
      const storageTourIsOpen = expiredStorage.getItem(`${state.wargameTitle}-${state.selectedForce}-${state.selectedRole}-tourDone`) !== "done";
      if (storageTourIsOpen !== this.state.tourIsOpen) {
        this.setState({
          tourIsOpen: storageTourIsOpen,
        })
      }
    }
  }

  updateSelectedWargame = (selectedWargame) => {
    const [ , dispatch ] = this.context;
    this.setState({selectedWargame});
    getWargame(selectedWargame.value)(dispatch);
  };

  goBack = () => {
    const [ , dispatch ] = this.context;
    dispatch(setForce(""));
  };

  setRolePassword = (value) => {
    this.setState({
      rolePassword: value,
    });
  };

  setRolePasswordDemo = (e, pass) => {
    e.preventDefault();
    this.setState({
      rolePassword: pass,
    });
  };

  setStorageKey = () => {
    const [ state ] = this.context;
    return {
      tourDone: `${state.wargameTitle}-${state.selectedForce}-${state.selectedRole}-tourDone`,
    }
  };

  checkPassword = (pass) => {
    const [ state, dispatch ] = this.context;
    let matchRole = (force) => force.roles.find((role) => role.password === pass);
    let force = state.allForces[_.findIndex(state.allForces, matchRole)];

    if (force === undefined) {
      this.props.dispatch(addNotification("Access code incorrect", "warning"));
      failedLoginFeedbackMessage(state.currentWargame, pass);
      return;
    }

    let role = force.roles[_.findIndex(force.roles, (role) => role.password === pass)];

    dispatch(setForce(force.uniqid));
    dispatch(setRole(role));
    dispatch(setAllTemplates(this.props.messageTypes.messages));
    startListening(state.currentWargame)(dispatch);
    this.setState({
      screen: 'player'
    })
  };

  roleOptions() {
    const [ state ] = this.context;
    return state.allForces.map((force) => ({name: force.name, roles: force.roles}));
  }

  showHideForceObjectives = () => {
    const [ , dispatch ] = this.context;
    dispatch(showHideObjectives());
  };

  enterSerge = () => {
    this.setState({
      screen: 'lobby',
    })
  };

  initiateGameplay = () => {
    const [ state, dispatch ] = this.context;
    initiateGame(state.currentWargame)(dispatch);
  };

  isUmpire() {
    const [ state ] = this.context;
    return state.selectedForce === umpireForceTemplate.uniqid && state.controlUi;
  }

  render() {
    const [ state ] = this.context;
    const { tourIsOpen, screen } = this.state;
    const { gameInfo, wargameList } = this.props;
    const render = {
      landing: <PlayerUiLandingScreen gameInfo={gameInfo} enterSerge={this.enterSerge} />,
      lobby: <PlayerUiLobby wargameList={wargameList} checkPassword={this.checkPassword} />,
      player: () => {
        if( state.wargameInitiated ) {
          return <GameChannelsWithTour storageKey={this.setStorageKey().tourDone} tourIsOpen={tourIsOpen} />
        }
        return this.isUmpire() ? <PlayerUiInitiate initiateGameplay={this.initiateGameplay} /> : <LoaderScreen />;
      }
    }

    return render[screen];
  }
}

const mapStateToProps = ({ wargame, messageTypes, gameInfo }) => ({
  wargame,
  messageTypes,
  gameInfo,
});

export default connect(mapStateToProps)(PlayerUi);
