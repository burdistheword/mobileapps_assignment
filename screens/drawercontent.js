import React from 'react';
import { Text, View, Button, StyleSheet, ToastAndroid } from 'react-native';
import { Drawer } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export function DrawerContent(props) {

  logout = async () => {

    fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'POST',
      headers: {
        "X-Authorization": await AsyncStorage.getItem('@session_token')
      },
    })
      .then(
        (response) => {
          if (response.status === 200) {
            ToastAndroid.show('Logout successful!', ToastAndroid.SHORT)
            props.navigation.navigate('LoginStack')
          }
          else if (response.status === 401) {
            throw 'Unauthorized'
          }
          else {
            throw 'something went wrong'
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

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Section style={styles.container}>
        <Button style={styles.loginButton} title="Home" onPress={() => props.navigation.navigate('Home')} />
        <Button style={styles.loginButton} title="Profile" onPress={() => props.navigation.navigate('Profile')} />
        <Button style={styles.loginButton} title="Your Reviews" onPress={() => props.navigation.navigate('YourReviews')} />
        <Button style={styles.loginButton} title="Your Liked Reviews" onPress={() => props.navigation.navigate('YourLikedReviews')} />
        <Button style={styles.loginButton} title="Your Fav Locations" onPress={() => props.navigation.navigate('YourFavLocations')} />
        <Button style={styles.loginButton} title="Logout" onPress={logout} />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  titleText: {
    color: 'pink',
    alignSelf: 'center'
  },
  inputText: {
    height: 50,
    width: 200,
    alignSelf: 'center'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"

  },
  loginButton: {
    width: 200,
    alignSelf: 'center'
  },
  createButton: {
    width: 200,
    alignSelf: 'center'
  }
});