/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text, PermissionsAndroid, Button, Platform} from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

import {OTSession, OTPublisher, OTSubscriber, OT} from 'opentok-react-native';
import RNCallKeep from 'react-native-callkeep';
// import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';

import uuid from 'uuid';
import PrimartButton from './PrimaryButton';

const SERVER_BASE_URL = 'https://xyzopentokpoc.herokuapp.com';

// const options = {
//   ios: {
//     appName: 'My app name',
//   },
//   android: {
//     alertTitle: 'Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'ok',
//     imageName: 'phone_account_icon',
//     additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
//   },
// };

const getNewUuid = () => uuid.v4().toLowerCase();

const format = pUUid => pUUid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

const isIOS = Platform.OS === 'ios';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSessionConnected: false,
      callUser: false,
      receiveCall: false,
      apiKey: null,
      sessionId: null,
      token: null,
      isConnected: false,
      signal: {
        data: '',
        type: '',
      },
      text: '',
      messages: [],
      calls: {},
      heldCalls: {},
      mutedCalls: {},
    };
    // this.initialize();
    // RNCallKeep.setup({
    //   ios: {
    //     appName: 'CallKeepDemo',
    //   },
    //   android: {
    //     alertTitle: 'Permissions required',
    //     alertDescription: 'This application needs to access your phone accounts',
    //     cancelButton: 'Cancel',
    //     okButton: 'ok',
    //   },
    // });

    // RNCallKeep.setAvailable(true);
    // Added by Martin

    this.connectedClientId = [];
    OT.enableLogs(true);
    this.otSessionRef = React.createRef();
    this.sessionEventHandlers = {
      streamCreated: event => {
        console.log('Stream created!', event);
      },
      streamDestroyed: event => {
        console.log('Stream destroyed!', event);
      },
      sessionConnected: event => {
        console.log('session connected', event);
        this.setState({
          isConnected: true,
        });
        // this.connectedClientId.push(event.connectionId);

        // this.initialize();
      },
      signal: event => {
        // this.playSound();
        console.log('Signal Received', event);
        // this.displayIncomingCallNow();
        this.handleSignal(event);
      },
      connectionCreated: event => {
        console.log('another client connected connection crated', event);
        this.connectedClientId.push(event.connectionId);
        console.log(
          'another client connected connection crated - this.connectedClientId',
          this.connectedClientId,
        );
        alert('Client connected');
      },
      connectionDestroyed: event => {
        console.log('another client disconnected connection destroyed', event);
      },
    };

    this.sessionOptions = {
      connectionEventsSuppressed: true, // default is false
      // androidZOrder: '', // Android only - valid options are 'mediaOverlay' or 'onTop'
      // androidOnTop: '', // Android only - valid options are 'publisher' or 'subscriber'
      useTextureViews: true, // Android only - default is false
      isCamera2Capable: false, // Android only - default is false
      ipWhitelist: false, // https://tokbox.com/developer/sdks/js/reference/OT.html#initSession - ipWhitelist
    };

    this.publisherProperties = {
      publishAudio: true,
      publishVideo: false,
      cameraPosition: 'front',
    };

    this.subscriberProperties = {
      subscribeToAudio: true,
      subscribeToVideo: false,
      cameraPosition: 'front',
    };
  }

  handleSignal = event => {
    console.log('Handle received signals.....', event);
    if (event.type === 'Calling') {
      // this.sendReceiveSignal(event.connectionId);
      this.displayIncomingCallNow();
    } else if (event.type === 'CallAccepted') {
      this.didReceiveStartCallAction({handle: event.data});
    }
  };

  componentDidMount() {
    // fetch(SERVER_BASE_URL + '/session')
    //   .then(function(res) {
    //     return res.json();
    //   })
    //   .then(res => {
    //     console.log('res .....', res);
    //     const apiKey = res.apiKey;
    //     const sessionId = res.sessionId;
    //     const token = res.token;
    //     this.setState({apiKey, sessionId, token});
    //   })
    //   .catch(() => {});

    RNCallKeep.setAvailable(true);
    RNCallKeep.addEventListener('answerCall', this.answerCall);
    RNCallKeep.addEventListener(
      'didPerformDTMFAction',
      this.didPerformDTMFAction,
    );
    RNCallKeep.addEventListener(
      'didReceiveStartCallAction',
      this.didReceiveStartCallAction,
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      this.didPerformSetMutedCallAction,
    );
    RNCallKeep.addEventListener(
      'didToggleHoldCallAction',
      this.didToggleHoldCallAction,
    );
    RNCallKeep.addEventListener('endCall', this.endCall);

    // RNCallKeep.addEventListener('connectionCreated', this.endCall);
  }
  initialize = async () => {
    await RNCallKeep.setup(
      {
        ios: {
          appName: 'OpenTokPoc',
        },
        android: {
          alertTitle: 'Permissions required',
          alertDescription:
            'This application needs to access your phone accounts',
          cancelButton: 'Cancel',
          okButton: 'ok',
        },
      },
      () => {},
    );
  };

  log = text => {
    console.info(text);
    const logText = this.state.logText;
    this.setState({logText: logText + '\n' + text});
  };

  addCall = (callUUID, number) => {
    const calls = {...this.state.calls};
    const heldCalls = this.state.heldCalls;
    heldCalls[callUUID] = false;
    this.setState({heldCalls});
    calls[callUUID] = number;
    this.setState({calls});

    console.log('addedcalls ...', calls);
  };

  removeCall = callUUID => {
    const {[callUUID]: _, ...updated} = this.state.calls;
    const {[callUUID]: __, ...updatedHeldCalls} = this.state.heldCalls;
    this.setState(updated);
    this.setState(updatedHeldCalls);
    RNCallKeep.endAllCalls();
  };

  setCallHeld = (callUUID, held) => {
    const heldCalls = this.state.heldCalls;
    heldCalls[callUUID] = held;
    this.setState({heldCalls});
    // this.setState({...this.state.heldCalls, [callUUID]: held});
  };

  setCallMuted = (callUUID, muted) => {
    const mutedCalls = this.state.mutedCalls;
    mutedCalls[callUUID] = muted;
    this.setState({mutedCalls});
    // this.setState({...this.state.mutedCalls, [callUUID]: muted});
  };

  displayIncomingCall = number => {
    console.log('displayIncomingCall ....');
    const callUUID = getNewUuid();
    this.addCall(callUUID, number);

    this.log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
  };

  displayIncomingCallNow = () => {
    console.log('displayIncomingCallNow ....');
    this.displayIncomingCall(getRandomNumber());

    // this.sendReceiveSignal();
  };

  displayIncomingCallDelayed = () => {
    BackgroundTimer.setTimeout(() => {
      this.displayIncomingCall(getRandomNumber());
    }, 3000);
  };

  answerCall = ({callUUID}) => {
    console.log('Call answered ....', callUUID);
    console.log('answercall .... .calls', this.state.calls);
    const number = this.state.calls[callUUID];
    this.log(`[answerCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.startCall(callUUID, number, number);
    this.sendReceiveSignal();

    BackgroundTimer.setTimeout(() => {
      this.log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  didPerformDTMFAction = ({callUUID, digits}) => {
    const number = this.state.calls[callUUID];
    this.log(
      `[didPerformDTMFAction] ${format(
        callUUID,
      )}, number: ${number} (${digits})`,
    );
  };

  didReceiveStartCallAction = ({handle}) => {
    if (!handle) {
      // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
      return;
    }
    console.log('calling ...... didReceiveStartCallAction', handle);
    const callUUID = getNewUuid();
    this.addCall(callUUID, handle);

    this.log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

    RNCallKeep.startCall(callUUID, handle, handle);

    BackgroundTimer.setTimeout(() => {
      this.log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  didPerformSetMutedCallAction = ({muted, callUUID}) => {
    const number = this.state.calls[callUUID];
    this.log(
      `[didPerformSetMutedCallAction] ${format(
        callUUID,
      )}, number: ${number} (${muted})`,
    );

    this.setCallMuted(callUUID, muted);
  };

  didToggleHoldCallAction = ({hold, callUUID}) => {
    const number = this.state.calls[callUUID];
    this.log(
      `[didToggleHoldCallAction] ${format(
        callUUID,
      )}, number: ${number} (${hold})`,
    );

    this.setCallHeld(callUUID, hold);
  };

  endCall = ({callUUID}) => {
    console.log('call ended......', callUUID);
    const handle = this.state.calls[callUUID];
    this.log(`[endCall] ${format(callUUID)}, number: ${handle}`);

    this.removeCall(callUUID);
  };

  hangup = callUUID => {
    console.log('call hangup ....');
    RNCallKeep.endCall(callUUID);
    this.removeCall(callUUID);
  };

  setOnHold = (callUUID, held) => {
    const handle = this.state.calls[callUUID];
    RNCallKeep.setOnHold(callUUID, held);
    this.log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

    this.setCallHeld(callUUID, held);
  };

  setOnMute = (callUUID, muted) => {
    const handle = this.state.calls[callUUID];
    RNCallKeep.setMutedCall(callUUID, muted);
    this.log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

    this.setCallMuted(callUUID, muted);
  };

  updateDisplay = callUUID => {
    const number = this.state.calls[callUUID];
    // Workaround because Android doesn't display well displayName, se we have to switch ...
    if (isIOS) {
      RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    } else {
      RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    }

    this.log(`[updateDisplay: ${number}] ${format(callUUID)}`);
  };

  sendSignal = () => {
    console.log('send signal ...');
    const {isConnected} = this.state;
    if (isConnected) {
      this.otSessionRef.current.signal(
        {
          data: 'Chezhian',
          to: this.connectedClientId[0], // optional - connectionId of connected client you want to send the signal to
          type: 'Calling', // optional
        },
        error => {
          console.log('error in send signal', error);
        },
      );
      console.log('send signal and show incoming call UI ...');
    }
  };

  sendCallSignal = () => {
    try {
      const {isConnected} = this.state;
      if (isConnected) {
        console.log('send signal ....', this.connectedClientId);
        if (this.connectedClientId.length > 0) {
          alert(`send signal to ${this.connectedClientId[0]}`);
          this.otSessionRef.current.signal(
            {
              data: 'Chezhian',
              to: this.connectedClientId[0], // optional - connectionId of connected client you want to send the signal to
              type: 'Calling', // optional - callout
            },
            error => {
              console.log('signal sent', error);
              throw {};
            },
          );
          console.log('send signal and show outgoing call UI ...');
          // RNCallKeep.startCall(getRandomNumber(), '9585058087', 'Chezhian');
        } else {
          alert('Unable to send signal. No user connected');
        }
      } else {
        alert('Unable to send signal. Session not connected');
      }
    } catch (e) {
      alert('Can not estabilsh call - send signal');
    }
  };

  sendReceiveSignal = connectionId => {
    try {
      console.log('send signal ...', this.connectedClientId[0]);
      const {isConnected} = this.state;
      if (isConnected) {
        if (this.connectedClientId.length > 0) {
          this.otSessionRef.current.signal(
            {
              data: 'Chezhian',
              to: '', //this.connectedClientId[0], // optional - connectionId of connected client you want to send the signal to
              type: 'CallAccepted', // optional - callout
            },
            error => {
              console.log('signal sent', error);
              throw {};
            },
          );
          console.log('send signal and startCall ...');
          // RNCallKeep.startCall(getRandomNumber(), '9585058087', 'Chezhian');
        } else {
          alert('Unable to send receive call signal. No user connected');
        }
      } else {
        alert('Unable to send receive call signal. Session not connected');
      }
    } catch (e) {
      alert('Can not estabilsh call - send signal');
    }
  };

  // _keyExtractor = (item, index) => index;
  // _renderItem = ({item}) => <Text style={styles.item}>{item.data}</Text>;

  onConnect = () => {
    console.log('connect to session');
    fetch(SERVER_BASE_URL + '/session')
      .then(function(res) {
        return res.json();
      })
      .then(res => {
        console.log('res .....', res);
        const apiKey = res.apiKey;
        const sessionId = res.sessionId;
        const token = res.token;
        this.setState(
          {apiKey, sessionId, token, isSessionConnected: true},
          ()=>this.initialize(),
        );
        alert('Connected successfully.');
        // this.initialize();
      })
      .catch(() => {
        alert('Connection failsed. Pls try again.');
      });
  };

  onCall = () => {
    this.sendCallSignal();
    console.log('Calling....');
  };

  render() {
    console.log('this.state ....', this.state);
    return (
      <View
        style={{
          flex: 1,
          // flexDirection: 'col',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 50,
        }}>
        {this.state.isSessionConnected && (
          <OTSession
            apiKey={this.state.apiKey}
            sessionId={this.state.sessionId}
            token={this.state.token}
            eventHandlers={this.sessionEventHandlers}
            ref={this.otSessionRef}
            options={this.sessionOptions}
            subscribeToAudio={true}
            subscribeToVideo={false}
            videoSource={null}
            publishAudio={true}
            publishVideo={false}
            videoxxTrack={false}
            audioTrack={true}>
            {this.state.callUser && (
              <OTPublisher
                style={{
                  width: 300,
                  height: 300,
                  borderWidth: 1,
                  borderColor: 'blue',
                }}
                properties={this.publisherProperties}
              />
            )}
            {this.state.receiveCall && (
              <OTSubscriber
                style={{
                  width: 300,
                  height: 300,
                  borderWidth: 1,
                  borderColor: 'red',
                }}
                properties={this.subscriberProperties}
              />
            )}
          </OTSession>
        )}
        <PrimartButton
          onSubmit={this.onConnect}
          btnName={'Connect'}
          btnStyle={{width: 200, margin: 20}}
        />
        <PrimartButton
          onSubmit={this.onCall}
          btnName={'Call'}
          btnStyle={{width: 200, margin: 20}}
        />
        {/* {isIOS && DeviceInfo.isEmulator() && (
          <Text
            style={{
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            CallKeep doesn't work on iOS emulator
          </Text>
        )} */}
      </View>
    );
  }
}

export default App;
