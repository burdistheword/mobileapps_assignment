import React, { Component } from 'react';
import { View, Text, Button,FlatList,ToastAndroid } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from 'bad-words';

class AddReview extends Component {

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
        this.setState({overall_rating:0})
        this.setState({price_rating:0})
        this.setState({quality_rating:0})
        this.setState({clenliness_rating:0})
        this.setState({review_body:""})
        const location_id = this.props.route.params.location_id;
        console.log(location_id);
        this.location_id = location_id;
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
      console.log(this.state.review_body)

      var filter = new Filter();
      filter.addWords('Tea','Pastries','Cake','Teas','Pastry','Cakes');
      const filteredString = filter.clean(this.state.review_body);
      this.setState({review_body : filteredString})
      console.log(this.state.review_body)
  
        fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.location_id + '/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Authorization": await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(this.state)
    })
      .then(
        (response) => {
          if (response.status === 201) {
            ToastAndroid.show('Review Added!',ToastAndroid.SHORT)
            this.props.navigation.navigate('Location');
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
export default AddReview;