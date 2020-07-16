import React, { Component } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from 'react-navigation';
import CustomText from '../../components/CustomText';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button, Header, ListItem, List, Body, Left, Title, Right, Icon } from 'native-base';
import { resWidth, resFont, resHeight } from '../../utils/utils';
import { signOut } from '../../utils/storage';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';

class SettingScreen extends Component {

    _handleSignOut = () => {

    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, alignSelf: 'center', width: resWidth(90) }}>
                    <Header transparent style={{ paddingLeft: 0, paddingRight: 0 }}>
                       
                        <Body style={{ alignItems: 'center' }}>
                            <Title style={{ fontFamily: 'Baloo2-SemiBold', color: '#000' }}>Settings</Title>
                        </Body>
                    </Header>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <ListItem onPress={() => this.props.navigation.navigate('Change Password')} style={{ paddingLeft: 0, marginLeft: 0, marginVertical: 5 }} icon>
                            <Left>
                                <Button style={{ backgroundColor: "#FF9501" }}>
                                    <Icon active name="lock-closed" />
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'Baloo2-Medium', fontSize: resFont(17) }}>Change passsword</Text>
                            </Body>
                            <Right>
                                <Icon active name="chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem style={{ paddingLeft: 0, marginLeft: 0 }} icon onPress={() => signOut()}>
                            <Left>
                                <Button style={{ backgroundColor: "red" }}>
                                    <Icon active name="exit" />
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{ fontFamily: 'Baloo2-Medium', fontSize: resFont(17) }}>Sign Out</Text>
                            </Body>
                            <Right>
                                <Icon active name="chevron-forward" />
                            </Right>
                        </ListItem>
                    </ScrollView>

                </View>
            </View>
        )
    }
}

export default SettingScreen