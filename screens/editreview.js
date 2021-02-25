import React, { Component } from 'react';
import { View, Text, Button,FlatList,ToastAndroid } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditReview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            overall_rating: 0,
            price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
            review_body: ""
        }
    }

    componentDidMount(){
      this.focus = this.props.navigation.addListener('focus', async () => {
        const ov_rating = this.props.route.params.overall_rating;
        const pr_rating = this.props.route.params.price_rating;
        const qu_rating = this.props.route.params.quality_rating;
        const cl_rating = this.props.route.params.clenliness_rating;
        const re_body = this.props.route.params.review_body;

        this.setState({overall_rating:ov_rating})
        this.setState({price_rating:pr_rating})
        this.setState({quality_rating:qu_rating})
        this.setState({clenliness_rating:cl_rating})
        this.setState({review_body:re_body})

        const location_id = this.props.route.params.location_id;
        this.location_id = location_id;
        const review_id = this.props.route.params.review_id;
        this.review_id = review_id;
      });
    }

    componentWillUnmount(){
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

    addReview = async () => {
        fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.location_id + '/review/' + this.review_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "X-Authorization": await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(this.state)
    })
      .then(
        (response) => {
          if (response.status === 200) {
            ToastAndroid.show('Changes Saved!',ToastAndroid.SHORT)
            this.props.navigation.navigate('Review',{refresh: true, new_overall_rating:this.state.overall_rating, new_price_rating: this.state.price_rating,
            new_quality_rating: this.state.quality_rating, new_clenliness_rating: this.state.clenliness_rating, new_review_body: this.state.review_body});
          }
          else if (response.status === 400) {
            throw 'Bad Request'
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

    render() {
        return (
            <View>
                <Text>Location ID - {this.location_id}</Text>
                <AirbnbRating
                    size={15}
                    defaultRating={this.state.overall_rating}
                    showRating={false}
                    onFinishRating={(rating) => this.ratingCompleted(rating, 'overall_rating')}
                />
                <AirbnbRating
                    size={15}
                    defaultRating={this.state.price_rating}
                    showRating={false}
                    onFinishRating={(rating) => this.ratingCompleted(rating, 'price_rating')}
                />
                <AirbnbRating
                    size={15}
                    defaultRating={this.state.quality_rating}
                    showRating={false}
                    onFinishRating={(rating) => this.ratingCompleted(rating, 'quality_rating')}
                />
                <AirbnbRating
                    size={15}
                    defaultRating={this.state.clenliness_rating}
                    showRating={false}
                    onFinishRating={(rating) => this.ratingCompleted(rating, 'clenliness_rating')}
                />
                <TextInput
                    value={this.state.review_body}
                    placeholder="Enter review comments"
                    onChangeText={(review_body) => this.setState({ review_body: review_body })}
                />
                <Button title="Save Changes" onPress={() => this.addReview()} />
            </View>
        )
  }
}
export default EditReview;