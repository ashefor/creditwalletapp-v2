import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LoanStack from './LoanStack';
import HomeStack from './HomeStack';
import SettingStack from './SettingStack';
// import MainHomeStack from './MainHomeStack';

const TabNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<AntDesign name='home' size={20} color={tintColor}/>),
        },
        path: 'home'
    },
    Loans: {
        screen: LoanStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<AntDesign name='creditcard' size={20} color={tintColor}/>),
            // tabBarVisible: false,
        },
        path: 'loans'
    },
    Settings: {
        screen: SettingStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<AntDesign name='setting' size={20} color={tintColor}/>)
        }
    },
}, {
    defaultNavigationOptions: {
        tabBarOptions: {
            activeTintColor: '#f56b2a',
            style: {
                backgroundColor: '#fff'
            }
        },
    }
})

export default TabNavigator