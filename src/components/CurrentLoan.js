import React from 'react';
import { TouchableWithoutFeedback, View, Text, } from 'react-native';
// import { Button, Divider, useTheme } from 'react-native-paper';
import { Button, Badge , List, Body, Left, Right, ListItem, Icon} from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CustomText from './CustomText';
import { resFont } from '../utils/utils';

const CurrentLoan = props => {
    const { navigation, loan } = props;
    function formatAsCurrency(value) {
        const newvalue = parseFloat(value)
        return `₦${newvalue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }

    function redirectToRepayments() {
        navigation.navigate('Loan Details', {loan_id: loan.loan_id, type: 'open'})
    }
    return (
        <View style={{ width: '100%', backgroundColor: '#fff', paddingHorizontal: 10, marginVertical: 10 }}>
            <View style={{ paddingVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <MaterialCommunityIcons name="information-variant" size={resFont(24)} color="black" />
                <View style={{ alignItems: 'flex-end' }}>
                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Regular' }}>Loan Id</CustomText>
                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{loan.loan_application_id}</CustomText>
                </View>
            </View>
            {/* <Divider /> */}
            <View style={{ paddingVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                
                <CustomText style={{fontSize: resFont(20), fontFamily: 'Baloo2-SemiBold'}}>₦</CustomText>
                <View style={{ alignItems: 'flex-end' }}>
                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Regular' }}>Loan Amount</CustomText>
                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{formatAsCurrency(loan.loan_principal_amount)}</CustomText>
                </View>
            </View>
            {/* <Divider /> */}
            <View style={{ paddingVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <MaterialIcons name="date-range" size={resFont(24)} color="black" />
                <View style={{ alignItems: 'flex-end' }}>
                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Regular' }}>Loan Duration</CustomText>
                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{loan.loan_duration} Months</CustomText>
                </View>
            </View>
            {/* <Divider /> */}
            <View style={{ paddingVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <MaterialCommunityIcons name="percent" size={resFont(24)} color="black" />
                <View style={{ alignItems: 'flex-end' }}>
                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Regular' }}>Interest Rate</CustomText>
                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>0.25% per day</CustomText>
                </View>
            </View>
            {/* <Divider /> */}
            <View style={{ paddingVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <MaterialCommunityIcons name="bank-transfer-out" size={resFont(24)} color="black" />
                <View style={{ alignItems: 'flex-end' }}>
                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Regular' }}>Monthly Repayment</CustomText>
                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{formatAsCurrency(loan.custom_field_1294)}</CustomText>
                </View>
            </View>
            {/* <Divider /> */}
            <View style={{ paddingVertical: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <MaterialCommunityIcons name="calendar" size={resFont(24)} color="black" />
                <View style={{ alignItems: 'flex-end' }}>
                    <CustomText style={{ fontSize: resFont(14), fontFamily: 'Baloo2-Regular' }}>Loan Release Date</CustomText>
                    <CustomText style={{ fontSize: resFont(15), fontFamily: 'Baloo2-Medium' }}>{loan.loan_interest_start_date}</CustomText>
                </View>
            </View>
           
            <Button
            block
            style={{backgroundColor: '#f56b2a'}}
               onPress={redirectToRepayments}>
                <Text style={{ textTransform: 'none', fontFamily: 'Baloo2-Medium', fontSize: resFont(14), color: 'white' }}>View Repayments</Text>
                </Button>
        </View>
    )
}

export default CurrentLoan;