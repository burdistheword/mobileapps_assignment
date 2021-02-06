import React, { Component } from 'react';
import HomeScreen from './home';
import Profile from './profile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent }  from './drawercontent';

const Drawer = createDrawerNavigator();

class HomeNav extends Component{
render(){
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent { ...props } />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Profile" component={Profile} />
        </Drawer.Navigator>
    ); 
 
}
}


export default HomeNav;