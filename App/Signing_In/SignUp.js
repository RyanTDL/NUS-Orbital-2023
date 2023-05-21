import React, {useState} from "react";
import {TextInput, Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import AppButton from './Button' 


const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function SignUp({navigation}) {

    const [userName, setUserName]= useState('')
    const [passWord, setPassWord]= useState('')
    const [confirmPassWord, setConfirmPassWord]= useState('')


    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.child_container, {flex:1}]}>
                <Text style={styles.header}>Get Started Today</Text>
            </View>
            <View style={[styles.child_container, {flex:1}]}>
                <View style={styles.inputs}>
                    <Text style={styles.input_details}>Username</Text>
                    <TextInput 
                        style={styles.input_box}
                        placeholder="Username"
                        onChangeText={newUsername => setUserName(newUsername)}
                        defaultValue= {userName}
                    />
                    <Text style={styles.input_details}>Password</Text>
                    <TextInput 
                        style={styles.input_box}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={newPassword => setPassWord(newPassword)}
                        defaultValue= {passWord}
                    />
                    <Text style={styles.input_details}>Confirm Password</Text>
                    <TextInput 
                        style={styles.input_box}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={newPassword => setConfirmPassWord(newPassword)}
                        defaultValue= {confirmPassWord}
                    />
                </View>
            </View>

            <View style={[styles.child_container, {flex:1}]}>
                <AppButton 
                    title="Sign Up Now"
                    onPress={()=> {
                        return (
                            console.log('Button pressed'),
                            navigation.navigate('Home Screen')
                        );
                    }}
                    buttonStyle={styles.appButtonContainer}
                    textStyle= {styles.appButtonText}
                />
                <AppButton 
                    title="Return to Main Menu"
                    onPress={()=> {
                        return (
                            console.log('Button pressed'),
                            navigation.navigate('Welcome Page')
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
        justifyContent: 'space-around',
    },

    child_container: {
        // borderWidth: 1, 
        // borderColor:'red',
        alignItems:'center',
        justifyContent: 'center',     
    },

    header: {
        fontSize: 48,
        fontWeight: 600,
        height: 144,
        width: 300,
        color: '#FFFFFF',
        textAlign: 'center',
    },

    inputs : {
        width: 314,
        justifyContent: 'flex-start',
    },

    input_details : {
        fontSize: 20,
        fontWeight: 500,
        color: '#A4A4A4',
    },

    input_box : {
        borderWidth: 2,
        borderColor: '#A4A4A4',
        borderRadius: 5,
        padding: 5,
        marginTop: 3,
        marginBottom: 10,
        backgroundColor: '#A4A4A4',
    },
    
    appButtonContainer: {
        marginVertical: 8,
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