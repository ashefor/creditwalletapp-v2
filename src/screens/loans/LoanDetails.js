import React, { Component, Fragment } from 'react';
import { View, StyleSheet, SafeAreaView,ScrollView } from 'react-native';
// import { Appbar, Divider, Button, Chip, Portal, Modal } from 'react-native-paper';
import {Header, Body, Button, Title, Left, Badge,Icon, Text} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { resFont, resWidth, resHeight } from '../../utils/utils';
import CustomText from '../../components/CustomText';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import RBSheet from "react-native-raw-bottom-sheet";
import { apiURL, requestWithToken } from '../../utils/request';
import Loader from '../../components/Loader';
// import LiquidateLoan from '../liquidate/LiquidateLoan';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';

class LoanDetails extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            loan_id: this.props.navigation.getParam('loan_id'),
            loan: null,
            isLoading: false,
            loanType: this.props.navigation.getParam('type'),
            visible: false,
            singleLoan: {},
            showLiquidation: false,
            hasError: null
        }
    }

    componentDidMount = () => {
        this._isMounted = true;
        this.getLoanDetails()
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    _showModal = (loan) => {
        this.setState({ singleLoan: loan }, () => {
            this.RBSheet.open()
        })
    };
    _hideModal = () => this.setState({ visible: false });

    getLoanDetails = () => {
        if (this._isMounted) {
            this.setState({ isLoading: true })
            const url = `${apiURL}loan/one`;
            const loan_id = {
                loan_id: this.state.loan_id
            }
            const options = {
                method: 'POST',
                body: JSON.stringify(loan_id),
            }
            requestWithToken(url, options).then(data => {
                this.setState({ isLoading: false })
                if (data.status === 'success') {
                    this.setState({ loan: data })
                } else {
                    alert(data.message ? data.message : 'An error has occured. Try again later')
                }
            }).catch(error => {
                // console.log(error);
                this.setState({ isLoading: false })
                this.setState({ hasError: error.message? error.message : 'An error has occured' })
            })
        }
    }
    // openLoan = () => (

    // )
    showLiquidationModal = () => {
        // console.log('showing', this.state.loan_id)
        this.setState({ showLiquidation: true })
    }

    closeLiquidationModal = () => {
        // console.log('close liquidation')
        this.setState({ showLiquidation: false })
    }
    formatAsCurrency = (value) => {
        const newvalue = parseFloat(value)
        return `₦${newvalue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
    render() {
        const { isLoading, loan, loanType, visible, singleLoan, loan_id, showLiquidation, hasError } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', }}>
                <Loader isLoading={isLoading} />
               <View style={{flex: 1, width: resWidth(90), alignSelf: 'center'}}>
               <Header transparent style={{paddingLeft: 0, paddingRight: 0}}>
                        <Left>
                            <Button style={{paddingLeft: 0}} transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' style={{ fontSize: resFont(20), color: '#000',  }} />
                            </Button>
                        </Left>
                        <Body style={{alignItems: 'flex-end'}}>
                            <Title style={{ fontFamily: 'Baloo2-SemiBold', color: '#000' }}>Loans Details</Title>
                        </Body>
                    </Header>
               {hasError && <Fragment>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <CustomText style={{ marginVertical: 10, fontFamily: 'Baloo2-Regular' }}>{hasError}</CustomText>
                        <Button icon="reload" onPress={this.getLoanDetails}>
                        <Icon name='reload' />
                            <Text style={{ color: 'white', textTransform: 'capitalize' }}>reload</Text>
                        </Button>
                    </View>
                </Fragment>}
                    {loan && (
                        <Fragment>
                            <View style={{ flex: 1 }}>
                                <View style={{ width: '100%', backgroundColor: '#fff', marginVertical: 10 }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Loan Id</CustomText>
                                        <View>
                                            <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{loan.loan.loan_application_id}</CustomText>
                                        </View>
                                    </View>
                                    {/* <Divider /> */}
                                    {loanType === 'closed' && <Fragment>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                            <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Status</CustomText>

                                            <View>
                                                {/* <Chip textStyle={{ color: 'green', fontSize: resFont(8) }} style={{ backgroundColor: 'rgba(50,205,50, .2)' }} disabled>Fully Paid</Chip> */}
                                                <Badge style={{ backgroundColor: 'rgba(50,205,50, .7)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: resFont(10), fontFamily: 'Baloo2-SemiBold' }}>Fully Paid</Text>
          </Badge>
                                            </View>
                                        </View>
                                        {/* <Divider /> */}
                                    </Fragment>}
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Loan Amount</CustomText>
                                        <View>
                                            <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.loan.loan_principal_amount)}</CustomText>
                                        </View>
                                    </View>
                                    {/* <Divider /> */}

                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Balance</CustomText>
                                        <View>
                                            <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.loan.balance_amount)}</CustomText>
                                        </View>
                                    </View>
                                    {/* <Divider /> */}
                                    {loanType === 'closed' && (
                                        <Fragment>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Total Paid</CustomText>
                                                <View>
                                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{this.formatAsCurrency(loan.loan.total_paid)}</CustomText>
                                                </View>
                                            </View>
                                            {/* <Divider /> */}
                                        </Fragment>
                                    )}

                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Duration</CustomText>
                                        <View>
                                            <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{loan.loan.loan_duration} Months</CustomText>
                                        </View>
                                    </View>
                                    {/* <Divider /> */}
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Maturity Date</CustomText>
                                        <View>
                                            <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{loan.loan.loan_override_maturity_date}</CustomText>
                                        </View>
                                    </View>
                                    {/* <Divider /> */}
                                </View>
                                <View style={{ marginTop: resHeight(2) }}>
                                    <CustomText style={{ fontSize: resFont(17), textAlign: 'center', fontFamily: 'Baloo2-SemiBold' }}>Repayments</CustomText>
                                </View>
                                <ScrollView contentContainerStyle={{ flexGrow: 1, width: resWidth(90), alignSelf: 'center' }}>
                                    {loan.repayment.map((item, index) => (
                                        <>
                                        <TouchableWithoutFeedback key={index} onPress={() => this._showModal(item)}>
                                            <Fragment>
                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: resHeight(0.8) }}>
                                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{item.repayment_collected_date}</CustomText>
                                                    <View>
                                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{this.formatAsCurrency(item.repayment_amount)}</CustomText>
                                                    </View>
                                                    <MaterialIcons name="keyboard-arrow-right" size={24} color={'#f56b2a'} />
                                                </View>
                                                {/* <Divider /> */}
                                                {/* <View style={{backgroundColor: '#f56b2a', height: 1, width: resWidth(75), alignSelf: 'center'}}/> */}
                                            </Fragment>
                                        </TouchableWithoutFeedback>
                                        </>
                                    ))}
                                </ScrollView>
                            </View>
                            {loanType === 'open' && <View style={{width: '100%', paddingBottom: 15, alignSelf: 'center' }}>
                                <Button
                                block
                                    style={{ marginTop: resHeight(2), backgroundColor: '#f56b2a' }} onPress={() => this.props.navigation.navigate('Loan Liquidate', { loan_id: loan_id, returnUrl: 'Loans' })}>
                                    <Text style={{ textTransform: 'none', fontFamily: 'Baloo2-Regular', color: '#fff' }}>
                                    Liquidate/Pay off Loan
                                    </Text>
                        </Button>
                            </View>}
                        </Fragment>
                    )}
                <RBSheet
                    closeOnDragDown={true}
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={resHeight(25)}
                    openDuration={250}
                    customStyles={{
                        container: {
                            //   justifyContent: "center",
                            //   alignItems: "center"
                        }
                    }}
                >
                    <View style={{ backgroundColor: 'white' }}>
                        <View style={{ height: resHeight(25), width: resWidth(90), alignSelf: 'center' }}>
                            <CustomText style={{ textAlign: 'center', fontSize: 17, fontFamily: 'Baloo2-Bold' }}>Payment Details</CustomText>
                            <View style={{ paddingTop: resHeight(1.5) }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Principal Repayment</CustomText>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{this.formatAsCurrency(singleLoan.principal_repayment_amount)}</CustomText>
                                    </View>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Interest (7.5%)</CustomText>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{this.formatAsCurrency(singleLoan.interest_repayment_amount)}</CustomText>
                                    </View>
                                </View>
                                {/* <Divider /> */}
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Repayment date</CustomText>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>{singleLoan.repayment_collected_date}</CustomText>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View />
                    </View>

                </RBSheet>
          
               </View>
            </View>
        )
    }
}

export default LoanDetails;