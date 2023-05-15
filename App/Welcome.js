import React from "react";
import { Dimensions, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import {LinearGradient} from 'expo-linear-gradient'
import AppButton from './Button' //Don't encapsulate AppButton in {}


const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function Welcome({navigation}) {
    return (
        <View style={styles.container}>

            <Text style={styles.header_text}>LifeQuest</Text>
            <Text style={styles.subheader_text}>Level up your life, one step at a time</Text>
            <AppButton 
                title="Log In"
                onPress={()=> {
                    return (
                        console.log('Button pressed'),
                        navigation.navigate('Log In Page')
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
                        navigation.navigate('Sign Up Page')
                    );
                }}
                buttonStyle={styles.appButtonContainer}
                textStyle= {styles.appButtonText}
            />
        </View>
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

    header_text: {
        fontSize: 45,
        fontWeight: 700,
        color: '#FFFFFF',
    },

    subheader_text: {
        paddingTop: 5,
        fontSize: 18,
        fontWeight: 400,
        color: '#FFFFFF',
        marginBottom: 56,
    },
    
    appButtonContainer: {
        margin: 9,
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