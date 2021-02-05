import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

class Profile extends Component{
  render(){
    return(
        <View>
          <Text>Home Screen</Text>
          <Button
            title="Logout"
            onPress={() => this.props.navigation.navigate('Login')}/>
        </View>
    );
  }
}

export default Profile;