import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard, ScrollView } from 'react-native'
import { Button, Form, Header, Body, Left, Title, Right, Icon, Content, Input, Label, Item, Toast } from 'native-base';
import { resWidth, resHeight, resFont } from '../../utils/utils';
import { apiURL, request } from '../../utils/request';
import Loader from '../../components/Loader';
import { setToken, setUser } from '../../utils/storage';
import CustomText from '../../components/CustomText';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'



class LoginScreen extends Component {
    state = {
        username: '',
        password: '',
        isLoading: false,
        errorMsg: null
    };

    componentDidMount() {
        console.log(this.props.navigation.dangerouslyGetParent().state.routes)
    }
    handleLogin = () => {
        this.setState({
            errorMsg: null
        })
        const url = `${apiURL}login`;
        const user = {
            username: this.state.username,
            password: this.state.password
        }
        const options = {
            method: 'POST',
            body: JSON.stringify(user),
        }
        if (!this.state.username) {
            return alert('Enter username')
        } else if (!this.state.password) {
            return alert('Enter password')
        } else {
            Keyboard.dismiss()
            this.setState({ isLoading: true })
            request(url, options).then(data => {
                this.setState({ isLoading: false });
                setToken(data.token);
                setUser(data.customer);
                this.props.navigation.navigate('Main')
                // console.log(data)
            }).catch(error => {
                this.setState({ isLoading: false, errorMsg: error.message })
                // console.log(error)
            })
        }

    }
    render() {
        const { username, password, isLoading, errorMsg } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#f5fcff' }}>
                <View style={{ flex: 1, width: resWidth(90), alignSelf: 'center' }}>
                    <Header transparent style={{paddingLeft: 0, paddingRight: 0}}>
                        <Left>
                            <Button style={{paddingLeft: 0}} transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' style={{ fontSize: resFont(20), color: '#000',  }} />
                            </Button>
                        </Left>
                        <Body style={{alignItems: 'flex-end'}}>
                            <Title style={{ fontFamily: 'Baloo2-Medium', color: '#000' }}>Login</Title>
                        </Body>
                    </Header>
                    {/* <Loader isLoading={isLoading} backgroundColor="'rgba(247, 247, 247, .3)'"/> */}
                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} keyboardDismissMode='interactive'>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginTop: resHeight(1) }}>
                                <CustomText style={{ textAlign: 'left', fontSize: resFont(20), fontFamily: 'Baloo2-Bold', color: '#f56b2a' }}>Hi, Welccome Back</CustomText>
                                <CustomText style={{ textAlign: 'left', fontSize: resFont(13), fontFamily: 'Baloo2-Regular' }}>Kindly provide your username and password to access your account</CustomText>
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
                                    <Item regular style={{ borderRadius: 5, marginTop: resHeight(3), borderColor: '#000' }}>
                                        <Icon name='lock-closed' style={{ fontSize: resFont(20), color: '#6B818C' }} />
                                        <Input style={{ fontFamily: 'Baloo2-Regular', fontSize: resFont(17) }} value={password}
                                            autoCapitalize='none'
                                            returnKeyType='done'
                                            placeholder='Password'
                                            secureTextEntry
                                            onChangeText={password => this.setState({ password })} />
                                    </Item>
                                    <Button
                                        block
                                        style={{ marginTop: resHeight(3), backgroundColor: isLoading ? '#b5b5b5' : '#f56b2a' }}
                                        disabled={isLoading}
                                        onPress={this.handleLogin}>
                                        <Text style={{ textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{isLoading ? 'Logging in ...' : 'Login'}</Text>
                                    </Button>
                                </Form>

                                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Forgot Password')} style={{ marginTop: resHeight(2), paddingVertical: 3 }}>
                                    <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Forgot Password</CustomText>
                                </TouchableWithoutFeedback>

                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>


        )
    }
}

export default LoginScreen


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