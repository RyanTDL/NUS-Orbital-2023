import React, {Component} from "react";
import {TouchableOpacity, Image, View, Button, StyleSheet, Text } from "react-native";


export default function NavTab({navigation}){
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>navigation.navigate('Home Screen')} style={styles.grid_box}>
                <Image source={require('../../assets/navbar_icons/Home.png')}/>
                <Text style={styles.nav_text}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Daily Log')} style={styles.grid_box}>
                <Image source={require('../../assets/navbar_icons/DailyLog.png')}/>
                <Text style={styles.nav_text}>Daily Log</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Weekly Activity')} style={styles.grid_box}>
                <Image source={require('../../assets/navbar_icons/Activity.png')}/>
                <Text style={styles.nav_text}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Friends List')} style={styles.grid_box}>
                <Image source={require('../../assets/navbar_icons/Friends.png')}/>
                <Text style={styles.nav_text}>Friends</Text>
            </TouchableOpacity>
        </View>
    );
} 

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: 350,
        height: 70,
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 36,
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    grid_box: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // nav_img : {
    //     tintColor: 'red',
    // },

    nav_text: {
        // fontWeight: ,
        fontSize: 14,
        color: '#B3B3B3',
    },
})