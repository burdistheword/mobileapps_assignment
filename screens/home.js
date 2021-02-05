import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { createDrawerNavigator } from '@react-navigation/drawer';
//import { NavigationContainer } from '@react-navigation/native';

class HomeScreen extends Component{

  logout= async ()=>{

    // fetch('http://10.0.2.2:3333/api/1.0.0/reset', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //   })
    //ToastAndroid.show(await AsyncStorage.getItem("@session_token"),ToastAndroid.SHORT)

    fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
        method: 'POST',
        headers: {
          "X-Authorization": JSON.parse(await AsyncStorage.getItem('@session_token'))
        },
      })
      .then(
        (response)=>{
          if (response.status===200){
            ToastAndroid.show('Logout successful',ToastAndroid.SHORT)
            this.props.navigation.navigate('Login')
          }
          else if (response.status===401){
            throw 'Unauthorized'
          }
          else {
            throw 'something went wrong'
          }
        }
      )
      .catch(
        (error)=>{
          console.log(error)
          ToastAndroid.show(error,ToastAndroid.SHORT)
        }
      )
  }
  
  
  render(){
    return(
        <View>
          <Text>Home Screen</Text>
          <Button
            title="Logout" onPress={this.logout}/>
            <Button
            title="Your Profile"
            onPress={() => this.props.navigation.navigate('Profile')}/>
        </View>
    );
  }
}

export default HomeScreen;
