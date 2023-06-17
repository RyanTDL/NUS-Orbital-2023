import React, {useEffect, useState} from "react";
import {TextInput, ImageBackground, Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import AppButton from './Button'; 
import {auth, logInWithEmailAndPassword, sendPasswordReset} from "../../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import Modal from "react-native-modal";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function LogIn({navigation}) {

    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [user, loading, error]= useAuthState(auth);
    const [isModalVisible, setIsModalVisible]= useState(false);

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
            <ImageBackground source={require("../../assets/background/signin_background.png")} resizeMode="contain" imageStyle={{opacity:0.5}}>
                <View style={[styles.childContainer, {flex:1}]}>
                    <Text style={styles.header}>Welcome Back!</Text>
                </View>

                <View style={[styles.childContainer, {flex:1}]}>
                    <View style={styles.inputs}>
                        <Text style={styles.inputDetails}>Email</Text>
                        <TextInput 
                            style={styles.inputBox}
                            placeholder="Email"
                            onChangeText={newEmail => setEmail(newEmail)}
                            defaultValue= {email}
                        />
                        <Text style={styles.inputDetails}>Password</Text>
                        <TextInput 
                            style={styles.inputBox}
                            secureTextEntry={true}
                            placeholder="Password"
                            onChangeText={newPassword => setPassword(newPassword)}
                            defaultValue= {password}
                        />
                        <TouchableOpacity onPress={()=> setIsModalVisible(!isModalVisible)} style={{alignItems:'flex-end'}}>
                            <Text style={{fontWeight: 500, fontSize:15, color: '#A4A4A4'}}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.childContainer, {flex:1}]}>
                    <View>
                        <AppButton 
                            title="Sign into Account"
                            onPress={()=> {
                                logInWithEmailAndPassword(email, password)
                            }}
                            buttonStyle={styles.appButtonContainer}
                            textStyle= {styles.appButtonText}
                        />
                        <View style={{flexDirection:'row', justifyContent:'center'}}>
                            <Text style={{fontWeight: 500, fontSize:15, color: '#A4A4A4'}}>Don't have an account? </Text>
                            <TouchableOpacity 
                                onPress={()=> {
                                    return (
                                        console.log('Button pressed'),
                                        navigation.navigate('Sign Up Page')
                                    );
                                }}>
                                <Text style={{fontWeight: 700, fontSize:15, color: '#FFFFFF'}}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Modal 
                    isVisible={isModalVisible} 
                    coverScreen= {false}
                    backdropOpacity= {0.4}
                    style= {{justifyContent:'center', alignItems:'center'}}
                >
                    <View style={styles.modalContainer}>
                        <View style={{gap:5}}>
                            <Text style={styles.modalText}>Forgot your password?</Text>
                            <Text style={styles.modalSubtext}>We'll email you a link to reset your password</Text>
                        </View>
                        <View>
                            <TextInput 
                                style={styles.modalInputBox}
                                placeholder="Email"
                                onChangeText={newEmail => setEmail(newEmail)}
                                defaultValue= {email}
                            />
                        </View>
                        <View style={{gap:10}}>
                            <AppButton 
                                title="Send link"
                                onPress={()=> {
                                    // console.log('Email sent')
                                    sendPasswordReset(email)
                                    setIsModalVisible(!isModalVisible)
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                                textStyle= {[styles.modalButtonText, {color:'white'}]}
                            />
                            <AppButton 
                                title="Cancel"
                                onPress={()=> setIsModalVisible(!isModalVisible)}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'#E0E0E0'}]}
                                textStyle= {[styles.modalButtonText, {color:'black'}]}
                            />
                        </View>
                    </View>
                </Modal>
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

    childContainer: {
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

    inputDetails : {
        fontSize: 20,
        fontWeight: 500,
        color: '#A4A4A4',
    },

    inputBox : {
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
    },

    modalContainer: {
        justifyContent: 'space-around',
        alignItems:'flex-start',
        padding: 25,
        // gap:5,
        width: 350,
        height: 300,
        borderRadius: 30,
        backgroundColor: 'white',
    },

    modalText: {
        fontSize:26,
        fontWeight: 600,
    },

    modalSubtext: {
        fontSize:14 ,
        fontWeight: 400,
    },

    modalInputBox : {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        width:300,
        padding: 10,
    },

    modalButtonContainer: {
        width: 300,
        borderRadius: 24,
        paddingVertical: 10,
    },

    modalButtonText:{
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: "center",
    }
});