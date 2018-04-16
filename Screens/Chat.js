
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
KeyboardAvoidingView,
TouchableOpacity } from 'react-native';
import { Container, Header, Button, List, ListItem, Body, Text, Left,Right, Icon, Title, Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Expo from 'expo';
import GenerateQR from '../Components/GenerateQR';
import CryptoJS from 'crypto-js';

export default class Chat extends Component {

constructor() {
  super()
  this.state = {
    isReady: false,
    typing: "",
    messageData: [],
    user: 1,
    roomID: "1",
    otherUser: "Bob",
    hash: '',
  }
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
    otherUser: this.props.navigation.state.params.title,
    roomID: this.props.navigation.state.params.title,
    hash: this.props.navigation.state.params.hash,
  })
  const url = 'http://83.227.100.223:8080/messages/'+this.props.navigation.state.params.title+'/2018-04-12T13:28:24.000Z'
  fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {

    this.setState({
      messageData: responseJson
    })
  })
  .catch((error) => {
    console.log(error)
  })

}

selectAvatar(sender) {

  const userIcon = require('../chameleon.png');
  const otherUserIcon = require('../chameleon2.jpg');

       if (sender == this.state.user) {
           return userIcon;
       } else {
           return otherUserIcon;
       }
   }

getLastMsg() {

  const url = 'http://83.227.100.223:8080/messages/'+this.state.roomID+'/2018-04-10T13:28:24.000Z'
  fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {
      this.setState({
        messageData: responseJson
        })
  })
  .catch((error) => {
    console.log(error)
  })

}
decryptMessage(m){
  var decrypted  = CryptoJS.AES.decrypt( m, this.state.hash);
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

async sendMessage() {

  let sender = this.state.user;
  let msg = CryptoJS.AES.encrypt(this.state.typing, this.state.hash);
  let room = this.state.roomID;


  const url = 'http://83.227.100.223:8080/submit/'+room+'/'+msg+'/'+sender+'/';


    fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
      })

    this.getLastMsg();
    this.setState({
       typing: '',
    });
}

render() {
  if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

return (

  <View style={styles.container}>

    <ScrollView
      ref={ref => this.scrollView = ref}
      onContentSizeChange={(contentWidth, contentHeight)=>{
        this.scrollView.scrollToEnd({animated: true});
      }}
    >
        <View style={styles.qr}>
          <GenerateQR value={this.state.hash}/>
        </View>

        <List>
          <FlatList
            data={this.state.messageData}
            renderItem={({ item }) => (
              <ListItem avatar style={styles.row}>
                <Left>
                  <Thumbnail style= {styles.avatar} source={this.selectAvatar(item.sentby)} />
                </Left>
                <Body style={styles.text}>
                  <Text note style={styles.message}>{ this.decryptMessage(item.message) }</Text>
                </Body>
                <Right style = {styles.idontknow}>
                  <Text note style={styles.timestamp}>14.35</Text>
                </Right>
              </ListItem>
            )}
            keyExtractor={(item, index) => index}
          />
        </List>
    </ScrollView>

    <KeyboardAvoidingView behavior="padding">
      <View style={styles.footer}>

        <TextInput
          value={this.state.typing}
          onChangeText={text => this.setState({typing: text})}
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Type something secret.."
        />

        <TouchableOpacity onPress={this.sendMessage.bind(this)}>
          <Text style={styles.send}>Send</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>

  </View>

)
}
}

const styles = StyleSheet.create({
container: {
backgroundColor: '#102027',
flexDirection : 'column',
flex : 1

},
header: {
    marginTop: 10,
    backgroundColor: 'lightseagreen',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
  },
row: {
margin: 7,
borderBottomColor:'#102027',
backgroundColor: '#102027',
},
text:{
  borderBottomColor: '#102027',
},
message: {
color: 'white',
  backgroundColor: '#132b30',
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

  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 18,
    flex: 1,
  },
  contentContainer: {
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
    borderBottomColor: '#102027',
  },
  idontknow: {
    borderBottomColor: '#102027',
  },
  qr: {
    alignItems: 'center',
    marginTop: 20,
  }

});
