
import React, { Component } from 'react';
import {
StyleSheet,
View,
FlatList,
Image,
TextInput,
StatusBar,
ScrollView,
Platform,
Dimensions,
TouchableOpacity, } from 'react-native';
import { Container, Header, Button, List, ListItem, Body, Text, Left,Right, Icon, Title, Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Expo from 'expo';
import CryptoJS from 'crypto-js';
import QRCode from 'react-native-qrcode';
import SocketIOClient from 'socket.io-client';
import KeyboardSpacer from 'react-native-keyboard-spacer';

window.navigator.userAgent = 'react-native';

export default class Chat extends Component {

constructor(props) {
  super(props)
  this.socket = SocketIOClient('http://83.227.100.223:8080');
  this.state = {
    isReady: false,
    typing: "",
    messages: [],
    user: 1,
    roomID: props.navigation.state.params.title,
    otherUser: props.navigation.state.params.title,
    hash: '',
    title: '',
    activatedChat: false,
  }

  this.socket.emit('start', this.state.roomID);

  this.socket.on(this.state.roomID,function(data){
    this.setState({
      messages: data
    })
  }.bind(this))

  this.socket.on('newMessage_'+this.state.roomID,function(data){
  console.log(data);
  this.setState({messages: this.state.messages.concat(data)});
}.bind(this))

}

async componentWillMount() {
  await Expo.Font.loadAsync({
    'Roboto': require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
  });
  this.setState({isReady:true})
}

componentDidMount() {


  const {navigate} = this.props.navigation;
  const {params} = this.props.navigation.state;
  this.setState({
    title: this.props.navigation.state.params.name,
    roomID: this.props.navigation.state.params.title,
    hash: this.props.navigation.state.params.hash,
  })
}

selectAvatar = (sender) => {

  const userIcon = require('../chameleon.png');
  const otherUserIcon = require('../chameleon2.jpg');

       if (sender == this.state.user) {
           return userIcon;
       } else {
           return otherUserIcon;
       }
   }

decryptMessage = (m) =>{

  console.log(m);
  console.log(typeof m);
  console.log(this.state.hash);
  try {
    var decrypted  = CryptoJS.AES.decrypt( m , this.state.hash);
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (e) {
    return "Couldn't decrypt msg :(";
  }

}

async sendMessage() {

  let sender = this.state.user;
  var msg = CryptoJS.AES.encrypt(this.state.typing, this.state.hash);
  let room = this.state.roomID;
  var data = {
    sender : sender,
    msg: msg.toString(),
    room: room
  }
  this.socket.emit('chat message', data);

  this.setState({
       typing: ''
  });
}

renderQR(){
   if(this.state.activatedChat == false){
     return(   <View style={styles.qr}>
               <QRCode value={this.state.hash} size={Dimensions.get('window').width-80}/>
               </View>
             )
   }
   else return null;
}

changeTimeFormat(str)
{
  var time = str.split("T");
  var str2 = time[1].split(".");
  var timefinal = str2[0];

  return timefinal;
}

reverseData(data){
  return data.reverse();
}


render() {
  if (!this.state.isReady) {
      return <Expo.AppLoading />;
  }

  return (
    <View style={styles.container}>
      {this.renderQR()}
      <FlatList
        data={this.reverseData(this.state.messages)}
          renderItem={({ item }) => (

          <ListItem avatar style={styles.row}>
            <Left>
              <Thumbnail style= {styles.avatar} source={this.selectAvatar(item.sentby)} />
            </Left>
            <Body style={styles.text}>
              <Text note style={styles.message}>{this.decryptMessage(item.message) }</Text>
            </Body>
            <Right style = {styles.timecontainer}>

              <Text note style={styles.timestamp}>{this.changeTimeFormat(item.send_time)}</Text>
            </Right>
          </ListItem>
        )}
        keyExtractor={(item, index) => index}
        inverted
      />

        <View style={styles.footer}>
          <TextInput
            inverted
            value={this.state.typing}
            onChangeText={text => this.setState({typing: text})}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Type something secret.."
          />

          <TouchableOpacity
            onPress={this.sendMessage.bind(this)}
            style={{justifyContent: 'center', paddingRight: 10}}
          >
            <Icon
              reverse
              name='send'
              color='#517fa4'
            />
          </TouchableOpacity>
      </View>
      <KeyboardSpacer/>
    </View>

)
}
}

const styles = StyleSheet.create({
container: {
backgroundColor: 'white',
flexDirection : 'column',
flex : 1

},
row: {
margin: 7,
borderBottomColor:'white',
backgroundColor: 'white',
},
text:{
  borderBottomColor: 'white',
},
message: {
color: 'white',
  backgroundColor: '#132b30',
  borderBottomColor: 'white',
  padding:10,
  borderRadius: 10,
  overflow: 'hidden',
},
avatar: {
width: 50,
height: 50,
},
footer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    height: 50,

  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 18,
    flex: 1,
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20,
  },
  timestamp: {
    color: 'lightseagreen',
    borderBottomWidth: 0,
    borderBottomColor: 'white',
  },
  timecontainer: {
    borderBottomColor: 'white',
  },
  qr: {
    alignItems: 'center',
    marginTop: 20,
  }

});
