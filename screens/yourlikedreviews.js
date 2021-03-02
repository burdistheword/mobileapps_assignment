import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar,ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class YourLikedReviews extends Component {

    constructor(props) {
        super(props);

        this.state = {
            liked_reviews: [],
            isLoading: true,
        }

    }

    async componentDidMount() {
        this.focus = this.props.navigation.addListener('focus', async () => {
            this.setState({isLoading: true})
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
                        this.setState({ liked_reviews: rjson.liked_reviews })

                        const jsonLikedRev = JSON.stringify(rjson.liked_reviews)
                        await AsyncStorage.setItem('@liked_reviews', jsonLikedRev)

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
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Review", {
                                        location_id: item.location.location_id, review_body: item.review.review_body, review_id: item.review.review_id,
                                        overall_rating: item.review.overall_rating, price_rating: item.review.price_rating, quality_rating: item.review.quality_rating, clenliness_rating: item.review.clenliness_rating
                                    })}>
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

export default YourLikedReviews;
