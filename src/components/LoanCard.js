import React from 'react';
import { TouchableWithoutFeedback, View, Text, } from 'react-native';
// import { Button, Badge, Chip, useTheme } from 'react-native-paper'
import { Button, Badge } from 'native-base'
import CustomText from './CustomText';
import { resFont, resHeight } from '../utils/utils';

const LoanCard = props => {
    const { loan, navigation } = props;
    // console.log(loan)

    function formatAsCurrency(value) {
        const newvalue = parseFloat(value)
        return `₦${newvalue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
    function redirectToRepayments() {
        navigation.navigate('Loan Details', { loan_id: loan.loan_id, type: 'closed' })
    }
    return (
        <View style={{ width: '100%', backgroundColor: '#f5fcff', borderWidth: .4, borderColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 10, marginVertical: 10 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <CustomText style={{ fontSize: resFont(18), fontFamily: 'Baloo2-SemiBold' }}>{formatAsCurrency(loan.loan_principal_amount)}</CustomText>
                <View>
                    {/* <Chip textStyle={{ color: 'green', fontSize: resFont(8) }} style={{ backgroundColor: 'rgba(50,205,50, .2)' }} disabled>Fully Paid</Chip> */}
                    <Badge style={{ backgroundColor: 'rgba(50,205,50, .7)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: resFont(10), fontFamily: 'Baloo2-SemiBold' }}>Fully Paid</Text>
          </Badge>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 }}>
                <CustomText style={{ fontFamily: 'Baloo2-Regular', fontSize: resFont(12) }}>{loan.loan_released_date}</CustomText>
               
                <Button
                    small

                    block
                    style={{paddingHorizontal: 10, backgroundColor: '#f56b2a' }}
                    onPress={redirectToRepayments}>
                    <Text style={{ textTransform: 'none', color: 'white', fontFamily: 'Baloo2-Medium' }}>Details</Text>
                </Button>
            </View>
        </View>
    )
}

export default LoanCard;