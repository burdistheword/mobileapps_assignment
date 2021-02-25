import React, { Component } from 'react';
import { Text, View, Button, TextInput, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    }
  }

  async componentDidMount() {
    const first_name = JSON.parse(await AsyncStorage.getItem('@first_name'))
    const last_name = JSON.parse(await AsyncStorage.getItem('@last_name'))
    const email = JSON.parse(await AsyncStorage.getItem('@email'))

    this.setState({ first_name: first_name })
    this.setState({ last_name: last_name })
    this.setState({ email: email })
    
  }


  saveChanges = async () => {
    const ID = await AsyncStorage.getItem('@user_id')
    const ST = await AsyncStorage.getItem('@session_token')
    console.log(ID, ST)

    fetch('http://10.0.2.2:3333/api/1.0.0/user/' + ID, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "X-Authorization": ST
      },
      body: JSON.stringify(this.state)
    })
      .then(
        (response) => {
          if (response.status === 200) {
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
                  //ToastAndroid.show(JSON.stringify(response),ToastAndroid.SHORT)
                  const jsonFirstName = JSON.stringify(rjson.first_name)
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
                  await AsyncStorage.setItem('@liked_reivew', jsonLikedRev)
                  ToastAndroid.show('Changes saved!', ToastAndroid.SHORT)
                  this.props.navigation.navigate('Profile')
                }
              )
              .catch(
                (error) => {
                  console.log(error)
                  ToastAndroid.show(error, ToastAndroid.SHORT)
                }
              )
          }
          else if (response.status === 400) {
            throw 'Bad request'
          }
          else if (response.status === 401) {
            throw 'Unauthorised'
          }
          else if (response.status === 403) {
            throw 'Forbidden'
          }
          else if (response.status === 404) {
            throw 'Not Found'
          }
          else {
            throw 'Server'
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


  render() {
    return (
      <View>
        <TextInput
          onChangeText={(first_name) => { this.setState({ first_name: first_name }) }}
          defaultValue={this.state.first_name}
        />
        <TextInput
          onChangeText={(last_name) => { this.setState({ last_name: last_name }) }}
          defaultValue={this.state.last_name}
        />
        <TextInput
          onChangeText={(email) => { this.setState({ email: email }) }}
          defaultValue={this.state.email}
        />
        <Button title='Save Changes' onPress={this.saveChanges} />
      </View>
    );
  }
}

export default Profile;