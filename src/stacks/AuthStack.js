import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import OnboardScreen from '../screens/auth/OnboardScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword';

const AuthStack = createStackNavigator({
    'Onboard' : {
        screen: OnboardScreen,
        navigationOptions: {
            headerTransparent: true,
            headerShown: false
        }
    },
    'Login' : {
        screen: LoginScreen,
        navigationOptions: {
            headerTransparent: true,
            headerShown: false
        }
    },
    'Forgot Password' : {
        screen: ForgotPasswordScreen,
        navigationOptions: {
            headerTransparent: true,
            headerShown: false
        }
    }
}, {
    initialRouteName: 'Onboard',
    mode: 'card',
})

export default AuthStack