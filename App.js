import React, { Component } from 'react';
import { Button, Image, Touchable, TouchableOpacity } from 'react-native';
import LoginStack from './screens/loginStack';
import Home from './screens/home';
import Profile from './screens/profile';
import EditProfile from './screens/editprofile';
import Location from './screens/location';
import AddReview from './screens/addreview';
import Review from './screens/review';
import EditReview from './screens/editreview'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent }  from './screens/drawercontent';


//import Icon from 'react-native-vector-icons/Ionicons';  


const Drawer = createDrawerNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="LoginStack" drawerContent={props => <DrawerContent { ...props } />}>
          <Drawer.Screen name="LoginStack" component={LoginStack} />
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen name="EditProfile" component={EditProfile}/>
          <Drawer.Screen name="Location" component={Location}/>
          <Drawer.Screen name="AddReview" component={AddReview}/>
          <Drawer.Screen name="Review" component={Review}/>
          <Drawer.Screen name="EditReview" component={EditReview}/>
        </Drawer.Navigator>
      </NavigationContainer>

    );
  }

}
export default App;

// drawerContent={props => <DrawerContent { ...props } />}
