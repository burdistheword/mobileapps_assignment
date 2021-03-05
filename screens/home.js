import React, { Component } from 'react';
import FeedScreen from './feed';
import FindScreen from './find';
import NearbyScreen from './nearby'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Find" component={FindScreen} />
        <Tab.Screen name="Nearby" component={NearbyScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeScreen;
