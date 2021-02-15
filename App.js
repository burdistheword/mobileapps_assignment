import React, { Component } from 'react';
import { Button, Image, Touchable, TouchableOpacity } from 'react-native';
import LoginStack from './screens/loginStack';
import Home from './screens/home';
import Profile from './screens/profile';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent }  from './screens/drawercontent';

//import Icon from 'react-native-vector-icons/Ionicons';  

function LogoTitle(props) {
  return (
    <TouchableOpacity onPress={() => {
      console.log(props)
      props.navigation.Drawer()
    }
    }
    >
      <Image
        style={{ width: 50, height: 50 }}
        source={require('./screens/photos/Hamburger_icon.svg.png')}
      />
    </TouchableOpacity>

  );
}

function Test() {
  console.log("Hello")
}

const Drawer = createDrawerNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="LoginStack" drawerContent={props => <DrawerContent { ...props } />}>
          <Drawer.Screen name="LoginStack" component={LoginStack} />
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
      </NavigationContainer>

    );
  }

}
export default App;

// drawerContent={props => <DrawerContent { ...props } />}
