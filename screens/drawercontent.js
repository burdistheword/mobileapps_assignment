import React, { Component } from 'react';
import Home from './home';
import Profile from './profile';
import { Text, View, Button,StyleSheet,ToastAndroid } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerRouter, NavigationContainer } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {Drawer} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export function DrawerContent(props) {

    //  constructor(props){
    //    super(props);

    //    this.state={
    //     user_id: '',
    //     first_name: '',
    //     last_name: '',
    //     email: '',
    //     favourite_locations: [],
    //     reviews: [],
    //     liked_reviews: []

    //   } 

    // }

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
                ToastAndroid.show('Logout successful!',ToastAndroid.SHORT)
                props.navigation.navigate('LoginStack')
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

      profile= async ()=>{
        fetch('http://10.0.2.2:3333/api/1.0.0/user/'+ JSON.parse(await AsyncStorage.getItem('@user_id')), {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          "X-Authorization": JSON.parse(await AsyncStorage.getItem('@session_token'))

        },
        
      })
      .then(
        (response)=>{
          if (response.status===200){

            //ToastAndroid.show(JSON.stringify(response),ToastAndroid.SHORT)
            const jsonFirstName = JSON.stringify(response.first_name)
            const jsonLastName = JSON.stringify(response.last_name)
            const jsonEmail = JSON.stringify(response.email)
            this.setState({first_name:jsonFirstName})
            this.setState({last_name:jsonLastName})
            this.setState({email:jsonEmail})
            ToastAndroid.show(email,ToastAndroid.SHORT)
          }
          else if (response.status===401){
            throw 'Unauthorized'
          }
          else if (response.status===404){
            throw 'Not Found'
          }
          else {
            throw 'Server Error'
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
      

    return (
        <View style={{flex:1}}>
                 <Text>This is a test!</Text>
                 <Drawer.Section style={styles.container}>
                     <Button style={styles.loginButton} title="Logout" onPress={logout} />
                     <Button style={styles.loginButton} title="Profile" onPress={profile}/>
                     <Button style={styles.loginButton} title="Home" onPress={()=>props.navigation.navigate('Home')}/>
                 </Drawer.Section>
        </View>
    );
  }

const styles = StyleSheet.create({
    container:{
      flex: 1,
      flexDirection: "column",
    },
    titleText:{
        color:'pink',
        alignSelf:'center'
    },
    inputText:{
      height: 50,
      width:200,
      alignSelf: 'center'
    },
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
     
    },
    loginButton:{
      width:200,
      alignSelf:'center'
    },
    createButton:{
      width:200,
      alignSelf:'center'
    }
});