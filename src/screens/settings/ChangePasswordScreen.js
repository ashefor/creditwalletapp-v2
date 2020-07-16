import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
// import { Appbar, TextInput, Button, withTheme , TouchableRipple, Snackbar} from 'react-native-paper';
import { resWidth, resHeight, resFont } from '../../utils/utils';
import { apiURL, request, requestWithToken } from '../../utils/request';
import { Button, Form, Header, ListItem, List, Body, Left, Title, Right, Icon, Content, Input, Label, Item } from 'native-base';
import Loader from '../../components/Loader';
import { setToken, setUser } from '../../utils/storage';
import CustomText from '../../components/CustomText';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';



class ChangePasswordScreen extends Component {
    state = {
        oldPassword: '',
        newPassword: '',
        isLoading: false,
        errorMsg: null,
        visible: false,
    };

    _onDismissSnackBar = () => this.setState({ visible: false });
    handleChangePassword = () => {
        this.setState({
            errorMsg: null
        })
        const url = `${apiURL}password/change`;
        const data = {
            oldpassword: this.state.oldPassword,
            newpassword: this.state.newPassword
        }
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
        }
        if (!this.state.oldPassword) {
            return alert('Enter password')
        } else if (!this.state.newPassword) {
            return alert('Enter new password')
        } else {
            Keyboard.dismiss()
            this.setState({ isLoading: true })
            requestWithToken(url, options).then(data => {
                this.setState({ isLoading: false }, () => {
                    this.setState({ visible: true })
                    this.props.navigation.goBack();
                });
                console.log(data)
            }).catch(error => {
                this.setState({ isLoading: false, errorMsg: error.message })
                console.log(error)
            })
        }

    }
    render() {
        const { visible, oldPassword, newPassword, isLoading, errorMsg } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, width: resWidth(90), alignSelf: 'center' }}>
                    <Header transparent style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Left>
                            <Button style={{ paddingLeft: 0 }} transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' style={{ fontSize: resFont(20), color: '#000', }} />
                            </Button>
                        </Left>
                        <Body style={{ alignItems: 'flex-end' }}>
                            <Title style={{ fontFamily: 'Baloo2-SemiBold', color: '#000' }}>Change Password</Title>
                        </Body>
                    </Header>
                    {/* <Loader isLoading={isLoading}/> */}
                    <TouchableWithoutFeedback style={{ backgroundColor: 'red' }} onPress={() => Keyboard.dismiss()}>
                        <View style={{ flex: 1 }}>
                            <View style={{ marginTop: resHeight(1) }}>
                                <CustomText style={{ textAlign: 'left', fontSize: resFont(20), fontFamily: 'Baloo2-Bold', color: '#f56b2a' }}>Change your password</CustomText>
                                <CustomText style={{ textAlign: 'left', fontSize: resFont(13), fontFamily: 'Baloo2-Regular' }}>Change your Account Password</CustomText>
                                {errorMsg && <CustomText style={{ textAlign: 'center', color: 'red', marginVertical: resHeight(1) }}>{errorMsg}</CustomText>}
                                <Form>
                                    <Item regular style={{ borderRadius: 5, marginTop: resHeight(3), borderColor: '#000' }}>
                                        <Input style={{ fontFamily: 'Baloo2-Regular', fontSize: resFont(17) }} value={oldPassword}
                                            autoCapitalize='none'
                                            secureTextEntry
                                            returnKeyType='done'
                                            placeholder='Old Password'
                                            onChangeText={oldPassword => this.setState({ oldPassword })} />
                                    </Item>
                                    <Item regular style={{ borderRadius: 5, marginTop: resHeight(3), borderColor: '#000' }}>
                                        <Input style={{ fontFamily: 'Baloo2-Regular', fontSize: resFont(17) }} value={newPassword}
                                            autoCapitalize='none'
                                            secureTextEntry
                                            returnKeyType='done'
                                            placeholder='New Password'
                                            onChangeText={newPassword => this.setState({ newPassword })} />
                                    </Item>
                                    <Button
                                        block
                                        style={{ marginTop: resHeight(3), backgroundColor: isLoading ? '#b5b5b5' : '#f56b2a' }}
                                        disabled={isLoading}
                                        onPress={this.handleChangePassword}>
                                        <Text style={{ textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{isLoading ? 'Changing ...' : 'Change Password'}</Text>
                                    </Button>
                                </Form>

                            </View>
                            {/* <Snackbar
                            visible={visible}
                            onDismiss={this._onDismissSnackBar}
                            action={{
                                label: 'Okay',
                                onPress: () => {
                                    // Do something
                                },
                            }}
                        >
                            Changed successfully
                            </Snackbar> */}
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </View>


        )
    }
}

export default ChangePasswordScreen;
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
    textboxfieldd: {
        fontFamily: 'Baloo'
    }
});