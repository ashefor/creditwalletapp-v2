import React from 'react';
import { StyleSheet, ActivityIndicator, Modal, Text , View} from 'react-native';

const Loader = props => {
    const { isLoading, backgroundColor } = props;
    return (
        <Modal dismissable={false} visible={isLoading}>
                <View style={[StyleSheet.absoluteFill, {backgroundColor: backgroundColor ? backgroundColor: '#f7f7f7', alignItems: 'center', justifyContent: 'center'}]} >
                {props.children}
                <ActivityIndicator animating={true} size='large' color="#f56b2a"/>
                </View>
            </Modal>
    )
}

export default Loader