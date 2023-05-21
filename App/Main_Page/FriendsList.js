import React from "react";
import {Dimensions, StyleSheet, Text, View, SafeAreaView, FlatList, Image} from 'react-native';
import NavTab from "./NavTab";
import AppButton from "../Signing_In/Button";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

const FriendsData= [
    {
        id:'1',
        title: 'James',
        icon: require('../../assets/player_avatars/gym_bro.png'),
        strength: '72',
        agility: '43',
        stamina: '41',
        intellect: '91'
    },

    {
        id:'2',
        title: 'Zachary',
        icon: require('../../assets/player_avatars/star_athlete.png'),
        strength: '53',
        agility: '53',
        stamina: '72',
        intellect: '52'
    },

    {
        id:'3',
        title: 'William',
        icon: require('../../assets/player_avatars/always_late.png'),
        strength: '81',
        agility: '64',
        stamina: '73',
        intellect: '61'
    },

    {
        id:'4',
        title: 'Sarah',
        icon: require('../../assets/player_avatars/gym_bro.png'),
        strength: '42',
        agility: '63',
        stamina: '92',
        intellect: '41'
    },

    {
        id:'5',
        title: 'Grace',
        icon: require('../../assets/player_avatars/bell_curve.png'),
        strength: '33',
        agility: '73',
        stamina: '78',
        intellect: '79'
    },

    {
        id:'6',
        title: 'Dave',
        icon: require('../../assets/player_avatars/star_athlete.png'),
        strength: '72',
        agility: '93',
        stamina: '97',
        intellect: '41'
    },

    {
        id:'7',
        title: 'Elias',
        icon: require('../../assets/player_avatars/gym_bro.png'),
        strength: '52',
        agility: '73',
        stamina: '72',
        intellect: '81'
    },

    {
        id:'8',
        title: 'Karen',
        icon: require('../../assets/player_avatars/bell_curve.png'),
        strength: '63',
        agility: '53',
        stamina: '58',
        intellect: '89'
    },

    {
        id:'9',
        title: 'Philip',
        icon: require('../../assets/player_avatars/always_late.png'),
        strength: '57',
        agility: '46',
        stamina: '77',
        intellect: '43'
    },
]


export default function FriendsList({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.child_container, {flex:1}]}>
                <Text style={{color:'white', fontSize:20, fontWeight:'700',}}>Friends List</Text>
            </View>
            
            <View style={[styles.child_container, {flex:6}]}>
                    <View style={{width:334, height:400, borderWidth:2, borderRadius: 10, borderColor:'white', backgroundColor:'white'}}>
                        <FriendSection />
                    </View>
                    
            </View>

            <View style={[styles.child_container, {flex:1, flexDirection:"row", gap:10}]}>
                <AppButton 
                    title="Add New Friend" 
                    onPress={()=> {
                        return (
                            console.log('New friend added')
                        );
                    }}
                    buttonStyle={styles.appButtonContainer}
                    textStyle= {styles.appButtonText}
                />
                <AppButton 
                    title="Remove Friend" 
                    onPress={()=> {
                        return (
                            console.log('Friend Removed')
                        );
                    }}
                    buttonStyle={styles.appButtonContainer}
                    textStyle= {styles.appButtonText}
                />
            </View>   

            <View style={[styles.child_container, {flex:1}]}>
                <NavTab navigation={navigation}/>
            </View>    

        </SafeAreaView>
        
    );
}



function Friend_Box({player, player_icon, strength, agility, stamina, intellect}) {
    return (
        <View style={styles.player_info}>
            <Image source={player_icon}/>
            <View>
                <Text style={{fontSize:12, fontWeight: 500}}>{player}</Text>
                <Text style={{fontSize:12, fontWeight: 300}}> Strength: {strength}/100  Agility: {agility}/100</Text>
                <Text style={{fontSize:12, fontWeight: 300}}> Stamina: {stamina}/100  Intellect:{intellect}/100</Text>
            </View>
            <AppButton 
                title="Fight"
                onPress={()=> {
                    return (
                        console.log('Begin Battle!!')
                    );
                }}
                buttonStyle={styles.battleButtonContainer}
                textStyle= {styles.battleButtonText}
            />
            
        </View>
    )
}

function FriendSection() {
    return (
        <FlatList
        data={FriendsData}
        renderItem={({item}) => 
            <Friend_Box
                player={item.title}
                player_icon={item.icon}
                strength={item.strength}
                agility={item.agility}
                stamina={item.stamina}
                intellect={item.intellect}
            />}
        />
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

    battleButtonContainer: {
        backgroundColor: "#9C3FE4",
        width: 60,
        height: 25,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: 'center',
    },

    battleButtonText: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "bold",

        textTransform: "uppercase"
    },

    player_info: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DEE8EB',
        backgroundColor: '#DEE8EB',
        gap: 10,
        margin:2,
    },

    friend_section: {
        gap: 8,
    },

    appButtonContainer: {
        marginTop: 20,
        backgroundColor: "#9C3FE4",
        width: 155,
        paddingVertical: 16,
        borderRadius: 8,
    },

    appButtonText: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
})