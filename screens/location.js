import React, { Component } from 'react';
import { View, Text, ToastAndroid, Button, FlatList,ActivityIndicator } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Location extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location_name: '',
            location_id: 0,
            avg_overall_rating: 0,
            avg_price_rating: 0,
            avg_quality_rating: 0,
            avg_clenliness_rating: 0,
            location_reviews: [],
            isLoading: true,
            user_id: '',
            user_favourited: []
        }
    }


    async componentDidMount() {
        this.focus = this.props.navigation.addListener('focus', async () => {
            const us_id = await AsyncStorage.getItem('@user_id')
            this.setState({ user_id: us_id })
            this.setState({ isLoading: true })
            const loc_id = JSON.stringify(this.props.route.params.location_id);
            this.setState({ location_id: loc_id })
            fetch("http://10.0.2.2:3333/api/1.0.0/location/" + loc_id, {
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
                        this.setState({ location_name: rjson.location_name })
                        this.setState({ avg_overall_rating: rjson.avg_overall_rating })
                        this.setState({ avg_price_rating: rjson.avg_price_rating })
                        this.setState({ avg_quality_rating: rjson.avg_quality_rating })
                        this.setState({ avg_clenliness_rating: rjson.avg_clenliness_rating })
                        this.setState({ location_reviews: rjson.location_reviews })
                        this.setState({ isLoading: false })
                    }
                )
                .catch(
                    (error) => {
                        console.log(error)
                        ToastAndroid.show(error, ToastAndroid.SHORT)
                    }
                )

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
                        const jsonFavLoc = JSON.stringify(rjson.favourite_locations)
                        const jsonReview = JSON.stringify(rjson.reviews)
                        const jsonLikedRev = JSON.stringify(rjson.liked_reviews)

                        await AsyncStorage.setItem('@favourite_location', jsonFavLoc)
                        await AsyncStorage.setItem('@reviews', jsonReview)
                        await AsyncStorage.setItem('@liked_reviews', jsonLikedRev)
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

    favourite = async () => {
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
                    this.setState({ favourite_locations: rjson.favourite_locations })
                    console.log('justbeforelikescript')
                    var i;
                    var noMatchCount = 0;
                    for (i = 0; i < this.state.favourite_locations.length; i++) {
                        if (this.state.favourite_locations[i].location_id == this.state.location_id) {
                            fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/favourite', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-Authorization": await AsyncStorage.getItem('@session_token')
                                },
                                body: JSON.stringify({ "loc_id": this.state.location_id })
                            })
                                .then(
                                    (response) => {
                                        if (response.status === 200) {
                                            console.log('Unfaved')
                                            ToastAndroid.show('Unfaved', ToastAndroid.SHORT)
                                        }
                                        else if (response.status === 401) {
                                            throw 'Unathorised'
                                        }
                                        else if (response.status === 403) {
                                            throw 'Forbidden'
                                        }
                                        else if (response.status === 404) {
                                            throw 'Not Found'
                                        }
                                        else {
                                            throw 'Server Error'
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
                        else {
                            noMatchCount = noMatchCount + 1;
                        }
                        if (noMatchCount == this.state.favourite_locations.length) {
                            fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/favourite', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-Authorization": await AsyncStorage.getItem('@session_token')
                                },
                                body: JSON.stringify({ "loc_id": this.state.location_id})
                            })
                                .then(
                                    (response) => {
                                        if (response.status === 200) {
                                            console.log('Faved')
                                            ToastAndroid.show('Faved', ToastAndroid.SHORT)
                                        }
                                        else if (response.status === 400) {
                                            throw 'Bad Request'
                                        }
                                        else if (response.status === 401) {
                                            throw 'Unathorised'
                                        }
                                        else if (response.status === 404) {
                                            throw 'Not Found'
                                        }
                                        else {
                                            throw 'Server Error'
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

    render() {
        if (this.state.isLoading) {
            return (<ActivityIndicator size="large"/>)
        }
        else {
            return (
                <View>
                    <Text>Overall Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.avg_overall_rating}
                        isDisabled={true}
                        showRating={false}
                    />
                    <Text>Price Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.avg_price_rating}
                        isDisabled={true}
                        showRating={false}
                    />
                    <Text>Quality Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.avg_quality_rating}
                        isDisabled={true}
                        showRating={false}
                    />
                    <Text>Clenliness Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.avg_clenliness_rating}
                        isDisabled={true}
                        showRating={false}
                    />
                    <Text>{this.state.location_name}</Text>
                    <FlatList
                        data={this.state.location_reviews}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Review", {
                                        location_id: this.state.location_id, review_body: item.review_body, review_id: item.review_id,
                                        overall_rating: item.overall_rating, price_rating: item.price_rating, quality_rating: item.quality_rating, clenliness_rating: item.clenliness_rating
                                    })}>
                                        <View>
                                            <Text>{item.review_id}</Text>
                                            <Text>{item.review_body}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                        keyExtractor={item => item.review_id.toString()}
                    />
                    <Button title="Add a Review" onPress={() => this.props.navigation.navigate("AddReview", { location_id: this.state.location_id})} />
                    <Button title="Favourite Location" onPress={this.favourite} />
                </View>
            )
        }
    }
}

export default Location;

