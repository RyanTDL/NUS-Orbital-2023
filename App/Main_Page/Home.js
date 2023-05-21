import React, {useState} from "react";
import {Animated, Dimensions, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import NavTab from "./NavTab";


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
                    <ProgressBar stat_name='Strength' stat_value='70' bar_color='red'/>
                    <ProgressBar stat_name='Agility' stat_value='48' bar_color='blue'/>
                    <ProgressBar stat_name='Stamina' stat_value='92' bar_color='green'/>
                    <ProgressBar stat_name='Intellect' stat_value='81' bar_color='purple'/>
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