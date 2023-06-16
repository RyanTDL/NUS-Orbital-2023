import React, {useEffect, useState} from "react";
import {Animated, Dimensions, ImageBackground, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import NavTab from "./NavTab";
import { MaterialIcons } from '@expo/vector-icons'; 
import {db, auth, logout} from "../../firebase";
import {collection, doc, getDocs, getDoc, query, where} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

function ProgressBar({stat_name, stat_value, bar_color}) {
    return (
        <View>
            <Text style={{color:'white', fontSize:25, marginVertical: 3}}>{stat_name}:{' '}  
                <Text style={{fontWeight:'200'}}>
                    {stat_value}/100
                </Text>
            </Text>

            <View style={[styles.bar, {borderColor: 'white', backgroundColor:'white'}]}>
                <Animated.View style={[StyleSheet.absoluteFill, {backgroundColor:bar_color, width: (324*stat_value)/100}]}/>
            </View>
        </View>
    );
}


export default function HomeScreen({navigation}) {

    //Retrieve user data
    const [current_user, loading, error]= useAuthState(auth);
    let [name, setName]= useState("");
    const fetchUser= async () => {
        try {
            if (current_user==null){
                console.log('Logging out')
            } else {
                const userData= query(collection(db, "users"), where("uid", "==", current_user?.uid))
                const doc= await getDocs(userData);
                const data= doc.docs[0].data();
                setName(data.username);
            }

        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    }

    useEffect( () => {
        if (loading) return;
        if (!current_user) navigation.navigate('Welcome Page');
        fetchUser();
    }, [current_user, loading])


    //Updating progress bars
    const [char_strength, setCharStrength]= useState('')
    const [char_agility, setCharAgility]= useState('')
    const [char_stamina, setCharStamina]= useState('')
    const [char_intellect, setCharIntellect]= useState('') 

    const getFromDatabase = async() => {    
        const docRef= doc(db, "users", current_user?.uid)
        const docSnapshot= await getDoc(docRef)

        if (docSnapshot.exists()) {
            total_exercise= docSnapshot.data()['total_exercise']
            total_steps= docSnapshot.data()['total_steps']
            total_sleep= docSnapshot.data()['total_sleep']
            total_study= docSnapshot.data()['total_study']
        }
    
        //Converting hours/steps into the respective stat points
        strength_points = Math.min(total_exercise, 100) //minimum used to ensure progress bar does not exceed when it hit 100 points
        agility_points = Math.min(Math.trunc(total_steps),100)
        stamina_points = Math.min(Math.trunc(total_sleep/7), 100)
        intellect_points = Math.min(Math.trunc(total_study/3), 100)
    
        setCharStrength(strength_points);
        setCharAgility(agility_points);
        setCharStamina(stamina_points);
        setCharIntellect(intellect_points);
    }

    useEffect(()=>{
        getFromDatabase();
    }, [])
///////////////////////////////////////////////////
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/background/home_background.png")} resizeMode="contain" imageStyle={{opacity:1}}>
                <View style={[styles.childContainer, {flex:1, alignItems: "flex-end", marginRight:5, marginTop: 5}]}>
                    <TouchableOpacity 
                        style={styles.logout}
                        onPress={()=>logout(auth)}>
                        <Text style={{color:"#B3B3B3", fontSize:16, fontWeight:'bold'}}>Logout</Text>
                        <MaterialIcons name="logout" size={24} color="#B3B3B3" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.childContainer, {flex:3, marginBottom:10}]}>
                    <View style={{width:240, height:240, borderWidth:2, borderRadius: 120, borderColor:'white', backgroundColor: 'white'}}></View>
                    <Text style={{color:'white', fontSize:25, fontWeight:'500'}}>{name}</Text>
                </View>

                <View style={[styles.childContainer, {flex:4}]}>
                    <View style={styles.statsGrid}>
                        <ProgressBar stat_name='Strength' stat_value={char_strength} bar_color='red'/>
                        <ProgressBar stat_name='Agility' stat_value={char_agility} bar_color='blue'/>
                        <ProgressBar stat_name='Stamina' stat_value={char_stamina} bar_color='green'/>
                        <ProgressBar stat_name='Intellect' stat_value={char_intellect} bar_color='purple'/>
                    </View>
                </View>
                
                <View style={[styles.childContainer, {flex:1}]}>
                    <NavTab navigation={navigation}/>
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
        justifyContent: 'center',  
        gap: 10,    
    },

    childContainer: {
        alignItems:'center',
        justifyContent: 'center',     
    },

    logout: {
        flexDirection: "row", 
        alignItems:'center', 
        gap:5, 
        borderWidth:1, 
        borderRadius: 10,
        borderColor:'white', 
        padding:8,
    },

    statsGrid: {
        width:328, 
        height:328, 
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },

    bar: {
        height: 20,
        width: 328,
        borderWidth: 2,
        borderRadius: 5,    
    },
})