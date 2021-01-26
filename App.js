import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class App extends Component{


  sayHello = () => {
    console.log("Hello");
    return fetch('http://api.icndb.com/jokes/random')
      .then((res) => res.json())
      .then((rjson) => {
        console.log(rjson)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  render(){
    return (
      <View>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Button title="Hello" onPress={this.sayHello} />
      </View>
    );
  }
}

export default App;