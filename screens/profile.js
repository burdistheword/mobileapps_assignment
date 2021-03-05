import React, { Component } from 'react';
import { Text, View, Button, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      isLoading: true
    }
  }

  async componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', async () => {
      const value = await AsyncStorage.getItem('@session_token')
      if (value == null) {
        this.props.navigation.navigate('Login')
      }
      else {
        this.setState({ isLoading: true })
        const first_name = await AsyncStorage.getItem('@first_name')
        const last_name = await AsyncStorage.getItem('@last_name')
        const email = await AsyncStorage.getItem('@email')
        this.setState({ first_name: first_name })
        this.setState({ last_name: last_name })
        this.setState({ email: email })
        this.setState({ isLoading: false })
      }
    });
  }

  componentWillUnmount() {
    this.focus();
  }

  render() {
    if (this.state.isLoading) {
      return (<View style={{flex: 1, justifyContent: 'center',flexDirection:'row'}}>
      <ActivityIndicator size="large" color="#0000ff" />
</View>)
    }
    else {
      return (
        <View>
          <Text>{this.state.first_name}</Text>
          <Text>{this.state.last_name}</Text>
          <Text>{this.state.email}</Text>
          <Button title='Edit' onPress={() => this.props.navigation.navigate('EditProfile')} />
        </View>
      );
    }
  }
}

export default Profile;