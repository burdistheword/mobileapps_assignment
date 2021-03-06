import React, { Component } from 'react';
import { View, Text, Button, FlatList, ToastAndroid, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Review extends Component {

    constructor(props) {
        super(props);

        this.state = {
            overall_rating: 0,
            price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
            location_id: 0,
            review_body: '',
            review_id: 0,
            user_reviews: [],
            yourReview: false,
            isLoading: true,
            user_id: '',
            totalLikes: 0,
            liked_reviews: [],
            user_liked: [],
            url: [],
            likes: 0
        }
    }


    isYourReview = () => {
        let revID = this.state.review_id;
        let userReviews = this.state.user_reviews;
        let i = 0;
        let arrayLength = userReviews.length;
        while (i < arrayLength) {
            if (userReviews[i].review.review_id == revID) {
                this.setState({ yourReview: true })
            }
            i++;
        }
    }

    getimage = async () => {
        fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.location_id + '/review/' + this.review_id + '/photo', {
            method: 'GET',
            headers: {
                'Content-Type': 'image/png',
                "X-Authorization": await AsyncStorage.getItem('@session_token')
            },
        })
            .then(
                (response) => {
                    if (response.status === 200) {
                        this.setState({ url: respons })
                        ToastAndroid.show('Changes Saved!', ToastAndroid.SHORT)
                        this.props.navigation.navigate('Location')
                    }
                    else if (response.status === 400) {
                        throw 'Bad Request'
                    }
                    else if (response.status === 401) {
                        throw 'Unauthorised'
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

    deleteReview = async () => {
        fetch("http://10.0.2.2:3333/api/1.0.0/location/" + this.state.location_id + "/review/" + this.state.review_id, {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json',
                "X-Authorization": await AsyncStorage.getItem('@session_token')
            },
        })
            .then(
                (response) => {
                    if (response.status === 200) {
                        ToastAndroid.show("Review Deleted!", ToastAndroid.SHORT)
                        this.props.navigation.navigate("Location")
                    }
                    else if (response.status === 400) {
                        throw 'Bad request'
                    }
                    else if (response.status === 401) {
                        throw 'Unauthorised'
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

    likeReview = async () => {

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
                    var i;
                    var noMatchCount = 0;
                    if(this.state.liked_reviews.length == 0){
                        fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/like', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                "X-Authorization": await AsyncStorage.getItem('@session_token')
                            },
                            body: JSON.stringify({ "loc_id": this.state.location_id, "rev_id": this.state.review_id })
                        })
                            .then(
                                (response) => {
                                    if (response.status === 200) {
                                        console.log('Liked')
                                        ToastAndroid.show('Liked', ToastAndroid.SHORT)
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
                    else{
                    for (i = 0; i < this.state.liked_reviews.length; i++) {
                        if (this.state.liked_reviews[i].review.review_id == this.state.review_id) {
                            fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/like', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-Authorization": await AsyncStorage.getItem('@session_token')
                                },
                                body: JSON.stringify({ "loc_id": this.state.location_id, "rev_id": this.state.review_id })
                            })
                                .then(
                                    (response) => {
                                        if (response.status === 200) {
                                            console.log('Unliked')
                                            ToastAndroid.show('Unliked', ToastAndroid.SHORT)
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
                        if (noMatchCount == this.state.liked_reviews.length) {
                            fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/like', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    "X-Authorization": await AsyncStorage.getItem('@session_token')
                                },
                                body: JSON.stringify({ "loc_id": this.state.location_id, "rev_id": this.state.review_id })
                            })
                                .then(
                                    (response) => {
                                        if (response.status === 200) {
                                            console.log('Liked')
                                            ToastAndroid.show('Liked', ToastAndroid.SHORT)
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
                }
            )
            .catch(
                (error) => {
                    console.log(error)
                    ToastAndroid.show(error, ToastAndroid.SHORT)
                }
            )
                

    }

    async componentDidMount() {
        this.focus = this.props.navigation.addListener('focus', async () => {
            const value = await AsyncStorage.getItem('@session_token')
            if (value == null) {
                this.props.navigation.navigate('Login')
            }
            else {
                this.setState({ isLoading: true })
                this.setState({ yourReview: false })
                const us_id = await AsyncStorage.getItem('@user_id')
                const loc_id = this.props.route.params.location_id;
                const rev_body = this.props.route.params.review_body;
                const rev_id = JSON.stringify(this.props.route.params.review_id);
                const ov_rating = this.props.route.params.overall_rating;
                const pr_rating = this.props.route.params.price_rating;
                const qu_rating = this.props.route.params.quality_rating;
                const cl_rating = this.props.route.params.clenliness_rating;
                const likes = this.props.route.params.likes;
                const user_rev = JSON.parse(await AsyncStorage.getItem('@reviews'))
                this.setState({ likes: likes})
                this.setState({ user_id: us_id })
                this.setState({ location_id: loc_id })
                this.setState({ review_body: rev_body })
                this.setState({ review_id: rev_id })
                this.setState({ overall_rating: ov_rating })
                this.setState({ price_rating: pr_rating })
                this.setState({ quality_rating: qu_rating })
                this.setState({ clenliness_rating: cl_rating })
                this.setState({ user_reviews: user_rev })
                this.isYourReview();
                this.setState({ isLoading: false })
            }
        });
    }

    componentWillUnmount() {
        this.focus();
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
                <View style={{flex: 1, justifyContent: 'center',flexDirection:'row'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else {
            if (this.state.yourReview == true) {
                return (
                    <View style={styles.container}>
                        <Text>Likes : {this.state.likes}</Text>
                        <Text>Overall Rating</Text>
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.overall_rating}
                            showRating={false}
                            isDisabled={true}
                        />
                        <Text>Price Rating</Text>
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.price_rating}
                            showRating={false}
                            isDisabled={true}
                        />
                        <Text>Quality Rating</Text>
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.quality_rating}
                            showRating={false}
                            isDisabled={true} />
                        <Text>Clenliness Rating</Text>
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.clenliness_rating}
                            showRating={false}
                            isDisabled={true} />
                        <Text>{this.state.review_body}</Text>
                        <Button title="Edit Review" onPress={() => this.props.navigation.navigate("EditReview", {
                            location_id: this.state.location_id, review_id: this.state.review_id,
                            overall_rating: this.state.overall_rating, quality_rating: this.state.quality_rating, price_rating: this.state.price_rating, clenliness_rating: this.state.clenliness_rating, review_body: this.state.review_body
                        })} />
                        <Button title="Delete Review" onPress={() => this.deleteReview()} />
                        <Button title="Like Review" onPress={this.likeReview} />
                        <Image style={{ width: 200, height: 200 }} source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/photo?timestamp=' + Date.now() }} />
                    </View>
                )
            }
            else {
                return (
                    <View style={styles.container}>
                        <Text>{this.state.location_id}</Text>
                        <Text>Total Likes : {this.state.totalLikes}</Text>
                        <Text>Have you liked : {JSON.stringify(this.state.user_liked)}</Text>
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.overall_rating}
                            showRating={false}
                            isDisabled={true}
                        />
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.price_rating}
                            showRating={false}
                            isDisabled={true}
                        />
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.quality_rating}
                            showRating={false}
                            isDisabled={true}
                        />
                        <AirbnbRating
                            size={15}
                            defaultRating={this.state.clenliness_rating}
                            showRating={false}
                            isDisabled={true}
                        />
                        <Text>{this.state.review_body}</Text>
                        <Image style={styles.image} source={{ uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/photo?timestamp=' + Date.now() }} />
                        <Button title="Like Review" onPress={this.likeReview} />
                    </View>
                )
            }
        }

    }
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


export default Review;
