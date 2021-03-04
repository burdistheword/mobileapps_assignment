import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar, TextInput, Button, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Rating, AirbnbRating } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Find extends Component {

    constructor(props) {
        super(props);

        this.state = {
            q: '',
            overall_rating: 0,
            price_rating: 0,
            quality_rating: 0,
            clenliness_rating: 0,
            search_in: '',
            limit: 0,
            offset: -5,
            locations: [],
            totalLocations: 0,
            isLoading: true,
            selectedLanguage: '',
            setSelectedLanguage: ''
        }

    }

    async componentDidMount() {
        this.focus = this.props.navigation.addListener('focus', async () => {
        this.getData('http://10.0.2.2:3333/api/1.0.0/find?' + 'limit=' + 5)
        //this.setState({ totalLocations: this.state.locations.length})
        });

    }

    componentWillUnmount(){
        this.focus();
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
        if (this.state.locations.length == 0) {
            ToastAndroid.show('No results found', ToastAndroid.SHORT)
            this.getData('http://10.0.2.2:3333/api/1.0.0/find')
            this.setState({offset:0})
        }
        else {
            this.flatListRef.scrollToIndex({ index: 0 });
            let url = 'http://10.0.2.2:3333/api/1.0.0/find?'

            console.log(this.state.q);
            console.log(this.state.overall_rating);

            if (this.state.q != '') {
                url += 'q=' + this.state.q + '&';
            }

            if (this.state.overall_rating > 0) {
                url += 'overall_rating=' + this.state.overall_rating + '&';
            }

            if (this.state.price_rating > 0) {
                url += 'price_rating=' + this.state.price_rating + '&';
            }

            if (this.state.quality_rating > 0) {
                url += 'quality_rating=' + this.state.quality_rating + '&';
            }

            if (this.state.clenliness_rating > 0) {
                url += 'clenliness_rating=' + this.state.clenliness_rating + '&';
            }

            if (this.state.selectedLanguage == 'favourite') {
                url += 'search_in=' + this.state.selectedLanguage + '&';
            }

            if (this.state.selectedLanguage == 'reviewed') {
                url += 'search_in=' + this.state.selectedLanguage + '&';
            }

            url += 'limit=' + 5 + '&';
            url += 'offset=' + this.state.offset + '&';

            this.setState({ offset: this.state.offset + 5 })
            this.getData(url);
        }
    }

    pagination = () => {
        
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
                    <Picker
                        selectedValue={this.state.selectedLanguage}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ selectedLanguage: itemValue })
                        }>
                        <Picker.Item label="None" value="none" />
                        <Picker.Item label="Favourites" value="favourite" />
                        <Picker.Item label="Reviewed" value="reviewed" />
                    </Picker>
                    <Button title="Search" onPress={() => this.search()} />
                    <Text>{this.state.offset}</Text>
                    <FlatList
                        data={this.state.locations}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.search}
                        ref={(ref) => { this.flatListRef = ref; }}
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
                                            <AirbnbRating
                                                size={15}
                                                defaultRating={item.avg_price_rating}
                                                showRating={false}
                                                isDisabled={true}
                                            />
                                            <AirbnbRating
                                                size={15}
                                                defaultRating={item.avg_quality_rating}
                                                showRating={false}
                                                isDisabled={true}
                                            />
                                            <AirbnbRating
                                                size={15}
                                                defaultRating={item.avg_clenliness_rating}
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
