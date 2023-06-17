import React from "react";
import {TouchableOpacity, Image, View, Button, StyleSheet, Text } from "react-native";
import { Ionicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';

export default function NavTab({navigation}){
    return (
        <View style={styles.container}>

            {/* Use navigation.replace() instead of navigation.navigate() as it allows the screen to re-render when changing screens
            https://stackoverflow.com/questions/60182942/useeffect-not-called-in-react-native-when-back-to-screen */}

            <TouchableOpacity onPress={()=>navigation.replace('Home Screen')} style={styles.gridBox}>
                <Ionicons name="home-outline" size={24} color="#B3B3B3" />                
                <Text style={styles.navText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.replace('Daily Log')} style={styles.gridBox}>
                <AntDesign name="book" size={24} color="#B3B3B3" />
                <Text style={styles.navText}>Daily Log</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.replace('Weekly Activity')} style={styles.gridBox}>
                <AntDesign name="linechart" size={24} color="#B3B3B3" />
                <Text style={styles.navText}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.replace('Friends List')} style={styles.gridBox}>
                <FontAwesome5 name="user-friends" size={24} color="#B3B3B3" />
                <Text style={styles.navText}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.replace('Battle')} style={styles.grid_box}>
                <FontAwesome5 name="user-friends" size={24} color="#B3B3B3" />
                <Text style={styles.nav_text}>Battle</Text>
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

    gridBox: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },

    navText: {
        // fontWeight: ,
        fontSize: 14,
        color: '#B3B3B3',
    },
})