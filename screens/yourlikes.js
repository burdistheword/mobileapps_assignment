import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cond } from 'react-native-reanimated';

class YourLikes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            favourite_locations: [],
            liked_reviews: [],
            reviews: [],
            isLoading: true,
            condition: 0
        }

    }

    async componentDidMount() {
        this.focus = this.props.navigation.addListener('focus', async () => {
            const condition = this.props.route.params.condition;
            this.setState({ condition: condition })

            fetch('http://10.0.2.2:3333/api/1.0.0/user/' + await AsyncStorage.getItem('@user_id'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": await AsyncStorage.getItem('@session_token')

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
                        const jsonFavLoc = JSON.stringify(rjson.favourite_locations)
                        const jsonReview = JSON.stringify(rjson.reviews)
                        const jsonLikedRev = JSON.stringify(rjson.liked_reviews)

                        await AsyncStorage.setItem('@favourite_location', jsonFavLoc)
                        await AsyncStorage.setItem('@reviews', jsonReview)
                        await AsyncStorage.setItem('@liked_reviews', jsonLikedRev)

                        this.setState({ favourite_locations: rjson.favourite_locations })
                        this.setState({ liked_reviews: rjson.liked_reviews })
                        this.setState({ reviews: rjson.reviews })

                    }
                )
                .catch(
                    (error) => {
                        console.log(error)
                        ToastAndroid.show(error, ToastAndroid.SHORT)
                    }
                )
        });
        this.setState({ isLoading: false })
    }

    componentWillUnmount() {
        this.focus();
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
            if (this.state.condition == 1) {
                return (
                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require('./photos/Hamburger_icon.svg.png')}
                            />
                        </TouchableOpacity>
                        <FlatList
                            data={this.state.reviews}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Review")}>
                                            <View style={styles.item}>
                                                <Text>{item.location.location_name}</Text>
                                                <Text>{item.review.review_id}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.review.review_id.toString()}
                        />
                    </SafeAreaView>
                );
            }
            else if (this.state.condition == 2) {
                return (
                    <SafeAreaView style={styles.container}>
                        <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require('./photos/Hamburger_icon.svg.png')}
                            />
                        </TouchableOpacity>
                        <FlatList
                            data={this.state.liked_reviews}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Review")}>
                                            <View style={styles.item}>
                                                <Text>{item.location.location_name}</Text>
                                                <Text>{item.review.review_id}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.review.review_id.toString()}
                        />
                    </SafeAreaView>
                );
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
                        <FlatList
                            data={this.state.favourite_locations}
                            renderItem={({ item }) => {
                                return (
                                    <View>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Location")}>
                                            <View style={styles.item}>
                                                <Text>{item.location_id}</Text>
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

export default YourLikes;
