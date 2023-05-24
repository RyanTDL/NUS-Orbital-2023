import React, {useEffect, useState} from "react";
import {Animated, Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import NavTab from "./NavTab";
import {db} from "../../firebase";
import {collection, getDocs} from "firebase/firestore";


const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen


function ProgressBar({stat_name, stat_value, bar_color}) {
    return (
        <View>
            <Text style={{color:'white', fontSize:25, marginVertical: 3}}>{stat_name}:{' '}  
                <Text style={{fontWeight:200}}>
                    {stat_value}/100
                </Text>
            </Text>

            <View style={[styles.bar, {borderColor: 'white', backgroundColor:'white'}]}>
                <Animated.View style={[StyleSheet.absoluteFill, {backgroundColor:bar_color, width:(stat_value +'%')}]}/>
            </View>
        </View>
    );
}


export default function HomeScreen({navigation}) {


    const [char_strength, setCharStrength]= useState('')
    const [char_agility, setCharAgility]= useState('')
    const [char_stamina, setCharStamina]= useState('')
    const [char_intellect, setCharIntellect]= useState('') 

    const getFromDatabase = async() => {
    
        let strength_stat= 0
        let agility_stat= 0
        let stamina_stat= 0
        let intellect_stat= 0
    
        const querySnapshot= await getDocs(collection(db, "Player"))
        querySnapshot.forEach((doc)=>{
            strength_stat += doc.data()['Strength']
            agility_stat += doc.data()['Agility']
            stamina_stat += doc.data()['Stamina']
            intellect_stat += doc.data()['Intellect']
        })
    
        //Converting hours/steps into the respective stat points
        added_strength_points = strength_stat
        added_agility_points = Math.trunc(agility_stat/10000)
        added_stamina_points = Math.trunc(stamina_stat/7)
        added_intellect_points =Math.trunc(intellect_stat/3)
    
        setCharStrength(added_strength_points);
        setCharAgility(added_agility_points);
        setCharStamina(added_stamina_points);
        setCharIntellect(added_intellect_points);
    }

    useEffect(()=>{
        getFromDatabase();
    }, [])

    return (
        <SafeAreaView style={styles.container}>

            <View style={[styles.child_container, {flex:1}]}>
                <View style={{marginTop:30}}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'200'}}>Welcome back,</Text>
                    <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>Muthukumaran Yogeeswaran</Text>
                </View>
            </View>

            <View style={[styles.child_container, {flex:3}]}>
                <View style={{width:250, height:250, borderWidth:2, borderRadius: 200, borderColor:'white', backgroundColor: 'white'}}></View>
            </View>

            <View style={[styles.child_container, {flex:4}]}>
                <View style={styles.stats_grid}>
                    <ProgressBar stat_name='Strength' stat_value={char_strength} bar_color='red'/>
                    <ProgressBar stat_name='Agility' stat_value={char_agility} bar_color='blue'/>
                    <ProgressBar stat_name='Stamina' stat_value={char_stamina} bar_color='green'/>
                    <ProgressBar stat_name='Intellect' stat_value={char_intellect} bar_color='purple'/>
                </View>
            </View>
            
            <View style={[styles.child_container, {flex:1}]}>
                <NavTab navigation={navigation}/>
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
        gap: 10,    
    },

    child_container: {
        // borderWidth: 1, 
        // borderColor:'red',
        alignItems:'center',
        justifyContent: 'center',     
    },

    stats_grid: {
        width:328, 
        height:328, 
        // borderWidth:2, 
        // borderColor:'white',
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