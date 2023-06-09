import React from "react";
import {Image, Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import AppButton from './Button' //Don't encapsulate AppButton in {}

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function Welcome({navigation}) {
    return (
            <SafeAreaView style={styles.container}>
                <Image source={require('../../assets/app_icon.png')} style={[styles.childContainer, {flex:3}]}/>
                <View style={[styles.childContainer, {flex:1}]}>
                    <Text style={styles.headerText}>LifeQuest</Text>
                    <Text style={styles.subheaderText}>Level up your life, one step at a time</Text>
                </View>
                <View style={[styles.childContainer, {flex:1}]}>
                    <AppButton 
                        title="Log In"
                        onPress={()=> {
                            return (
                                console.log('Button pressed'),
                                navigation.replace('Log In Page')
                            );
                        }}
                        buttonStyle={styles.appButtonContainer}
                        textStyle= {styles.appButtonText}
                    />
                    <AppButton 
                        title="Sign Up"
                        onPress={()=> {
                            return (
                                console.log('Button pressed'),
                                navigation.replace('Sign Up Page')
                            );
                        }}
                        buttonStyle={styles.appButtonContainer}
                        textStyle= {styles.appButtonText}
                    />
                </View>
            </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: 'black',
        alignItems:'center',
        justifyContent: 'center',     
    },

    childContainer: {
        alignItems:'center',
        justifyContent: 'center',     
    },

    headerText: {
        fontSize: 45,
        fontWeight: 700,
        color: '#FFFFFF',
    },

    subheaderText: {
        paddingTop: 5,
        fontSize: 18,
        fontWeight: 400,
        color: '#FFFFFF',
    },
    
    appButtonContainer: {
        margin: 8,
        backgroundColor: "#009688",
        width: 328,
        borderRadius: 24,
        paddingVertical: 16,

    },

    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    }
});