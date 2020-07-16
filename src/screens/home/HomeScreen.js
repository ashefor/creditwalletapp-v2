import React, { Component, createRef, Fragment } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, Platform, Linking, RefreshControl, Modal } from 'react-native'
// import { Appbar, Button, Title, Subheading, FAB, Portal, TextInput, Dialog, Paragraph, Surface, withTheme, Snackbar } from 'react-native-paper';
import { Header, Left, Button, Toast, Form, Item, Label, Input, Icon, Body } from 'native-base'
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { resWidth, resHeight, resFont } from '../../utils/utils';
import CustomText from '../../components/CustomText';
import { getUser } from '../../utils/storage';
import { apiURL, requestWithToken } from '../../utils/request';
import Loader from '../../components/Loader';
// import LiquidateLoan from '../liquidate/LiquidateLoan';
// import NewLoanScreen from './NewLoanScreen';

const { width } = Dimensions.get('window')
class HomeScreen extends Component {
    constructor(props) {
        _isMounted = false;
        super(props)
        this.carouselRef = createRef(null)
        this.textInputRef = createRef(null)
        this.state = {
            selectedIndex: 0,
            open: false,
            email: '',
            isLoading: false,
            isSending: false,
            dashboard: null,
            visible: false,
            letterType: '',
            dialog: false,
            isOpenLoans: false,
            isErrorLoans: false,
            showLiquidation: false,
            errorMsg: null,
            snackBarVisible: false,
            refreshing: false,
            showNewLoanModal: false,
            hasError: null
        }
    }
    componentDidMount = () => {
        this._isMounted = true;
        this.getLoggedInUser();
        this.loadDashboard(true)
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }
    getLoggedInUser = async () => {
        const user = await getUser();
        if (this._isMounted && user) {
            this.setState({
                username: JSON.parse(user).borrower_firstname
            })
        }
        // // // console.log(JSON.parse(user).username)
    }

    _onrefresh = () => {
        this.setState({ refreshing: true })
        this.loadDashboard(false).then(() => {
            this.setState({ refreshing: false })
        })
    }
    loadDashboard = (val) => {
        if (this._isMounted) {
            this.setState({ isLoading: val })
            const url = `${apiURL}account/dashboard`;
            const options = {
                method: 'GET',
            }
            return new Promise((resolve, reject) => {
                requestWithToken(url, options).then(data => {
                    // // console.log(data)

                    this.setState({ isLoading: false })
                    if (data.status === 'success') {
                        this.setState({ dashboard: data })
                    }
                    else {
                        alert(data.message ? data.message : 'An error has occured. Try again later')
                    }
                    resolve()
                }).catch(error => {
                    // console.log(error);
                    this.setState({ isLoading: false })
                    this.setState({ hasError: error.message? error.message: 'An error has occured' })
                    // reject()
                })
            })
        }
    }

    makeCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${+2347085698828}`;
        } else {
            phoneNumber = `telprompt:${+2347085698828}`;
        }

        Linking.openURL(phoneNumber);
    };

    handleSendEmail = () => {
        this.setState({
            errorMsg: null
        })
        const url = `${apiURL}request/${this.state.letterType}`;
        const user = {
            email: this.state.email,
            loanid: this.state.dashboard.open_loans[0].loan_id
        }
        const options = {
            method: 'POST',
            body: JSON.stringify(user),
        }
        Keyboard.dismiss()
        this.setState({ isSending: true })
        requestWithToken(url, options).then(data => {
            this.setState({ isSending: false }, () => {
                this._hideModal()
                this.setState({ snackBarVisible: true })
            });
            // // console.log(data)
        }).catch(error => {
            this.setState({ isSending: false, errorMsg: error.message })
            // // console.log(error)
        })

    }
    setSelectedIndex = event => {
        // // // console.log(event.nativeEvent)
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        // // console.log(event.nativeEvent.contentOffset.x)
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.round(contentOffset / resWidth(75));
        // // console.log(selectedIndex)
        this.setState({ selectedIndex },
            () => {
                this.carouselRef.current.scrollTo({
                    animated: true,
                    y: 0,
                    x: resWidth(70) * this.state.selectedIndex
                })
            })
    }
    formatAsCurrency = (value) => {
        const newvalue = Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return `₦${newvalue}`
    }
    _showModal = (mode) => {
        if (mode === 2) {
            if (this.state.dashboard.open_loans_count !== 0) {
                this.setState({ dialog: true })
            } else {
                this.setState({ letterType: 'non-indebtedness' }, () => {
                    this.setState({ visible: true })
                })
            }
        } else {
            this.setState({ letterType: 'indebtedness' }, () => {
                this.setState({ visible: true })
            })
        }
    };
    _hideModal = () => this.setState({ visible: false }, () => {
        this.setState({ email: '' })
    });

    _liquidateLoan = () => {
        if (this.state.dashboard.open_loans_count === 0) {
            this.setState({ isOpenLoans: true })
        } else if (this.state.dashboard.open_loans_count > 1) {
            this.setState({ isErrorLoans: true })
        } else {
            this.props.navigation.navigate('Loan Liquidate', { loan_id: this.state.dashboard.open_loans[0].loan_id, returnUrl: 'Home' })
        }
    }

    showLiquidationModal = () => {
        // // console.log('showing', this.state.dashboard.open_loans[0].loan_id)
        this.setState({ showLiquidation: true })
    }

    closeLiquidationModal = () => {
        this.setState({ showLiquidation: false })
    }
    _hideDialog = () => this.setState({ dialog: false });
    _hideDialogOne = () => this.setState({ isOpenLoans: false });
    _hideDialogTwo = () => this.setState({ isErrorLoans: false });
    _onDismissSnackBar = () => this.setState({ snackBarVisible: false });

    _showNewLoanModal = () => {
        this.setState({ showNewLoanModal: true })
    }

    _hideNewLoanModal = () => {
        this.setState({ showNewLoanModal: false })
    }
    render() {
        const { username, isOpenLoans, isErrorLoans, isLoading, dashboard, visible, email, showNewLoanModal, hasError, isSending, letterType, dialog, errorMsg, snackBarVisible } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Loader isLoading={isLoading} />
                {hasError && <Fragment>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CustomText style={{ marginVertical: 10, fontFamily: 'Baloo2-Regular' }}>{hasError}</CustomText>
                        <Button small style={{alignItems: 'center', paddingHorizontal: 10}} onPress={()=>this.loadDashboard(true)}>
                            {/* <Icon name='reload' /> */}
                            <Text style={{ color: 'white', textTransform: 'capitalize' }}>reload</Text>
                        </Button>
                    </View>
                </Fragment>}
                {dashboard &&
                    <Fragment>

                        <Modal visible={isOpenLoans}
                            transparent
                            onDismiss={this._hideDialogOne}>
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }]}>
                                <View style={{ backgroundColor: '#fff', width: resWidth(70), borderRadius: 10, padding: 15 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Icon name='information-outline' style={{ fontSize: resFont(20), color: '#63B0CD' }} />
                                    </View>
                                    <View style={{ marginVertical: resHeight(3) }}>
                                        <CustomText style={{ fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Regular' }}>
                                            You have no open loans
                                    </CustomText>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this._hideDialogOne} style={{ marginTop: resHeight(2), }}>
                                        <View style={{ paddingVertical: 3 }}>
                                            <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Okay</CustomText>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </Modal>
                        <Modal visible={isErrorLoans}
                            transparent
                            onDismiss={this._hideDialogTwo}>
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }]}>
                                <View style={{ backgroundColor: '#fff', width: resWidth(70), borderRadius: 10, padding: 15 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Icon name='information-outline' style={{ fontSize: resFont(20), color: '#63B0CD' }} />
                                    </View>
                                    <View style={{ marginVertical: resHeight(3) }}>
                                        <CustomText style={{ fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Regular' }}>
                                            There is an error with your account. Please contact admin
                                    </CustomText>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this._hideDialogTwo} style={{ marginTop: resHeight(2), }}>
                                        <View style={{ paddingVertical: 3 }}>
                                            <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Okay</CustomText>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </Modal>
                        <Modal visible={dialog}
                            transparent
                            onDismiss={this._hideDialog}>
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }]}>
                                <View style={{ backgroundColor: '#fff', width: resWidth(70), borderRadius: 10, padding: 15 }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Icon name='information-outline' style={{ fontSize: resFont(20), color: '#63B0CD' }} />
                                    </View>
                                    <View style={{ marginVertical: resHeight(3) }}>
                                        <CustomText style={{ fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Regular' }}>You currently have an open loan of <CustomText style={{ fontFamily: 'Baloo2-SemiBold' }}>
                                            {this.formatAsCurrency(dashboard.loan_balance)}
                                        </CustomText> so you can not get letter of Non-Indebtness at this point. Kindly pay off your loan</CustomText>
                                    </View>
                                    <TouchableWithoutFeedback onPress={this._hideDialog} style={{ marginTop: resHeight(2), }}>
                                        <View style={{ paddingVertical: 3 }}>
                                            <CustomText style={{ color: '#f56b2a', fontSize: resFont(15), textAlign: 'center', fontFamily: 'Baloo2-Medium' }}>Okay</CustomText>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            animationType='slide' presentationStyle='pageSheet' visible={visible} onDismiss={this._hideModal}>
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#fff' }]}>
                                <View style={{ flex: 1, backgroundColor: '#fff', alignSelf: 'center', width: resWidth(90) }}>
                                    <Header transparent style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <Left style={{alignItems: 'flex-start'}}>
                                            <Button style={{ paddingLeft: 0 }} transparent onPress={this._hideModal}>
                                                <Icon name='close' style={{ fontSize: resFont(20), color: '#000', }} />
                                            </Button>
                                        </Left>
                                        <Body></Body>
                                    </Header>
                                    <View>
                                        <CustomText style={{ fontSize: resFont(20), fontFamily: 'Baloo2-ExtraBold', color: '#f56b2a' }}>Letter of {letterType}</CustomText>
                                        <CustomText style={{ fontFamily: 'Baloo2-Regular' }}>Get your letter of {letterType} and send to any preferred email address</CustomText>
                                        <View style={{ marginTop: resHeight(2) }}>
                                            {errorMsg && <CustomText style={{ textAlign: 'center', color: 'red' }}>{errorMsg}</CustomText>}
                                            <Form>
                                                <Item regular style={{ borderRadius: 5, marginTop: resHeight(3), borderColor: '#000' }}>
                                                    <Icon name='mail' style={{ fontSize: resFont(20), color: '#6B818C' }} />
                                                    <Input style={{ fontFamily: 'Baloo2-Regular', fontSize: resFont(17) }} value={email}
                                                        autoCapitalize='none'
                                                        returnKeyType='done'
                                                        placeholder='Username'
                                                        onChangeText={email => this.setState({ email })} />
                                                </Item>
                                                <Button
                                                    block
                                                    style={{ marginTop: resHeight(3), backgroundColor: isSending ? '#b5b5b5' : '#f56b2a' }}
                                                    disabled={isSending}
                                                    onPress={this.handleSendEmail}>
                                                    <Text style={{ textTransform: 'none', color: 'white', fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{isSending ? 'Sending ....' : 'Get my letter'}</Text>
                                                </Button>
                                            </Form>
                                        </View>
                                        <View />
                                    </View>
                                </View>

                            </View>
                        </Modal>
                        <View style={{ flex: 1, width: resWidth(90), alignSelf: 'center' }}>
                            <View style={styles.header}>
                                <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>
                                    Welcome, {username}
                                </CustomText>
                            </View>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onrefresh}
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                                style={{ backgroundColor: '#fff', }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>


                                <View style={{ marginTop: resHeight(1) }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>Current Loan Balance</CustomText>
                                    <CustomText style={{ fontSize: resFont(30), fontFamily: 'Baloo2-Bold' }}>{this.formatAsCurrency(dashboard.loan_balance)}</CustomText>
                                </View>
                                <View style={{ marginVertical: resHeight(3) }}>
                                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Regular' }}>What would you like to do?</CustomText>
                                    <View style={styles.cardContainer}>
                                        <TouchableWithoutFeedback onPress={this._liquidateLoan}>
                                            <View style={[styles.loanCard, styles.card]}>
                                                <View>
                                                    <Ionicons name="cash-outline" size={30} color="#fff" />
                                                </View>
                                                <View>
                                                    <CustomText style={styles.cardText}>Liquidate Loan</CustomText>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('New Loan')}>
                                            <View style={[styles.newloanCard, styles.card]}>
                                                <View>
                                                    <Ionicons name="wallet-outline" size={30} color="#fff" />
                                                </View>
                                                <View>
                                                    <CustomText style={styles.cardText}>Apply for a new loan</CustomText>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.cardContainer}>
                                        <TouchableWithoutFeedback onPress={() => this._showModal(1)}>
                                            <View style={[styles.indebtCard, styles.card]}>
                                                <View>
                                                    <Ionicons name="document-attach-outline" size={30} color="#fff" />
                                                </View>
                                                <View>
                                                    <CustomText style={styles.cardText}>Indebtedness Letter</CustomText>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => this._showModal(2)}>
                                            <View style={[styles.nonidebtCard, styles.card]}>
                                                <View>
                                                    <Ionicons name="document-attach-outline" size={30} color="#fff" />
                                                </View>
                                                <View>
                                                    <CustomText style={styles.cardText}>Non-Indebtedness Letter</CustomText>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={styles.cardContainer}>
                                        <TouchableWithoutFeedback onPress={this.makeCall} >
                                            <View style={[styles.callAgent, styles.card]}>
                                                <View>
                                                    <AntDesign name="customerservice" size={30} color="white" />
                                                </View>
                                                <View>
                                                    <CustomText style={styles.cardText}>Speak to an agent</CustomText>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        {/* <FAB
                        style={[styles.fab, { bottom: snackBarVisible ? 50 : 0 }]}
                        // small
                        color="white"
                        icon="plus"
                        onPress={() => // // console.log('Pressed')}
                    /> */}
                        {/* <Snackbar
                            visible={snackBarVisible}
                            onDismiss={this._onDismissSnackBar}
                            style={{backgroundColor: '#f56b2a', color: '#fff'}}
                        >
                            Email Successfully Sent
                            </Snackbar> */}
                    </Fragment>}
            </View>
        )
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: resHeight(.5)
    },
    card: {
        borderRadius: 15,
        width: '49%',
        height: resHeight(17),
        padding: 10,
        // backgroundColor: '#f7971e',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    cardText: {
        color: '#fff',
        fontSize: resFont(13),
        fontFamily: 'Baloo2-Bold'
    },
    loanCard: {
        backgroundColor: '#f7971e',
    },
    newloanCard: {
        backgroundColor: '#FFD200',
    },
    indebtCard: {
        backgroundColor: '#34D1BF'
    },
    nonidebtCard: {
        backgroundColor: '#3454d1'
    },
    callAgent: {
        backgroundColor: '#7D938A'
    },
    header: {
        height: resHeight(5),
        marginTop: resHeight(5),
        // backgroundColor: 'blue',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: .5,
        borderBottomColor: '#f56b2a'
    },
    surface: {
        padding: resFont(15),
        // height: resHeight(25),
        justifyContent: 'center',
        width: '100%',
        borderColor: 'rgba(0,0,0, .1)',
        borderWidth: 1,
        backgroundColor: 'white',
        marginVertical: resHeight(1),
        paddingHorizontal: 20,
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: .3,
        shadowRadius: 2,
        elevation: 2,
    },
    loginbtn: {
        height: resHeight(5),
        width: resWidth(90)
    },
    fab: {
        position: 'absolute',
        margin: resFont(15),
        backgroundColor: '#f56b2a',
        right: 0,
        // bottom: 50,
    },
})