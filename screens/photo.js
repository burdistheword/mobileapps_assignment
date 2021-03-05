import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ToastAndroid, Image, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNCamera } from 'react-native-camera';

class Photo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            image: [],
            imagePassed: false,
            review_id: 0
        }
    }

    componentDidMount() {

        this.focus = this.props.navigation.addListener('focus', async () => {
            const value = await AsyncStorage.getItem('@session_token')
            if (value == null) {
                this.props.navigation.navigate('Login')
            }
            else {
                const review_id = this.props.route.params.review_id;
                this.setState({ review_id: review_id })
            }
        });
    }
    componentWillUnmount() {
        this.focus();
    }

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                >
                    {({ camera }) => {
                        return (
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                                    <Text style={{ fontSize: 14 }}> SNAP </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                </RNCamera>
            </View>
        );
    }


    takePicture = async function (camera) {
        const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        this.setState({ url: data.url })
        this.setState({ image: data })
        this.setState({ imagePassed: true })
        this.props.navigation.navigate("EditReview", { image: data, url: data.uri, previous_review_id: this.state.review_id })
        console.log(data.uri);
    };


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});


export default Photo;
