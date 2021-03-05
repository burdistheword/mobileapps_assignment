import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, FlatList, StyleSheet, StatusBar, TextInput, Button, ToastAndroid,ActivityIndicator } from 'react-native';
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
            offset: 0,
            offsetPrevious: 0,
            locations: [],
            totalLocations: [],
            isLoading: true,
            isLoading2: true,
            selectedLanguage: '',
            setSelectedLanguage: '',
            url_total: '',
            searched: false,
            remainder: 0,
        }

    }

    async componentDidMount() {
        this.focus = this.props.navigation.addListener('focus', async () => {
            this.getTotalLocations('http://10.0.2.2:3333/api/1.0.0/find?')
            this.getData('http://10.0.2.2:3333/api/1.0.0/find?' + 'limit=' + 5)
        });

    }

    componentWillUnmount() {
        this.focus();
    }

    getData = async (url) => {
        this.setState({ isLoading: true })
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
                    console.log(this.state.locations)
                    this.setState({ isLoading: false })
                    if (this.state.searched) {
                        this.getTotalLocations(this.state.url_total);
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

    getTotalLocations = async (url) => {
        this.setState({ isLoading2: true })
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
                    this.setState({ totalLocations: rjson })
                    this.setState({ isLoading2: false })
                    var remainder = ((rjson.length) % (5));
                    this.setState({ remainder: remainder })
                    this.setState({ searched: false })
                    if(rjson.length==0){
                        this.getData('http://10.0.2.2:3333/api/1.0.0/find?' + 'limit=' + 5)
                        ToastAndroid.show('No results found', ToastAndroid.SHORT)
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

    search = () => {

        this.setState({ searched: true })

        let url = 'http://10.0.2.2:3333/api/1.0.0/find?'

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

        this.setState({ offset: 0 })
        this.setState({ url_total: url })
        this.getData(url += 'limit=' + 5 + '&');
        this.flatListRef.scrollToIndex({ index: 0 });
        console.log(this.state.totalLocations.length)
        
    }

    pagination = (input) => {

        if (input == +5) {
            var calc = this.state.offset - this.state.remainder
            console.log('length ', this.state.totalLocations.length)
            console.log('offset', this.state.offset)
            console.log(calc)
            if (this.state.offset >= (this.state.totalLocations.length - this.state.remainder)) {
                ToastAndroid.show('No more results', ToastAndroid.SHORT)
            }
            else if ((this.state.totalLocations.length) - (this.state.offset) === input){
                ToastAndroid.show('No more results', ToastAndroid.SHORT)
            }
            else {
                this.setState({ offset: this.state.offset + 5 }, () => {
                    let url = 'http://10.0.2.2:3333/api/1.0.0/find?'
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
                    this.getData(url);
                    this.flatListRef.scrollToIndex({ index: 0 })


                });
            }


        }
        else {

            if (this.state.offset == 0) {
                ToastAndroid.show('No previous results', ToastAndroid.SHORT)
            }
            else {
                this.setState({ offset: this.state.offset - 5 }, () => {
                    let url = 'http://10.0.2.2:3333/api/1.0.0/find?'
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
                    this.getData(url);
                    this.flatListRef.scrollToIndex({ index: 0 });
                });
            }

        }

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
        if (this.state.isLoading || this.state.isLoading2) {
            return (
                <View>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
        else {
            return (
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity onPress={() => { this.props.navigation.toggleDrawer() }}>
                        <Image
                            style={{ width: 25, height: 25 }}
                            source={require('./photos/Hamburger_icon.svg.png')}
                        />
                    </TouchableOpacity>
                    <Text>Search</Text>
                    <TextInput value={this.state.q} onChangeText={(q) => this.setState({ q: q })} />
                    <Text>Overall Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.overall_rating}
                        showRating={false}
                        onFinishRating={(rating) => this.ratingCompleted(rating, 'overall_rating')}
                    />
                    <Text>Price Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.price_rating}
                        showRating={false}
                        onFinishRating={(rating) => this.ratingCompleted(rating, 'price_rating')}
                    />
                    <Text>Quality Rating</Text>
                    <AirbnbRating
                        size={15}
                        defaultRating={this.state.quality_rating}
                        showRating={false}
                        onFinishRating={(rating) => this.ratingCompleted(rating, 'quality_rating')}
                    />
                    <Text>Clenliness Rating</Text>
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
                    <FlatList
                        data={this.state.locations}
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
                    <Button title="Next page" onPress={() => this.pagination(+5)} />
                    <Button title="Previous page" onPress={() => this.pagination(-5)} />
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
