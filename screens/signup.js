import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ToastAndroid } from 'react-native';


class Signup extends Component{

    constructor(props){
        super(props);

        this.state={
            email:'',
            password:'',
            last_name:'',
            first_name:''

        }

    }

  Signup=()=>{
    fetch('http://10.0.2.2:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(
      (response)=>{
        if (response.status===201){
          return response.json()
        }
        else if (response.status===400){
          throw 'failed validation'
        }
        else {
          throw 'something went wrong'
        }
      }
    )
    .then(
      (rjson)=>{
        srjson = JSON.stringify(rjson)
        console.log(srjson)
        ToastAndroid.show('Account Created',ToastAndroid.SHORT)
        this.props.navigation.navigate('Login')
        
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
      <View>
        <Text style={styles.titleText}>Sign up for account</Text>
        <TextInput
            style={{height: 40}}
            placeholder="Enter you First Name"
            onChangeText={(first_name)=>{this.setState({first_name:first_name})}}
            defaultValue={this.state.first_name}
        />
        
        <TextInput
            style={{height: 40}}
            placeholder="Enter your Last Name"
            onChangeText={(last_name)=>{this.setState({last_name:last_name})}}
            defaultValue={this.state.last_name}
        />
        
        <TextInput
            style={{height: 40}}
            placeholder="Enter your email!"
            onChangeText={(email)=>{this.setState({email:email})}}
            defaultValue={this.state.email}
        />

        <TextInput
            style={{height: 40}}
            placeholder="Enter your password!"
            onChangeText={(password)=>{this.setState({password:password})}}
            defaultValue={this.state.password}
            secureTextEntry
        />
        <Button title="Sign Up" onPress={this.Signup} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    titleText:{
        color:'pink'
    }
});


export default Signup;