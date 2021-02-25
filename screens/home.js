import React, { Component } from 'react';
import FeedScreen from './feed';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component{

  render(){
    return(
        <Tab.Navigator>
          <Tab.Screen name="Feed" component={FeedScreen}/>
          <Tab.Screen name="Feed2" component={FeedScreen}/>
          <Tab.Screen name="Feed3" component={FeedScreen}/>
          <Tab.Screen name="Feed4" component={FeedScreen}/>
        </Tab.Navigator>
    );
  }
}

export default HomeScreen;
