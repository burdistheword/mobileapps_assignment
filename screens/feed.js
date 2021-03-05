import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar, ActivityIndicator, ToastAndroid } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FeedScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      first_name: '',
      locations: [],
      isLoading: true
    }

  }

  async componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', async () => {
      const first_name = await AsyncStorage.getItem('@first_name')
      this.setState({ first_name: first_name }, async () => {


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

    });
  }
  componentWillUnmount() {
    this.focus();
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    else {
      return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('./photos/Hamburger_icon.svg.png')}
            />
          </TouchableOpacity>
          <Text>
            Hi {this.state.first_name}, welcome to CoffiDa!
          </Text>
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
    justifyContent: 'center',
    backgroundColor: "#6f4e37"

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

export default FeedScreen;
