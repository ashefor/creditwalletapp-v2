import React, { Component, Fragment } from 'react';
import { SafeAreaView, View, StyleSheet, RefreshControl, ScrollView, TouchableWithoutFeedback, Text} from 'react-native';

// import { Appbar, List, Text, Divider, Surface, Paragraph, ToggleButton, withTheme } from 'react-native-paper';
import CustomText from '../../components/CustomText';
import { resWidth, resHeight, resFont } from '../../utils/utils';
import RBSheet from "react-native-raw-bottom-sheet";
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { apiURL, requestWithToken } from '../../utils/request';
import Loader from '../../components/Loader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import {Header, Left, Card, Body, Title, Icon, Button } from 'native-base';


class LiquidateLoan extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            paymentType: 'transfer',
            loan_id: this.props.navigation.getParam('loan_id'),
            returnUrl: this.props.navigation.getParam('returnUrl'),
            loan: null,
            isLoading: false,
            refreshing: false,
            hasError: null
            // returnRoute: this.props.navigation.getParam('screen'),
        }
    }
    setPaymentType = (type) => {
        // console.log(type)
        if (type === 1) {
            this.setState({ paymentType: 'transfer' })
        } else {
            this.setState({ paymentType: 'deposit' })
        }
    }
    componentDidMount = () => {
        this._isMounted = true;
        console.log(this.state.returnUrl)
        this.loadLoanDetails(true)
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    _onrefresh = () => {
        this.setState({ refreshing: true })
        this.loadLoanDetails(false).then(() => {
            this.setState({ refreshing: false })
        })
    }
    loadLoanDetails = (value) => {
        const url = `${apiURL}loan/liquidate`;
        const loan_id = {
            loan_id: this.state.loan_id
        }
        const options = {
            method: 'POST',
            body: JSON.stringify(loan_id),
        }
       if(this._isMounted) {
        this.setState({ isLoading: value })
        return new Promise((resolve, reject) => {
            requestWithToken(url, options).then(data => {
                this.setState({ isLoading: false })
                if (data.status === 'success') {
                    // console.log(data)
                    this.setState({ loan: data })
                } else {
                    alert(data.message ? data.message : 'An error has occured. Try again later')
                }
                resolve()
            }).catch(error => {
                console.log(error);
                this.setState({ isLoading: false })
                this.setState({ hasError: error.message ? error.message : 'An error has occured'  })
                // reject()
            })
        })
       }
    }

    formatAsCurrency = (value) => {
        const newvalue = Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return `₦${newvalue}`
    }
    render() {
        const { paymentType, isLoading, loan, refreshing, hasError, returnUrl } = this.state;
        const { closeModal, loan_id } = this.props
        return (
            <View style={{flex: 1, backgroundColor: '#fff' }}>
               <View style={{flex: 1, width: resWidth(90), alignSelf: 'center'}}>
               <Loader isLoading={isLoading} />
               <Header transparent style={{paddingLeft: 0, paddingRight: 0}}>
                        <Left>
                            <Button style={{paddingLeft: 0}} transparent onPress={() => this.props.navigation.navigate(returnUrl? returnUrl : 'Home')}>
                                <Icon name='arrow-back' style={{ fontSize: resFont(20), color: '#000',  }} />
                            </Button>
                        </Left>
                        <Body style={{alignItems: 'flex-end'}}>
                            <Title style={{ fontFamily: 'Baloo2-SemiBold', color: '#000' }}>{`Liquidate ${loan? loan.transaction_reference : ''}`}</Title>
                        </Body>
                    </Header>
                {hasError && <Fragment>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CustomText style={{ marginVertical: 10, fontFamily: 'Baloo2-Regular' }}>{hasError}</CustomText>
                        <Button small style={{alignItems: 'center', paddingHorizontal: 10}} onPress={() => this.loadLoanDetails(true)}>
                            {/* <Icon name='reload'/> */}
                            <Text style={{ color: 'white', textTransform: 'capitalize' }}>reload</Text>
                        </Button>
                    </View>
                </Fragment>}
                {loan && <Fragment>
                    <ScrollView
                        refreshControl={
                            <RefreshControl onRefresh={this._onrefresh} refreshing={refreshing} />
                        }
                        showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ paddingTop: resHeight(2), width: resWidth(90), alignSelf: 'center' }}>
                            <CustomText style={{ textAlign: 'center', fontFamily: 'Baloo2-Medium', color: '#f56b2a' }}>
                                Loan Liquidation Details as at today {new Date(Date.now()).toDateString()}
                    </CustomText>
                            <View style={{ marginVertical: resHeight(1) }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Loan Amount</CustomText>

                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.loan_amount)}</CustomText>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Total Interest Due</CustomText>
                                        <CustomText style={{ color: "gray", fontSize: resFont(12), fontFamily: 'Baloo2-Regular' }}>Interest Due as at {new Date(Date.now()).toDateString()}</CustomText>
                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.total_interest_due)}</CustomText>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Admin Fees</CustomText>
                                        <CustomText style={{ color: "gray", fontSize: resFont(12), fontFamily: 'Baloo2-Regular' }}>Insurance + Disbursement Fees</CustomText>
                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.admin_fees)}</CustomText>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Total Paid</CustomText>
                                        <CustomText style={{ color: "gray", fontSize: resFont(12), fontFamily: 'Baloo2-Regular' }}>Total Paid as at May 17, 2020</CustomText>
                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.totalpaid)}</CustomText>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Loan Balance</CustomText>
                                        <CustomText style={{ color: "gray", fontSize: resFont(12), fontFamily: 'Baloo2-Regular' }}>(LOAN AMOUNT + TOTAL INTEREST DUE + ADMIN FEES) - TOTAL PAID</CustomText>
                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.loan_balance)}</CustomText>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Liquidation Charges</CustomText>
                                        <CustomText style={{ color: "gray", fontSize: resFont(12), fontFamily: 'Baloo2-Regular' }}>5% of loan balance</CustomText>
                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.liquidation_charges)}</CustomText>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <View style={{ alignItems: 'flex-start', width: '70%' }}>
                                        <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium' }}>Liquidation Amount</CustomText>
                                        <CustomText style={{ color: "gray", fontSize: resFont(12), fontFamily: 'Baloo2-Regular' }}>Amount to pay to clear off this loan</CustomText>
                                    </View>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.liquidation_amount)}</CustomText>
                                </View>
                            </View>
                            <CustomText style={{ fontFamily: 'Baloo2-Bold', fontSize: resFont(12) }}>
                                Please note that the amount stated above is the liquidation payment due as at today {new Date(Date.now()).toDateString()} and subject to change if payment is not made within 24 hours.
                    </CustomText>

                            <CustomText style={{ marginTop: resHeight(2), fontFamily: 'Baloo2-Bold', fontSize: resFont(12) }}>Please include the unique code 'LCW1002297-02' in the Payment narration /description.
                    </CustomText>
                        </View>
                    </ScrollView>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Button style={{marginBottom: 10}} transparent light block onPress={() => this.RBSheet.open()}>
                            <Text style={{ color: '#f56b2a', fontSize: resFont(20), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Show Account Details</Text>
                        </Button>
                        {/* <TouchableWithoutFeedback onPress={() => this.RBSheet.open()} style={{ marginVertical: resHeight(2), paddingVertical: 3 }}>
                                    <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Show Account Details</CustomText>
                                </TouchableWithoutFeedback> */}
                        <RBSheet
                            closeOnDragDown={true}
                            ref={ref => {
                                this.RBSheet = ref;
                            }}
                            height={resHeight(30)}
                            openDuration={250}
                            customStyles={{
                                container: {
                                    //   justifyContent: "center",
                                    //   alignItems: "center"
                                }
                            }}
                        >
                            <View style={{ width: resWidth(90), alignSelf: 'center', justifyContent: 'center' }}>
                                <View style={{ display: 'flex', marginTop: resHeight(1), flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Card style={styles.surface}>
                                        <Body>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.setPaymentType(1)}
                                        >
                                           <View  style={[styles.paymentCard,
                                            { backgroundColor: this.state.paymentType === 'transfer' ? '#f56b2a' : '#f5fcff' }]}>
                                           <Text style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium', textAlign: 'center', color: paymentType === 'transfer' ? 'white' : '#39393A' }}>Bank Transfer</Text>
                                           </View>
                                        </TouchableWithoutFeedback>
                                        </Body>
                                    </Card>

                                    <Card style={styles.surface}>
                                       <Body>
                                       <TouchableWithoutFeedback
                                            
                                            onPress={() => this.setPaymentType(2)}
                                        >
                                            <View style={[styles.paymentCard, { backgroundColor: paymentType === 'deposit' ? '#f56b2a' : '#f5fcff' }]}>
                                            <Text style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Medium', textAlign: 'center', color: paymentType === 'deposit' ? 'white' : '#39393A' }}>Cash Deposit</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                       </Body>
                                    </Card>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Account Name</CustomText>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{paymentType === 'deposit' ? 'Princeps Credit Systems' : 'Credit Wallet-Atiku Attahiru'}</CustomText>
                                    </View>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Account No.</CustomText>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{paymentType === 'deposit' ? '0102877545' : '9915335025'}</CustomText>
                                    </View>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(.5) }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Bank</CustomText>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{paymentType === 'deposit' ? 'Union Bank Of Nigeria Plc.' : 'Providus Bank'}</CustomText>
                                    </View>
                                </View>
                            </View>
                        </RBSheet>
                    
                    </View>
               
                </Fragment>}
           
               </View>
            </View>
        
        )
    }
}

export default LiquidateLoan;

const styles = StyleSheet.create({
    surface: {
        height: resHeight(10),
        width: resWidth(30),
        //   backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        borderRadius: 10,
        //   marginHorizontal: resWidth(10)
    },
    paymentCard: {
        width: resWidth(30),
        borderRadius: 10,
        // backgroundColor: 'black', 
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});