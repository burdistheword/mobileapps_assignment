import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Octicons';

class HomeScreen extends Component{

  render(){
    return(
        <View>
          <Text>Home Screen</Text>
            <Button
            title="Your Profile"
            onPress={() => this.props.navigation.navigate('Profile')}/>
            <Button
            title="Drawer Open"
            onPress={() => this.props.navigation.openDrawer()}/>
        </View>
    );
  }
}

export default HomeScreen;
