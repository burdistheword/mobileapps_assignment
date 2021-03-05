import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ToastAndroid, TouchableOpacity } from 'react-native';


class Signup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      last_name: '',
      first_name: ''

    }

  }

  Signup = () => {
    if (this.state.email.includes('@') && this.state.password.length >= 6) {
      fetch('http://10.0.2.2:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(
          (response) => {
            if (response.status === 201) {
              ToastAndroid.show('Account Created', ToastAndroid.SHORT)
              this.props.navigation.navigate('Login')
            }
            else if (response.status === 400) {
              throw 'Bad Request'
            }
            else {
              throw 'Server Error'
            }
          }
        )
        .catch(
          (error) => {
            console.log(error)
            ToastAndroid.show(error, ToastAndroid.SHORT)
          }
        )
    }
    else {
      ToastAndroid.show('Invalid Email/Password', ToastAndroid.SHORT)

    }


  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Sign up for account</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter you First Name"
          onChangeText={(first_name) => { this.setState({ first_name: first_name }) }}
          defaultValue={this.state.first_name}
        />

        <TextInput
          style={styles.inputText}
          placeholder="Enter your Last Name"
          onChangeText={(last_name) => { this.setState({ last_name: last_name }) }}
          defaultValue={this.state.last_name}
        />

        <TextInput
          style={styles.inputText}
          placeholder="Enter your email!"
          onChangeText={(email) => { this.setState({ email: email }) }}
          defaultValue={this.state.email}
        />

        <TextInput
          style={styles.inputText}
          placeholder="Enter your password!"
          onChangeText={(password) => { this.setState({ password: password }) }}
          defaultValue={this.state.password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={this.Signup}>
          <Text style={styles.loginButtonText}>Create account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    backgroundColor: "#6f4e37"
  },
  titleText: {
    color: 'pink',
    alignSelf: 'center',
    fontSize: 40
  },
  inputText: {
    height: 50,
    width: 300,
    alignSelf: 'center',
    fontSize: 20,
    backgroundColor: '#7c573d',
    paddingLeft: 10,
    borderRadius: 5,
    margin: 10
  },
  loginButton: {
    width: 300,
    height: 25,
    alignSelf: 'center',
    backgroundColor: "#624531",
    borderRadius: 5,
    paddingBottom: 30
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: 20

  },
  createButton: {
    width: 200,
    height: 25,
    alignSelf: 'center',
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 5,
    marginTop: 10
  },
  creatButtonText: {
    textAlign: 'center',
    fontSize: 15

  }
});


export default Signup;