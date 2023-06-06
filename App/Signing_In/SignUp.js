import React, {useEffect, useState} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {TextInput, ImageBackground, Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import { auth, registerWithEmailAndPassword } from "../../firebase";
import AppButton from './Button' 


const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function SignUp({navigation}) {

    const [email, setEmail]= useState('')
    const [username, setUsername]= useState('')
    const [password, setPassword]= useState('')
    const [user, loading, error]= useAuthState(auth)

    const register= () => {
        // if (!username) alert("Please Enter Name");
        console.log("Registering")
        registerWithEmailAndPassword(username, email, password);
        console.log("Registered")
    }

    useEffect( () => {
        if (loading) return;
        if (user) navigation.replace('Home Screen');
    }, [user, loading])

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/background/signin_background.png")} resizeMode="contain" imageStyle={{opacity:0.5}}>
                <View style={[styles.child_container, {flex:1}]}>
                    <Text style={styles.header}>Get Started Today</Text>
                </View>
                <View style={[styles.child_container, {flex:1}]}>
                    <View style={styles.inputs}>
                        <Text style={styles.input_details}>Username</Text>
                        <TextInput 
                            style={styles.input_box}
                            placeholder="Username"
                            onChangeText={newUsername => setUsername(newUsername)}
                            defaultValue= {username}
                        />
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
                    <AppButton 
                        title="Sign Up Now"
                        onPress={()=> {
                            register()
                            // console.log('Pressed')
                        }}
                        buttonStyle={styles.appButtonContainer}
                        textStyle= {styles.appButtonText}
                    />
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                        <Text style={{fontWeight: 500, fontSize:15, color: '#A4A4A4'}}>Already have an account? </Text>
                        <TouchableOpacity 
                            onPress={()=> {
                                return (
                                    console.log('Button pressed'),
                                    navigation.navigate('Log In Page')
                                );
                            }}>
                            <Text style={{fontWeight: 700, fontSize:15, color: '#FFFFFF'}}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
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
        marginVertical: 10,
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