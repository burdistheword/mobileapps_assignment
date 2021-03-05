import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar, Button } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NearbyScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      first_name: '',
      locations: [],
      isLoading: true,
      location:null
    }

  }

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const location = JSON.stringify(position);

        this.setState({ location });
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
  };


  async componentDidMount() {
    const test = JSON.parse(await AsyncStorage.getItem('@first_name'))
    this.setState({ first_name: test })
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

  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <Text>
            Loading
            </Text>
        </View>
      )
    }
    else {
      console.log(this.state.locations, 'here')
      return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('./photos/Hamburger_icon.svg.png')}
            />
          </TouchableOpacity>
          <Text>
            {this.state.first_name}
          </Text>
          <Text>{this.state.location}</Text>
          <Button title="Get Location" onPress={() => this.findCoordinates()} />
          <FlatList
            data={this.state.locations}
            renderItem={({ item }) => {
              return (
                <View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("Location", { location_id: item.location_id })}>
                    <View style={styles.item}>
                      <Text>{item.location_id}</Text>
                      <Text>{item.location_name}</Text>
                      <AirbnbRating
                        size={15}
                        defaultRating={item.avg_overall_rating}
                        showRating={false}
                        isDisabled={true}
                      />
                      <Text>{item.location_town}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }}
            keyExtractor={item => item.location_id.toString()}
          />
        </SafeAreaView>
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
});

export default NearbyScreen;
