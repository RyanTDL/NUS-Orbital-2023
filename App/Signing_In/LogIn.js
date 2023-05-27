import React, {useEffect, useState} from "react";
import {TextInput, Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import AppButton from './Button'; 
import {auth, logInWithEmailAndPassword} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
// import { signInWithEmailAndPassword } from "firebase/auth";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function LogIn({navigation}) {

    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const [user, loading, error]= useAuthState(auth)

    //useEffect tracks authentication state of user, and automatically redirects to Home Screen once user is authenticated
    useEffect( () => {
        if (loading){
            //maybe including a loading screen pop up
            console.log("Loading")
            return;
        }
        if (user){
            navigation.replace('Home Screen')
        }
    }, [user, loading])


    return (
        <SafeAreaView style={styles.container}>

            <View style={[styles.child_container, {flex:1}]}>
                <Text style={styles.header}>Welcome Back!</Text>
            </View>

            <View style={[styles.child_container, {flex:1}]}>
                <View style={styles.inputs}>
                    <Text style={styles.input_details}>Email</Text>
                    <TextInput 
                        style={styles.input_box}
                        placeholder="Email"
                        onChangeText={newEmail => setEmail(newEmail)}
                        defaultValue= {email}
                    />
                    <Text style={styles.input_details}>Password</Text>
                    <TextInput 
                        style={styles.input_box}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={newPassword => setPassword(newPassword)}
                        defaultValue= {password}
                    />
                </View>
            </View>

            <View style={[styles.child_container, {flex:1}]}>
                <View>
                    <AppButton 
                        title="Sign into Account"
                        onPress={()=> {
                            logInWithEmailAndPassword(email, password)
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
        fontSize: 60,
        fontWeight: 600,
        height: 144,
        width: 284,
        marginTop: 0,
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