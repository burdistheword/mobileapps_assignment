import React, { Component } from 'react';
import HomeScreen from './screens/home';
import Login from './screens/login';
import Signup from './screens/signup';
import Profile from './screens/profile';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class App extends Component{
 render(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Profile" component={Profile}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  
}
export default App;