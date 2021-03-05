import React, { Component } from 'react';
import Login from './login';
import Signup from './signup';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

class LoginStack extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={Signup} options={{
                    headerStyle: {
                        backgroundColor: '#a37351',
                    },
                    title: ''
                }} />
            </Stack.Navigator>
        );

    }
}

export default LoginStack;