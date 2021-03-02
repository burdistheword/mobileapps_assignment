import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar, TextInput, Button } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Find extends Component {

    constructor(props) {
        super(props);

        this.state = {
            q: '',
            overall_rating: 0,
            locations: [],
            isLoading: true
        }

    }

    async componentDidMount() {
        this.getData('http://10.0.2.2:3333/api/1.0.0/find')
    }

    getData = async (url) => {
        fetch(url, {
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

    search = () => {
        let url = 'http://10.0.2.2:3333/api/1.0.0/find?'

        console.log(this.state.q);
        console.log(this.state.overall_rating);

        if (this.state.q != '') {
            url += 'q=' + this.state.q + '&';
        }

        if (this.state.overall_rating > 0) {
            url += 'overall_rating=' + this.state.overall_rating + '&';
        }

        this.getData(url);
    }

    ratingCompleted(rating, name) {
        let stateObject = () => {
            let returnObj = {};
            returnObj[name] = rating;
            return returnObj;
        };
        this.setState(stateObject);
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
            return (
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require('./photos/Hamburger_icon.svg.png')}
                        />
                    </TouchableOpacity>
                    <TextInput value={this.state.q} onChangeText={(q) => this.setState({ q: q })} />

                    <Text>Overall Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.overall_rating}
                        showRating={false}
                        onFinishRating={(rating) => this.ratingCompleted(rating, 'overall_rating')}
                    />
                    <Button title="Search" onPress={() => this.search()} />
                    <Text>
                        {this.state.first_name}
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

export default Find;
