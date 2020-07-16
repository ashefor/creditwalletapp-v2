import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native'
import { resHeight, resWidth, resFont } from '../../utils/utils';
import {Button, Thumbnail} from 'native-base'
import OnboardCarousel from '../../components/OnboardCarousel';
import CustomText from '../../components/CustomText';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import CustomSafeAreaView from '../../components/CustomSafeAreaView';

class OnboardScreen extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
           <View style={styles.container}>
                <View style={styles.page}>
               <View style={{flex: 1}}>
               <View style={styles.avatarContainer}>
                    <Thumbnail source={require('../../assets/images/logo.png')} style={{marginHorizontal: resWidth(1), width: 40, height: 40}}/>
                    <CustomText style={{fontSize: resFont(15), fontFamily: 'Baloo2-Bold', marginHorizontal: resWidth(1) }}>Credit Wallet</CustomText>
                </View>
               </View>

               <View style={{flex: 2, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
               <OnboardCarousel />
               </View>
              <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <Button
                block
                style={styles.signpbtn}
                    //  onPress={() => this.props.navigation.navigate('Get Started')}
                     >
                    <Text style={styles.signpbtnText}>Apply for a loan</Text>
                </Button>
                {/* <Button
                labelStyle={{textTransform: 'none', fontSize: 15, fontFamily: 'Baloo-med', color: 'white'}}
                    contentStyle={styles.signpbtn}
                    mode="contained" onPress={() => this.props.navigation.navigate('Offer Letter', { loanid: '28780' })}>
                    Offer Letter
                </Button> */}
                <View style={styles.loginInfo}>
                    <CustomText style={{fontSize: resFont(15), fontFamily: 'Baloo2-Medium', marginRight: resWidth(2) }}>Existing Customer?</CustomText>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Login')}style={styles.loginTxt}>
                        <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>Login</CustomText>
                    </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
           </View>
        )
    }
}

export default OnboardScreen

const styles = StyleSheet.create({
    avatar: {
        marginRight: 5
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    page: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        width: resWidth(90),
        alignSelf: 'center'
        // justifyContent: 'flex-end'
    },
    avatarContainer: {
        marginTop:  resHeight(5),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signpbtn: {
        backgroundColor: '#f56b2a'
    },

    signpbtnText: {
        textTransform: 'none', 
        fontSize: resFont(14), 
        fontFamily: 'Baloo2-Medium', 
        color: 'white',
    },
    loginInfo: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        textAlign: 'center',
        marginVertical: resHeight(2)
    },
    loginTxt: {
        // fontSize: resFont(50),
        // marginLeft: resWidth(30)
    }
})