import AsyncStorage from '@react-native-community/async-storage';

import navigationservice from "./navigationservice"


export const setToken = async (token) => {
    await AsyncStorage.setItem('access_token', token);
};

export const getToken = async () => {
    return await AsyncStorage.getItem('access_token');
};

export const setUser = async(details) => {
    await AsyncStorage.setItem('creditWalletUser', JSON.stringify(details));
}

export const getUser = async () => {
    return await AsyncStorage.getItem('creditWalletUser');
};

export const signOut = async() => {
    return await AsyncStorage.clear().then(navigationservice.navigate('Auth'))
}
