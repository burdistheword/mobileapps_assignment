import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component{

  render(){
    return(
        <View>
          <Text>Home Screen</Text>
            <Button
            title="Your Profile"
            onPress={() => this.props.navigation.navigate('Profile')}/>
        </View>
    );
  }
}

export default HomeScreen;
