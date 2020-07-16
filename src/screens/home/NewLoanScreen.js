import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, Modal } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
// import { Appbar, TextInput, Button, withTheme } from 'react-native-paper';
import { Button, Form, Header, Body, Left, Title, Right, Icon, Content, Input, Label, Item, Toast } from 'native-base';
import Slider from '@react-native-community/slider'
import CustomText from '../../components/CustomText';
import { resWidth, resHeight, resFont, getBankCode } from '../../utils/utils';
import { loanApiURL, requestWithToken } from '../../utils/request';
import { getUser } from '../../utils/storage';
import Loader from '../../components/Loader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';

class NewLoanScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: '',
            duration: 2,
            isApplying: false,
            isLoading: false,
            loanOffer: null,
            applicationSuccess: false,
        }
    }

    _handleLoanApply = () => {
        const url = `${loanApiURL}calculate-repayment`;
        const loan = {
            amount: this.state.amount,
            tenor: this.state.duration
        }
        // console.log(loan)
        const options = {
            method: 'POST',
            body: JSON.stringify(loan),
        }
        this.setState({ isApplying: true })
        requestWithToken(url, options).then((data) => {
            this.setState({ isApplying: false })
            if (data.status === 'success') {
                // console.log(data);
                this.setState({ loanOffer: data })
            } else {
                alert(data.message ? data.message : 'An error has occured. Try again later')
            }
        }).catch((error) => {
            this.setState({ isApplying: false })
            // console.log(error)
        })
    }


    _handleGoBack = () => {
        this.setState({ loanOffer: null })
    }

    _handleAcceptLoan = async () => {
        const url = `${loanApiURL}apply`;
        const user = await getUser();
        if (user) {
            const userObj = JSON.parse(user)
            // // console.log(userObj);
            const loanData = {
                firstname: userObj.borrower_firstname,
                lastname: userObj.borrower_lastname,
                gender: userObj.borrower_gender,
                title: userObj.borrower_title,
                email: userObj.borrower_email,
                telephone: userObj.borrower_mobile,
                house_address: userObj.borrower_address,
                city: userObj.borrower_city,
                state: userObj.borrower_province,
                place_of_work: userObj.borrower_business_name,
                ippisnumber: userObj.custom_field_1135,
                salary_bank_account: getBankCode(userObj.custom_field_1168.toLowerCase()),
                salary_bank_name: userObj.custom_field_1169,
                loan_amount: this.state.amount,
                monthly_repayment: this.state.loanOffer.monthlyrepayment,
                tenor: this.state.duration,
                dob: userObj.borrower_dob
            }

            // console.log(loanData)
            const options = {
                method: 'POST',
                body: JSON.stringify(loanData),
            }
            this.setState({ isLoading: true })
            requestWithToken(url, options).then((data) => {
                this.setState({ isLoading: false })
                if (data.status === 'success') {
                    // console.log(data);
                    this.setState({ applicationSuccess: true })
                }
            }).catch((error) => {
                this.setState({ isLoading: false })
                this.setState({ applicationSuccess: false })
                // console.log(error)
            })
        }
    }
    formatAsCurrency = (value) => {
        const newvalue = Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return `₦${newvalue}`
    }

    render() {
        const { amount, duration, isApplying, loanOffer, isLoading, applicationSuccess } = this.state
        const { visible, hideNewLoanModal } = this.props;
        return (
            <View
                style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, backgroundColor: '#fff', width: resWidth(90), alignSelf: 'center' }}>
                    {/* <Appbar.Header statusBarHeight={0} style={{ backgroundColor: '#f5fcff', elevation: 1 }}>
                        <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
                        <Appbar.Content
                            titleStyle={{ textAlign: 'center', fontFamily: 'Baloo-med' }}
                            subtitleStyle={{ textAlign: 'center', fontFamily: 'Baloo-med' }}
                            title="New Loan"
                        />
                        <Appbar.Action />
                    </Appbar.Header> */}
                    <Header transparent style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Left>
                            <Button style={{ paddingLeft: 0 }} transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='close' style={{ fontSize: resFont(20), color: '#000', }} />
                            </Button>
                        </Left>
                        <Body style={{ alignItems: 'flex-end' }}>
                            <Title style={{ fontFamily: 'Baloo2-SemiBold', color: '#000' }}>New Loan</Title>
                        </Body>
                    </Header>
                    <View style={{ flex: 1 }}>
                        {applicationSuccess ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ marginBottom: resHeight(2) }}>
                                    <Ionicons name="checkmark-done" size={resFont(30)} color="#f56b2a" />
                                </View>
                                <CustomText style={{ fontSize: resFont(20), fontFamily: 'Baloo2-SemiBold', textAlign: 'center' }}>Loan Application submitted successfully. Kindly await a response from our team</CustomText>
                            </View>
                        ) : <View>
                                {loanOffer ? (
                                    <View>
                                        <View style={styles.loanofferdetails}>
                                            <View style={styles.loaninforow}>
                                                <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Amount</CustomText>
                                                </View>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{this.formatAsCurrency(amount)}</CustomText>
                                            </View>
                                            <View style={styles.loaninforow}>
                                                <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Duration</CustomText>
                                                </View>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{duration} month(s)</CustomText>
                                            </View>
                                            <View style={styles.loaninforow}>
                                                <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Monthly Repayment</CustomText>
                                                </View>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{this.formatAsCurrency(loanOffer.monthlyrepayment)}</CustomText>
                                            </View>
                                            <View style={styles.loaninforow}>
                                                <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Loan Start Date</CustomText>
                                                </View>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{loanOffer.startdate}</CustomText>
                                            </View>
                                            <View style={styles.loaninforow}>
                                                <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Loan End Date</CustomText>
                                                </View>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{loanOffer.expectedenddate}</CustomText>
                                            </View>
                                            <View style={styles.loaninforow}>
                                                <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Interest per day</CustomText>
                                                </View>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>0.25%</CustomText>
                                            </View>
                                        </View>

                                        <View>
                                            <CustomText style={{ fontFamily: 'Baloo2-SemiBold' }}>
                                                By clicking Start Application, I consent to Credit Wallet obtaining information from relevant third parties as may be necessary, on my employment details, salary payment, loans and other related data, to make a decision on my loan application. I also consent to the loan amounts being deducted from my salary at source before credit to my account and any outstanding loans being recovered automatically from any other accounts linked to me in the case of default
                                    </CustomText>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            {/* <Button
                                                disabled={isLoading}
                                                onPress={this._handleGoBack}
                                                style={{ backgroundColor: isLoading ? 'rgba(0,0,0,0.12)' : '#9b9b9b', marginVertical: resHeight(2), width: '30%', marginHorizontal: resWidth(2) }}
                                                labelStyle={{ textTransform: 'none', fontFamily: 'Baloo2-Medium', color: 'white' }}
                                                mode="contained">
                                                Back
                         </Button> */}
                                            <Button
                                                style={{ marginVertical: resHeight(2), width: '40%', marginHorizontal: resWidth(2), backgroundColor: isLoading ? 'rgba(0,0,0,0.12)' : '#9b9b9b' }}
                                                disabled={isLoading}
                                                onPress={this._handleGoBack}>
                                                <Text style={{textAlign: 'center', width: '100%', textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}> Back </Text>
                                            </Button>
                                            <Button
                                                style={{ marginVertical: resHeight(2), width: '40%', marginHorizontal: resWidth(2), backgroundColor: isLoading ? '#b5b5b5' : '#f56b2a' }}
                                                disabled={isLoading}
                                                onPress={this._handleAcceptLoan}>
                                                <Text style={{textAlign: 'center', width: '100%', textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}> {isLoading ? 'Accepting ...' : 'Accept'}</Text>
                                            </Button>
                                        </View>
                                    </View>) : (
                                        <View>
                                            {/* <View style={{ marginVertical: resHeight(3) }}>
                                                <CustomText style={{ fontFamily: 'Baloo2-SemiBold' }}>
                                                    How much would you like?
                             </CustomText>
                                                <View style={{ marginVertical: resHeight(1) }}>
                                                    <TextInput
                                                        mode="outlined"
                                                        label='Amount'
                                                        style={{ backgroundColor: 'white' }}
                                                        value={amount}
                                                        keyboardType='numeric'
                                                        onChangeText={amount => this.setState({ amount })}
                                                    />
                                                </View>
                                            </View> */}
                                            {/* <View style={{ marginVertical: resHeight(3) }}>
                                                <CustomText style={{ fontFamily: 'Baloo2-SemiBold' }}>
                                                    For how long?
                             </CustomText>
                                                <View style={{ marginVertical: resHeight(1) }}>
                                                    <CustomText style={{
                                                        fontSize: resFont(15),
                                                        textAlign: 'center', fontFamily: 'Baloo2-Medium'
                                                    }}>
                                                        {duration} months
                                                    </CustomText>
                                                    <Slider
                                                        style={{ width: '100%', marginVertical: resHeight(3), height: 40 }}
                                                        minimumValue={2}
                                                        maximumValue={24}
                                                        onValueChange={(duration) => this.setState({ duration })}
                                                        value={duration}
                                                        step={1}
                                                        minimumTrackTintColor="#f56b2a"
                                                        maximumTrackTintColor="#f7971e"
                                                    />
                                                </View>
                                                <Button
                                                    loading={isApplying}
                                                    disabled={isApplying || !amount}
                                                    onPress={this._handleLoanApply}
                                                    style={{ marginVertical: resHeight(2) }}
                                                    contentStyle={styles.button}
                                                    labelStyle={{ textTransform: 'none', fontFamily: 'Baloo2-Medium', color: 'white' }}
                                                    mode="contained">
                                                    Apply for loan
                         </Button>
                                            </View> */}
                                            <Form>
                                               <View style={{marginVertical: resHeight(3)}}>
                                               <CustomText style={{ fontFamily: 'Baloo2-SemiBold' }}>
                                                    How much would you like?
                             </CustomText>
                                                <Item regular style={{ borderRadius: 5, marginVertical: resHeight(1), borderColor: '#000' }}>
                                                    {/* <Icon name='person' style={{ fontSize: resFont(20), color: '#6B818C' }} /> */}
                                                    <Label style={{paddingHorizontal: 10}}>
                                                        <Text style={{ fontSize: resFont(20), color: '#6B818C', fontFamily: 'Baloo2-Bold' }}>₦</Text>
                                                    </Label>
                                                    <Input style={{fontFamily: 'Baloo2-Regular', fontSize: resFont(17) }} value={amount}

                                                        placeholder='Amount'
                                                        keyboardType='numeric'
                                                        onChangeText={amount => this.setState({ amount })} />
                                                </Item>
                                               </View>
                                                <CustomText style={{ fontFamily: 'Baloo2-SemiBold' }}>
                                                    For how long?
                             </CustomText>
                                                <View style={{ marginVertical: resHeight(1) }}>
                                                    <CustomText style={{
                                                        fontSize: resFont(15),
                                                        textAlign: 'center', fontFamily: 'Baloo2-Medium'
                                                    }}>
                                                        {duration} months
                                                    </CustomText>
                                                    <Slider
                                                        style={{ width: '100%', marginVertical: resHeight(3), height: 40 }}
                                                        minimumValue={2}
                                                        maximumValue={24}
                                                        onValueChange={(duration) => this.setState({ duration })}
                                                        value={duration}
                                                        step={1}
                                                        minimumTrackTintColor="#f56b2a"
                                                        maximumTrackTintColor="#f7971e"
                                                    />
                                                </View>
                                                <Button
                                                    block
                                                    style={{ marginTop: resHeight(3), backgroundColor: isApplying || !amount ? '#b5b5b5' : '#f56b2a' }}
                                                    disabled={isApplying || !amount}
                                                    onPress={this._handleLoanApply}>
                                                    <Text style={{ textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{isApplying ? 'Applying ...' : 'Apply'}</Text>
                                                </Button>
                                            </Form>
                                        </View>
                                    )}
                            </View>}
                        <View />
                    </View>
                </View>
            </View>
        )
    }
}

export default NewLoanScreen

const styles = StyleSheet.create({
    loaninforow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: resHeight(.5)
    },
    loanofferdetails: {
        borderTopWidth: .3,
        borderColor: '#f56b2a',
        borderBottomWidth: .3,
        marginVertical: resHeight(2)
    },
    button: {
        height: resHeight(6)
    }
})