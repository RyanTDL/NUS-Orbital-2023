import {React, useState, useEffect} from "react";
import {Dimensions, Alert, StyleSheet, ImageBackground, Text, View, SafeAreaView, Modal, Image, Pressable} from 'react-native';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function BattlePage({navigation, route}) {

    let userStats = {
        name: route.params.userStats['title'],
        uid: route.params.userStats['uid'],
        friendID: route.params.userStats['friendID'],
        icon: route.params.userStats['icon'],
        strength: route.params.userStats['strength'],
        agility: route.params.userStats['agility'],
        stamina: route.params.userStats['stamina'],
        intellect: route.params.userStats['intellect']
    };

    let friendStats = {
        name: route.params.friendStats[0],
        icon: route.params.friendStats[1],
        strength: route.params.friendStats[2],
        agility: route.params.friendStats[3],
        stamina: route.params.friendStats[4],
        intellect: route.params.friendStats[5]
    };

    //player icons, keep getting call stack error :(
    const userIcon = require('../../assets/player_avatars/always_late.png');
    const friendIcon = require('../../assets/player_avatars/star_athlete.png');  
    // const userIcon = require(userStats.icon);
    // const friendIcon = require(friendStats.icon);


    const [healStat, setHealStat] = useState(userStats.stamina+40);
    const [friendHealStat, setFriendHealStat] = useState(friendStats.stamina+40);

    const [attackStat, setAttackStat] = useState(userStats.strength);
    const [friendAttackStat, setFriendAttackStat] = useState(friendStats.strength);

    const [ultiStat, setUltiStat] = useState(userStats.strength);
    const [friendUltiStat, setFriendUltiStat] = useState(friendStats.strength);

    const [runModalVisible, setRunModalVisible]= useState(false);


    //Load Font 
    const [loaded] = useFonts({
        'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),      
    });
    if(!loaded) {
        return null;
    }

    const healClick = () => {
        const newHealstat = healStat + 10;
        setHealStat(newHealstat <= 100 ? newHealstat : 100);
        console.log(`updated ${healStat}`);
        };

    const attackClick = () => {
        const newFriendHealstat = friendHealStat - attackStat;
        setFriendHealStat(newFriendHealstat >= 0 ? newFriendHealstat : 0);
        console.log(`updated ${friendHealStat}`);
        };
    
    const ultiClick = () => {
        const newFriendHealstat = friendHealStat - ultiStat;
        setFriendHealStat(newFriendHealstat >= 0 ? newFriendHealstat : 0);
        console.log(`updated ${friendHealStat}`);
        };

    
    
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.playersInfoContainer}>

                <View style={styles.playerInfo}> 
                    <ImageBackground style={styles.infoBackground}
                        source={require('../../assets/battlesystem/playerInfoBackground.jpg')}
                        > 

                        <View style={styles.playerIcon}>
                            <Image source={userIcon}/>
                            <Text style={styles.playerName}>
                            {userStats.name}
                            </Text>
                        </View> 

                        <View style={{flex: 2}}>
                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/heart.png')}
                                        />
                                </View>
                                
                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarinside,{ backgroundColor:'#fc080d', width: `${healStat}%`}]}>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.playerStats}> 
                                <View style={{flex: 0.2}}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/power.png')}
                                        />
                                </View>

                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarinside,{backgroundColor:'#D5B71C', width: '100%'}]}>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.playerInfo}> 
                    <ImageBackground style={styles.infoBackground}
                        source={require('../../assets/battlesystem/playerInfoBackground.jpg')}
                        > 

                        <View style={styles.playerIcon}>
                            <Image source={friendIcon}/>
                            <Text style={styles.playerName}>
                            {friendStats.name}
                            </Text>
                        </View> 

                        <View style={{flex: 2}}>
                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/heart.png')}
                                        />
                                </View>
                                
                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarinside,{ backgroundColor:'#fc080d', width: `${friendHealStat}%` }]}>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.playerStats}> 
                                <View style={{flex: 0.2}}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/power.png')}
                                        />
                                </View>

                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarinside,{backgroundColor:'#D5B71C', width: '100%'}]}>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>


            </View>

            <View style={styles.animationwindow}>
                <Image 
                    style={styles.battlebackgroundimage}
                    source={require('../../assets/battlesystem/battlebackground.jpg')}
                />
            </View>

            <View style={styles.infobox}>
                <Text style={[styles.text, {textAlign: "left", paddingLeft: 15}]}> 
                    Choose your next move!
                </Text>
            </View>

            <View style={styles.inputbox}>

                <View style={styles.movesContainer}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.attackButton,
                            pressed && {opacity: 0.7}, 
                        ]}  
                        onPress = {() => {
                            console.log('Attack');
                            attackClick();
                            }}
                        >
                        {({ pressed }) => (<Text style={[styles.text, {fontSize: 20}]}>{pressed ? 'ATTACK!' : 'ATTACK'}</Text>
                        )}
                    </Pressable>

                    <Pressable 
                        style={({pressed}) => [
                            styles.ultimateButton,
                            pressed && {opacity: 0.7}, 
                        ]} 
                        

                        onPress = {() => console.log('ULTIMATE')}>
                        {({ pressed }) => (<Text style={[styles.text, {fontSize: 17}]}>{pressed ? 'CHARGING!' : 'ULTIMATE'}</Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.movesContainer}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.healButton,
                            pressed && {opacity: 0.7}, 
                        ]} 

                        onPress={() => {
                            console.log('HEAL');
                            healClick();
                        }}
                        > 
                        {({ pressed }) => (<Text style={[styles.text, {fontSize: 20}]}>{pressed ? 'HEALING!' : 'HEAL'}</Text>
                        )}
                        </Pressable>            
                        
                        <Pressable 
                            style={({pressed}) => [
                                styles.runButton,
                                pressed && {opacity: 0.7}, 
                            ]} 
                        onPress={() => {
                            console.log('RUN');
                            setRunModalVisible(true);
                        }}> 
                            <Text style={styles.text}> RUN </Text>
                        </Pressable>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={runModalVisible}
                            >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.abandonText}>Abandon Battle?</Text>

                                    <View style={styles.modalContentChild}>
                                        <Pressable
                                            onPress={() => {
                                                setRunModalVisible(!runModalVisible);
                                                navigation.navigate('Friends List');
                                            }}
                                            style={styles.modalButton}
                                        >
                                            <Text style={styles.yesNoText}>YES</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setRunModalVisible(!runModalVisible)}
                                            style={styles.modalButton}
                                        >
                                            <Text style={styles.yesNoText}>NO</Text>
                                        </Pressable>
                                    </View>

                                </View>
                            </View>
                        </Modal>             
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: 'black',   
    },

    playersInfoContainer: {
        flex: 0.7,
        flexDirection: 'row', 
    },

    playerInfo: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,       
    },

    infoBackground: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',

    },

    playerIcon: {
        flex: 3,
        alignItems: 'center',
        paddingTop: 10,
    },

    playerName: {
        flex: 1,
        fontWeight: '400',
        fontSize: 28,
        textAlign: 'center',
        textAlignVertical: 'bottom',
        color: '#FFFFFF',
    },

    playerStats: {
        flex: 1,
        flexDirection: 'row',
    },


    statusbar: {
        flex: 1,
        height:25, 
        marginEnd: 8,
        overflow: 'hidden',
    },

    statusbarinside: {
        flex: 1,
        height:25, 
        borderWidth:1.5, 
        borderRadius: 6, 
        borderColor:'black', 
        marginEnd: 8,
    },

    animationwindow: {
        flex: 1,
        backgroundColor: 'black',
        marginBottom: 0,  
    },

    battlebackgroundimage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderWidth: 4,
        borderColor: 'black',
        borderRadius: 7,
    },

    infobox: {
        flex: 0.4,
        backgroundColor: 'rgba(151, 151, 151, 0.87)',
        borderWidth: 4,
        borderColor: 'rgba(48, 48, 48, 0.75)',
        borderRadius: 7,
        boxSizing: 'border-box',
        justifyContent: 'space-evenly',

    },

    inputbox: {
        flex: 0.8,
        backgroundColor: 'rgba(151, 151, 151, 0.87)',
        borderWidth: 4,
        borderColor: 'rgba(48, 48, 48, 0.75)',
        borderRadius: 7,
        boxSizing: 'border-box',
      },

    movesContainer: {
        flex: 1,
        flexDirection: "row",
    },

    attackButton:{
        flex: 1,
        margin: 3,
        borderWidth: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fc080d',
        borderColor: '#8e0000' 
    },

    ultimateButton:{
        flex: 1,
        margin: 3,
        borderWidth: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D5B71C',
        borderColor: '#635f09'
    },

    healButton:{
        flex: 1,
        margin: 3,
        borderWidth: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#61A631',
        borderColor: '#0E6600' 
    },

    runButton:{
        flex: 1,
        margin: 3,
        borderWidth: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#76C4E8',
        borderColor: '#0098BA' 
    },

    text:{
        fontFamily: "PressStart2P-Regular",
        fontWeight: '400',
        fontSize: 25,
        lineHeight: 30,
        color: '#FFFFFF',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2.2, height: 3.5 },
        textShadowRadius: 4,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080', // Semi-transparent background
      },
      modalContent: {
        flexDirection: 'column',
        backgroundColor: 'white',
        height: 200,
        width: 300,
        borderRadius: 5,
        borderWidth: 10,
        borderColor: '#76C4E8'
      },

      modalContentChild: {
        flex: 1.2,
        flexDirection: 'row',
        padding: 15,
      },

      modalButton: {
        flex: 1,
        backgroundColor: '#0098BA',
        borderRadius: 5,
        padding: 10,
        margin: 5,
      },

      abandonText: {
        flex: 1,
        fontFamily: "PressStart2P-Regular",
        fontWeight: '700',
        fontSize: 30,
        textAlign: 'center',
        verticalAlign: 'middle',
      },

      yesNoText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 30,
        textAlign: 'center',
      },

})