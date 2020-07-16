/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import Deeplinking from 'react-native-deep-linking'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Linking,
  AppState,
  Alert,
} from 'react-native';
import AppNavigation from './src/utils/Navigator';
import navigationservice from './src/utils/navigationservice';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import CustomSafeAreaView from './src/components/CustomSafeAreaView';
const App = () => {
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
   Linking.addEventListener('url', (data) => {
     handleUrl(data.url)
   })
  //  navigationservice.navigate('Loans')
   
   Linking.getInitialURL().then(data => handleUrl(data));
  //  const route = 'https://apply.creditwallet.ng/#/liquidate/2270'.replace(/.*?:\/\//g, '');
  //  console.log(route)

  }, []);

  const handleUrl = (url) => {
   if(url != null) {
    const route = url.replace(/.*?:\/\//g, '');
    const routes = route.split('/')
    // console.log(routes)
    const routeName = routes[2]
    const id = routes[3]
    if(routeName == 'liquidate') {
      navigationservice.navigate('Loan Liquidate', {loan_id : id})
    }
   }
  }
 
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <CustomSafeAreaView style={{backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
      <AppNavigation ref={navref => navigationservice.setTopLevelNavigator(navref)}/>
      </View>
      </CustomSafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'red',
    flex: 1
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
