import React, { Component } from 'react';
import QRScanner from './Screens/QRScanner';
import Profile from './Screens/Profile';
import Chat from './Screens/Chat';
import HomeScreen from './Screens/HomeScreen';
import {
  StackNavigator,
  TabNavigator
} from 'react-navigation';
import {
  AsyncStorage,
  } from 'react-native';




const TabNav = TabNavigator(
    {
      Profil: { screen: Profile },
      Hem: { screen: HomeScreen },
      Skanner: { screen: QRScanner },
    },
    {
      initialRouteName: 'Hem',
      swipeEnabled: true,
      tabBarPosition: 'bottom',
      tabBarOptions : {
        activeTintColor: 'lightseagreen',
        style: {
          backgroundColor: 'black',
          height: 60,
        },
        indicatorStyle: {
          borderBottomColor: 'lightseagreen',
          borderBottomWidth: 2,
        }
    }
    }
  );

  const StackNav = StackNavigator(
    {
      HomeView: {
        screen: TabNav,
        navigationOptions: ({ navigation }) => ({
          header: null,
        }),
      },
      Chat: {
        screen: Chat,
        navigationOptions: ({ navigation }) => ({
          title: `${navigation.state.params.name}`,
          headerStyle: {
            backgroundColor: 'lightseagreen',
          },
        }),
      },
    },
    {
      initialRouteName: 'HomeView',
    }
  );

  export default StackNav;
