import React, { Component } from 'react';
import { Text, View, Button,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component{

  constructor(props){
    super(props);

    this.state={
        first_name:'',
        last_name:'',
        email:'',
        isLoading: true
    }
}

  async componentDidMount() {
  this.focus = this.props.navigation.addListener('focus', async ()=> {
    this.setState({isLoading:true})
    const first_name = JSON.parse(await AsyncStorage.getItem('@first_name'))
    const last_name = JSON.parse(await AsyncStorage.getItem('@last_name'))
    const email = JSON.parse(await AsyncStorage.getItem('@email'))
    console.log(first_name,last_name,email)
    this.setState({first_name:first_name})
    this.setState({last_name:last_name})
    this.setState({email:email})
    this.setState({isLoading:false})
    console.log(this.state.first_name,this.state.last_name,this.state.email)
  });
  }

  componentWillUnmount(){
    this.focus();
  }

  render(){
    if(this.state.isLoading){
      return (<View>
        <Text>Loading</Text>
      </View>)
    }
    else {
    return(
        <View>
          <Text>{this.state.first_name}</Text>
          <Text>{this.state.last_name}</Text>
          <Text>{this.state.email}</Text>
          <Button title='Edit'onPress={()=>this.props.navigation.navigate('EditProfile')}/>
        </View>
    );
    }
  }
}

export default Profile;