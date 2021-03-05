import React, { Component } from 'react';
import Home from './home';
import { View, Text, Button, TextInput, Alert, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import LoginBackground from './photos/logintest.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

  }

  login = async () => {
    if (this.state.email.includes('@') && this.state.password.length >= 6) {
      fetch('http://10.0.2.2:3333/api/1.0.0/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(
          (response) => {
            if (response.status === 200) {
              return response.json()
            }
            else if (response.status === 400) {
              throw 'Invalid email/password supplied'
            }
            else {
              throw 'something went wrong'
            }
          }
        )
        .then(
          async (rjson) => {
            const jsonValueST = rjson.token
            const jsonValueID = JSON.stringify(rjson.id)
            await AsyncStorage.setItem('@session_token', jsonValueST)
            await AsyncStorage.setItem('@user_id', jsonValueID)
            console.log(await AsyncStorage.getItem('@user_id'))
            return [jsonValueID, jsonValueST]

          }

        )
        .then(
          async (loginInfo) => {
            let [ID, ST] = loginInfo
            console.log(ID, ST);
            fetch('http://10.0.2.2:3333/api/1.0.0/user/' + ID, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                "X-Authorization": ST

              },

            })
              .then(
                (response) => {
                  if (response.status === 200) {
                    return response.json();
                  }
                  else if (response.status === 401) {
                    throw 'Unauthorized User Details'
                  }
                  else if (response.status === 404) {
                    throw 'Not Found'
                  }
                  else {
                    throw 'Server Error'
                  }
                }
              )
              .then(
                async (rjson) => {
                  const jsonFirstName = rjson.first_name
                  const jsonLastName = JSON.stringify(rjson.last_name)
                  const jsonEmail = JSON.stringify(rjson.email)
                  const jsonFavLoc = JSON.stringify(rjson.favourite_locations)
                  const jsonReview = JSON.stringify(rjson.reviews)
                  const jsonLikedRev = JSON.stringify(rjson.liked_reviews)

                  await AsyncStorage.setItem('@first_name', jsonFirstName)
                  await AsyncStorage.setItem('@last_name', jsonLastName)
                  await AsyncStorage.setItem('@email', jsonEmail)
                  await AsyncStorage.setItem('@favourite_location', jsonFavLoc)
                  await AsyncStorage.setItem('@reviews', jsonReview)
                  await AsyncStorage.setItem('@liked_reviews', jsonLikedRev)
                  await AsyncStorage.setItem('@password', this.state.password)
                  ToastAndroid.show('Login successful!', ToastAndroid.SHORT)
                  this.props.navigation.navigate('Home')

                }
              )
              .catch(
                (error) => {
                  console.log(error)
                  ToastAndroid.show(error, ToastAndroid.SHORT)
                }
              )
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
      ToastAndroid.show('Invalid email/password', ToastAndroid.SHORT)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>Welcome to CoffeDa</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          onChangeText={(email) => { this.setState({ email: email }) }}
          defaultValue={this.state.email}
        />
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          onChangeText={(password) => { this.setState({ password: password }) }}
          defaultValue={this.state.password}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={this.login}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={() => this.props.navigation.navigate('Signup')}>
          <Text style={styles.creatButtonText}>Need an account? Sign Up</Text>
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
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
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


export default Login;