import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ToastAndroid, ImageBackground } from 'react-native';
import LoginBackground from './photos/logintest.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component{

    constructor(props){
        super(props);

        this.state={
            email:'',
            password:''
        }

    }

  login= async ()=>{
  
  fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(
      (response)=>{
        if (response.status===200){
          return response.json()
        }
        else if (response.status===400){
          throw 'Invalid email/password supplied'
        }
        else {
          throw 'something went wrong'
        }
      }
    )
    .then(
      async (rjson)=>{
        //how does rjson.etc know what it is?
            const jsonValueST = JSON.stringify(rjson.token)
            const jsonValueID = JSON.stringify(rjson.id)
            await AsyncStorage.setItem('@session_token', jsonValueST)
            await AsyncStorage.setItem('@user_id', jsonValueID)  
        ToastAndroid.show('Login successful!',ToastAndroid.SHORT)
        this.props.navigation.navigate('Home')
        
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
    return (
      <View style={styles.container}>
        <ImageBackground source={LoginBackground} style={styles.image}>
          <Text style={styles.titleText}>Welcome to CoffeDa</Text>
          <TextInput
              style={styles.inputText}
              placeholder="Email"
              onChangeText={(email)=>{this.setState({email:email})}}
              defaultValue={this.state.email}
          />
          
          <TextInput
              style={styles.inputText}
              placeholder="Password"
              onChangeText={(password)=>{this.setState({password:password})}}
              defaultValue={this.state.password}
              secureTextEntry
          />
          <View style={{width:200,alignSelf:'center'}}>
            <Button style={styles.loginButton} title="Login" onPress={this.login} />
            <Button style={styles.createButton} title="Create an account" onPress={()=>this.props.navigation.navigate('Signup')} />
          </View>
        </ImageBackground>
      </View>
    );
  }
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


export default Login;