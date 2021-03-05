import React, { Component } from 'react';
import { View, Text, Button, FlatList, ToastAndroid, Image,ActivityIndicator } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from 'bad-words';

class EditReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      review_body: "",
      url: '',
      image: [],
      imagePassed: false,
      isLoading: true,
      location_id: 0,
      review_id: 0,
      previous_review_id: 0
    }
  }

  componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', async () => {
      this.setState({isLoading:true})
      const location_id = this.props.route.params.location_id;
      this.setState({ location_id: location_id })
      const review_id = this.props.route.params.review_id;
      this.setState({ review_id: review_id })
      this.setState({ url: 'http://10.0.2.2:3333/api/1.0.0/location/' + location_id + '/review/' + review_id + '/photo?timestamp=' + Date.now() })
      const previous_review_id = this.props.route.params.previous_review_id;
      this.setState({ previous_review_id: previous_review_id })

      if (review_id === previous_review_id) {
        const url = this.props.route.params.url;
        const image = this.props.route.params.image;
        this.setState({ image: image })
        this.setState({ url: url })
      }


      const ov_rating = this.props.route.params.overall_rating;
      const pr_rating = this.props.route.params.price_rating;
      const qu_rating = this.props.route.params.quality_rating;
      const cl_rating = this.props.route.params.clenliness_rating;
      const re_body = this.props.route.params.review_body;
      this.setState({ overall_rating: ov_rating })
      this.setState({ price_rating: pr_rating })
      this.setState({ quality_rating: qu_rating })
      this.setState({ clenliness_rating: cl_rating })
      this.setState({ review_body: re_body })
      this.setState({ isLoading: false })
      // if(this.state.isLoading==false){
      //   console.log(this.state.overall_rating)
      //   console.log('reviewid'+review_id)
      // console.log('previous'+previous_review_id)
      //   console.log('reviewid'+this.state.review_id)
      // console.log('previous'+this.state.previous_review_id)
      // }
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

  addReview = async () => {
    console.log(this.state.review_body)

    var filter = new Filter();
    filter.addWords('Tea', 'Pastries', 'Cake', 'Teas', 'Pastry', 'Cakes');
    const filteredString = filter.clean(this.state.review_body);
    this.setState({ review_body: filteredString })
    console.log(this.state.review_body)


    fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "X-Authorization": await AsyncStorage.getItem('@session_token')
      },
      body: JSON.stringify(this.state)
    })
      .then(
        async (response) => {
          if (response.status === 200) {

            fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/photo', {
              method: 'POST',
              headers: {
                'Content-Type': 'image/png',
                "X-Authorization": await AsyncStorage.getItem('@session_token')
              },
              body: this.state.image
            })
              .then(
                (response) => {
                  if (response.status === 200) {
                    this.setState({ image: [] })
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

  deleteImage = async () => {
    fetch('http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/photo', {
      method: 'Delete',
      headers: {
        'Content-Type': 'image/png',
        "X-Authorization": await AsyncStorage.getItem('@session_token')
      },
    })
      .then(
        (response) => {
          if (response.status === 200) {
            this.setState({ image: [] })
            this.setState({ url: '' })
            ToastAndroid.show('Image Deleted', ToastAndroid.SHORT)
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
    if (this.state.isLoading) {
      return (
        <ActivityIndicator size="large"/>
      )
    }
    else {
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
          <Button title="Choose Photo" onPress={() => this.props.navigation.navigate('Photo', { review_id: this.state.review_id })} />
          <Button title="Delete Photo" onPress={() => this.deleteImage()} />
          <Image style={{ width: 200, height: 200 }} source={{uri: this.state.url }} />
          
        </View>
      )
    }



  }
}
export default EditReview;

//<Image style={{width: 200, height:200}} source={{uri: 'http://10.0.2.2:3333/api/1.0.0/location/' + this.state.location_id + '/review/' + this.state.review_id + '/photo?timestamp=' + Date.now()}}/>