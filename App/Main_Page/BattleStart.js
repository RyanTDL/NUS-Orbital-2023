import React, { useContext, useState } from "react";
import {Dimensions, StyleSheet, ImageBackground, Text, View, SafeAreaView, FlatList, Image, Pressable} from 'react-native';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Center } from "native-base";


export default function BattlePage({navigation, route}) {

    //Heal button
    const stamina = parseInt(route.params.friendinfo[4]);
    console.log(`original stamina is ${stamina}`);
    const [healstat, sethealstat] = useState(stamina);

    //Load Font 
    const [loaded] = useFonts({
        'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),      
    });
    if(!loaded) {
        return null;
    }

    const friendIcon = route.params.friendinfo[1] ;
    console.log(friendIcon);

    const healClick = () => {
        const newHealstat = healstat + 20;
        sethealstat(newHealstat <= 100 ? newHealstat : 100);
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.playersInfoContainer}>

                <View style={styles.playerInfo}> 
                    <ImageBackground style={styles.infoBackground}
                        source={require('../../assets/battlesystem/playerInfoBackground.jpg')}
                        > 

                        <View style={styles.playerIcon}>
                            <Image source={require('../../assets/player_avatars/star_athlete.png')}/>
                            <Text style={styles.playerName}>
                            User203
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
                                    <View style ={[styles.statusbar,{ backgroundColor:'#fc080d', width: `${healstat}%`}]}>
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
                                    <View style ={[styles.statusbar,{backgroundColor:'#D5B71C', width: '100%'}]}>
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
                            <Image source={require('../../assets/player_avatars/star_athlete.png')}/>
                            <Text style={styles.playerName}>
                            {route.params.friendinfo[0]}
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
                                    <View style ={[styles.statusbar,{ backgroundColor:'#fc080d', width: '100%' }]}>
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
                                    <View style ={[styles.statusbar,{backgroundColor:'#D5B71C', width: '100%'}]}>
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
                    <Pressable style={[styles.movesButton, {backgroundColor: '#fc080d',borderColor: '#8e0000'}]}  
                    onPress = {() => console.log('Attack')}>
                        <Text style={[styles.text, {fontSize: 20}]}> ATTACK </Text>
                    </Pressable>

                    <Pressable style={[styles.movesButton, {backgroundColor: '#D5B71C',borderColor: '#635f09'}]} 
                    onPress = {() => console.log('ULTIMATE')}>
                        <Text style={[styles.text, {fontSize: 17}]}> ULTIMATE </Text>
                    </Pressable>
                </View>

                <View style={styles.movesContainer}>
                    <Pressable style={[styles.movesButton, {backgroundColor: '#61A631',borderColor: '#0E6600' }]}

                    onPress={() => {
                        console.log('HEAL');
                        healClick();
                        console.log(`updated ${healstat}`);
                    }}
                    > 
                        <Text style={styles.text} > HEAL </Text>
                        </Pressable>


                    <Pressable style={[styles.movesButton, {backgroundColor: '#76C4E8',borderColor: '#0098BA'}]} 
                    onPress={() => {
                        console.log('RUN');
                        navigation.navigate('Friends List');
                    }}> 
                        <Text style={styles.text}> RUN </Text>
                    </Pressable>
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
        width: 10,
        height:25, 
        borderWidth:2, 
        borderRadius: 5, 
        borderColor:'black', 
        backgroundColor: 'grey',
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

    movesButton:{
        flex: 1,
        margin: 3,
        borderWidth: 8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
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

})