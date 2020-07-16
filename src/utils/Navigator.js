

import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthStack from '../stacks/AuthStack';
import TabNavigator from '../stacks/TabStack';
import LiquidateLoan from '../screens/liquidate/LiquidateLoan';
import Splashscreen from '../screens/SplashScreen';

const AppNavigator = createSwitchNavigator({
    'Loading': {
        screen: Splashscreen
    },
    Auth: {
        screen: AuthStack
    },
    'Main': {
        screen: TabNavigator,
        path: ''
    },
    'Loan Liquidate' :  {
        screen: LiquidateLoan,
        path: 'liquidate/:loan_id'
    }
}, {
    initialRouteName: 'Loading'
})

const App = createAppContainer(AppNavigator)
const prefix = 'creditwallet://';
// const MainApp = () => 
// export default () => {
//     return <App  uriPrefix={prefix}/>
// };

export default AppContainer = React.forwardRef((props, ref) => {
    return <App  {...props}  uriPrefix={prefix} ref={ref}/>
})

