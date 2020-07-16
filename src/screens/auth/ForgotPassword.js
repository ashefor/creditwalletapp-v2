import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard, ScrollView } from 'react-native'
import { Button, Form, Header, Body, Left, Title, Right, Icon, Content, Input, Label, Item } from 'native-base';
import { resWidth, resHeight, resFont } from '../../utils/utils';
import { apiURL, request } from '../../utils/request';
import Loader from '../../components/Loader';
import { setToken, setUser } from '../../utils/storage';
import CustomText from '../../components/CustomText';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import CustomSafeAreaView from '../../components/CustomSafeAreaView';



class ForgotPasswordScreen extends Component {
    state = {
        username: '',
        isLoading: false,
        errorMsg: null,
        visible: false,
    };

    handleResetPassword = () => {
        this.setState({
            errorMsg: null
        })
        const url = `${apiURL}password/reset`;
        const user = {
            username: this.state.username,
        }
        const options = {
            method: 'POST',
            body: user,
        }
        if (!this.state.username) {
            return alert('Enter username')
        } else {
            Keyboard.dismiss()
            this.setState({ isLoading: true })
            request(url, options).then(data => {
                this.setState({ isLoading: false });
                this.setState({ visible: true }, () => {
                    this.props.navigation.navigate('Login')
                })
                setToken(data.token);
                // console.log()
                setUser(data.customer);
                // console.log(data)
            }).catch(error => {
                this.setState({ isLoading: false, errorMsg: 'Error connecting to server. Please try again later' })
                console.log(error)
            })
        }

    }


    _onDismissSnackBar = () => this.setState({ visible: false });
    render() {
        const { username, isLoading, errorMsg, visible } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#f5fcff' }}>
                <View style={{ flex: 1, width: resWidth(90), alignSelf: 'center'  }}>
                    <Header transparent style={{paddingLeft: 0, paddingRight: 0}}>
                        <Left>
                            <Button style={{paddingLeft: 0}} transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' style={{ fontSize: resFont(20), color: '#000',  }} />
                            </Button>
                        </Left>
                        <Body style={{alignItems: 'flex-end'}}>
                            <Title style={{ fontFamily: 'Baloo2-Medium', color: '#000' }}>Forgot Password</Title>
                        </Body>
                    </Header>
                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} keyboardDismissMode='interactive'>
                        <View style={{ flex: 1}}>
                            <View style={{ marginTop: resHeight(1) }}>
                                <CustomText style={{ textAlign: 'left', fontSize: resFont(20), fontFamily: 'Baloo2-Bold', color: '#f56b2a' }}>Forgot Password</CustomText>
                                <CustomText style={{ textAlign: 'left', fontSize: resFont(13), fontFamily: 'Baloo2-Regular' }}>Reset your password</CustomText>
                                {errorMsg && <CustomText style={{ textAlign: 'center', fontFamily: 'Baloo2-Regular', color: 'red', marginVertical: resHeight(1) }}>{errorMsg}</CustomText>}
                                <Form>
                                    <Item regular style={{ borderRadius: 5, marginTop: resHeight(3), borderColor: '#000' }}>
                                        <Icon name='person' style={{ fontSize: resFont(20), color: '#6B818C' }} />
                                        <Input style={{ fontFamily: 'Baloo2-Regular', fontSize: resFont(17) }} value={username}
                                            autoCapitalize='none'
                                            returnKeyType='done'
                                            placeholder='Username'
                                            onChangeText={username => this.setState({ username })} />
                                    </Item>
                                    <Button
                                        block
                                        style={{ marginTop: resHeight(3), backgroundColor: isLoading ? '#b5b5b5' : '#f56b2a' }}
                                        disabled={isLoading}
                                        onPress={this.handleResetPassword}>
                                        <Text style={{ textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{isLoading ? 'Resetting ...' : 'Reset Password'}</Text>
                                    </Button>
                                </Form>
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Login')} style={{ marginTop: resHeight(2), paddingVertical: 3  }}>
                                    <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Back to Login</CustomText>
                                </TouchableWithoutFeedback>
                            </View>
                            {/* <Snackbar
                            visible={visible}
                            onDismiss={this._onDismissSnackBar}
                            style={{ backgroundColor: '#f56b2a', color: '#fff' }}
                            action={{
                                label: 'okay',
                                onPress: () => {
                                    // Do something
                                },
                            }}
                        >
                            Password successfully reset
                            </Snackbar> */}
                        </View>
                    </ScrollView>
                </View>
            </View>

        )
    }
}

export default ForgotPasswordScreen;


const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 30
    },
    loginbtn: {
        height: resHeight(5),
        width: resWidth(90)
    },
});