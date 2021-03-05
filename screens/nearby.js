import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar, Button, ActivityIndicator, Alert, PermissionsAndroid } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';

async function requestLocationPermission(){
  console.log('int')
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Lab04 Location Permission',
        message:
          'This app requires access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can access location');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

class NearbyScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      first_name: '',
      locations: [],
      isLoading: true,
      location:null,
      locationPersmission: false
    }

  }

  findCoordinates = () => {
    if(!this.state.locationPermission){
      this.state.locationPermission = requestLocationPermission();
    }
    Geolocation.getCurrentPosition(
      (position) => {
        const location = JSON.stringify(position);

        this.setState({ location });
        console.log(this.state.location)
      },
      (error) => {
        Alert.alert(error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  }


  async componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', async () => {
    const test = await AsyncStorage.getItem('@first_name')
    this.setState({ first_name: test })
    this.findCoordinates();
    fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      method: 'GET',
      headers: {
        "X-Authorization": await AsyncStorage.getItem('@session_token')
      },
    })
      .then(
        (response) => {
          if (response.status === 200) {
            return response.json();
          }
          else if (response.status === 400) {
            throw 'Bad Request'
          }
          else if (response.status === 401) {
            throw 'Unauthorised'
          }
          else {
            throw 'Server Error'
          }
        }
      )
      .then(
        async (rjson) => {
          //ToastAndroid.show(JSON.stringify(response),ToastAndroid.SHORT)
          console.log(rjson)
          this.setState({ locations: rjson })
          this.setState({ isLoading: false })
        }
      )
      .catch(
        (error) => {
          console.log(error)
          ToastAndroid.show(error, ToastAndroid.SHORT)
        }
      )
    });
  }
  componentWillUnmount(){
    this.focus();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large"/>
        </View>
      )
    }
    else {
      return (
        
          <MapView
    initialRegion={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
    style={styles.map}
  />

      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default NearbyScreen;
