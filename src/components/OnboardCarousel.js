import React, { Component, createRef } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Dimensions, YellowBox } from 'react-native';
import { resWidth, resHeight } from '../utils/utils';
import CustomText from './CustomText';
const { width } = Dimensions.get('window')

const images = [
    {
        imgUrl: require('../assets/images/apply.png'),
        text: 'Stress Free Application'
    },
    {
        imgUrl: require('../assets/images/analysis.png'),
        text: 'Quick and Fair Assessment'
    },
    {
        imgUrl: require('../assets/images/disburse.png'),
        text: 'Money Disbursed in 30 minutes'
    }
]
class OnboardCarousel extends Component {
    _isMounted = false;
    scrollRef = createRef();
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0
        }
    }
    // setTimer = () => {
    //     // const timer = 
    //     return timer;
    // }
    componentDidMount = () => {
        this._isMounted = true;
        setInterval(() => {
            if (this._isMounted) {
                this.setState(prev => ({ selectedIndex: prev.selectedIndex === images.length - 1 ? 0 : prev.selectedIndex + 1 }),
                    () => {
                        this.scrollRef.current.scrollTo({
                            animated: true,
                            y: 0,
                            x: resWidth(90) * this.state.selectedIndex
                        })
                    }
                )
            }
        }, 3000);
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }
    setSelectedIndex = event => {
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.floor(contentOffset / viewSize);
        // console.log(selectedIndex)
        // this.setState({ selectedIndex })
    }
    render() {
        // const {images} = this.props;
        const { selectedIndex } = this.state;
        return (
            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal pagingEnabled onMomentumScrollEnd={this.setSelectedIndex}
                    ref={this.scrollRef}
                >
                    {images.map((image, index) => (
                        <View
                            key={index} style={styles.backgroundImage}>
                            <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                               <View style={{width: width, height: '70%'}}>
                               <Image
                                    source={(image.imgUrl)}
                                    style={styles.onboardImage}
                                />
                               </View>
                                <View style={styles.onboardText}>
                                    <CustomText style={{ fontSize: 15, fontFamily: 'Baloo2-Regular' }}>{image.text}</CustomText>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.pagination}>
                    {images.map((image, index) => (
                        <View
                            key={index}
                            style={[styles.whitedot, { backgroundColor: index === selectedIndex ? '#f56b2a' : '#666' }]}
                        />
                    ))}
                </View>
            </View>
        )
    }
}

export default OnboardCarousel;

const styles = StyleSheet.create({
    onboardImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain'
        // marginBottom: resHeight(5)
    },
    onboardText: {
        marginTop: resHeight(5)
    },
    backgroundImage: {
        height: '100%',
        width: resWidth(90),
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pagination: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: resHeight(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    whitedot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
        backgroundColor: '#666'
    }
})