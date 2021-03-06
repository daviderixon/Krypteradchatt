import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  Alert
  } from 'react-native';

import StatusBarComponent from '../Components/StatusBarComponent';
import { Item, Input, Header, Button, List, ListItem, Body, Text, Left,Right, Icon, Title, Thumbnail } from 'native-base';
import Toast from 'react-native-simple-toast';
import TintedImage from '../Components/TintedImage';
import { ColorPicker, toHsv } from 'react-native-color-picker'


export default class Profile extends Component {

  constructor(props){
  	  super(props)
	  this.state={
	  	  name:'',
	  	  ChamColor:'',
	  	  layout: true,
	  	  color: toHsv('green')
	  }
  }
  async componentDidMount() {
    let profile = await AsyncStorage.getItem('profile');
    let d = JSON.parse(profile);
    this.setState({
      ChamColor : d.ChamColor,
      name : d.name,
    })

  }
  displayData = async() => {
	try{
  	  let profile = await AsyncStorage.getItem('profile');
	  let d = JSON.parse(profile);
	  Alert.alert('Personal information', 'Name: ' + d.name + '\n' + 'Favourite Color: ' + d.ChamColor);
	 }
	 catch(error){
	 	 Alert.alert('Error','There was an error while loading the data');
	 }
  }

  saveData =()=> {
    Toast.show('Saved changes!');
    const {name,ChamColor} = this.state;

	let profile={
		name: name,
		ChamColor: ChamColor
	}
	AsyncStorage.setItem('profile',
	JSON.stringify(profile));
  this.displayData();
  }

  changeLayout = () => {
  	this.setState({
  		layout: !(this.state.layout)
  	})

  }





  render() {
  	if(this.state.layout){
    return (
      <View style={styles.container}>
				<View style={styles.profileMenu}>
        <TintedImage size={200} color={this.state.ChamColor} backgroundColor='#ffffff' />
        <TouchableOpacity style={styles.LayoutButton} onPress={this.changeLayout}>
          <Text style={styles.buttontext}> Redigera avatar </Text>
        </TouchableOpacity>

          <Item style={styles.inputHolder}>
              <Icon active name='ios-person' style={{color: '#fff'}}/>
              <Input style={styles.inputText}
                placeholder='Användarnamn'
                onChangeText={name => this.setState({name})}
              />
          </Item>
					<View style={styles.ButtonHolder}>
						<View>
							<TouchableOpacity style={styles.Button} onPress={this.saveData}>
								<Text style={styles.buttontext}> Spara </Text>
							</TouchableOpacity>
						</View>

					</View>

				</View>
      </View>

    );
  	}
  	else{
  		return(
			<View style={styles.container}>
        <View style={styles.profileMenu}>
					<TintedImage color={this.state.ChamColor} backgroundColor='#ffffff' size={200}  />
					<TouchableOpacity style={styles.LayoutButton} onPress={this.changeLayout}>
							<Text style={styles.buttontext}> Back to profile </Text>
					</TouchableOpacity>
					<View style={{padding: 15, backgroundColor: '#00000000',height:230,bottom:0,width:420}}>
					    <ColorPicker
					      ChamColor={this.state.ChamColor}
					      onColorChange={ChamColor => this.setState({ ChamColor })}
					      onColorSelected={ChamColor => this.setState({ ChamColor })}
					      style={{flex:1, height:300}}
					      hideSliders={true}
					    />
					</View>
          </View>
			</View>
  		);
  	}
  }


}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#cecece',
		flexDirection : 'column',
		flex : 1,

	},
	containerColor: {
		backgroundColor: '#102027',
		flexDirection : 'column',
		flex : 1,
		alignItems: 'center',

	},
	scannerButtonHolder: {
		backgroundColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	profileMenu:  {
		backgroundColor: '#102027',
		justifyContent: 'space-around',
		flex: 1,
    alignItems: 'center',

	},

	inputHolder: {
		justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1.5,
	},
  inputText:{
    color: 'lightseagreen',
  },


	ButtonHolder: {
		flexDirection: 'row',
		justifyContent: 'space-around'

	},
  Button: {
		backgroundColor: 'lightseagreen',
		justifyContent: 'center',
		alignItems: 'center',
		width: 80,
		height: 80,
    borderRadius: 10,
	},
  LayoutButton:{
    	backgroundColor: 'lightseagreen',
      justifyContent: 'center',
  		alignItems: 'center',
  		paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
  },
  buttontext:{
    color: 'white'
  },
  avatar:{
    justifyContent: 'center',
    alignItems: 'center',
  }


});
