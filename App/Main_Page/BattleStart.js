import React, { useContext, useState } from "react";
import {Dimensions, StyleSheet, ImageBackground, Text, View, SafeAreaView, FlatList, Image, Pressable} from 'react-native';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Center } from "native-base";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function BattlePage({navigation, route}) {

    //Load Font 
    const [loaded] = useFonts({
        'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),      
    });
    if(!loaded) {
        return null;
    }

    let friend_icon = route.params.friendinfo[1] ;
    console.log(friend_icon);

    //Heal button (Work in progress)
    let healthstat = parseInt(route.params.friendinfo[4]);
    // const [healthstat, sethealthstat] = useState(parseInt(route.params.friendinfo[4]));

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.players_info_container}>
       
                <View style={styles.player_info}> 
                    <ImageBackground
                  source={require('../../assets/battlesystem/playerholder.jpg')}
                  style={styles.player_info}
                  > 

                  <View style={styles.playeridentity}>
                      <Image source={require('../../assets/player_avatars/star_athlete.png')}/>
                      <Text style={styles.playername}>
                      User203
                      </Text>
                  </View> 
                  
                  <View style={styles.playerstats}>
                      <View style={styles.playerstats_child}>
                          <View style={styles.playerstatsicon}>
                              <Image
                                  style={{
                                      flex: 1,
                                      width: 30,
                                      resizeMode: 'contain',
                                  }}
                                  source={require('../../assets/battlesystem/heart.png')}
                                  />

                          </View>
                          

                          <View style={styles.statusbar}>
                            <View style ={[styles.statusbar,{ backgroundColor:'#fc080d', width: healthstat}]}>
                                
                            </View>
                          </View>

                      </View>

                      <View style={styles.playerstats_child}> 
                          <View style={styles.playerstatsicon}>
                              <Image
                                  style={{
                                      flex: 1,
                                      width: 30,
                                      resizeMode: 'contain',
                                  }}
                                  source={require('../../assets/battlesystem/power.png')}
                                  />
                          </View>

                          <View style={styles.statusbar}>
                            <View style ={[styles.statusbar,{backgroundColor:'#D5B71C', width: parseInt(route.params.friendinfo[5])}]}>
                                
                            </View>
                          </View>

                      </View>
                  </View>
                    </ImageBackground>

                </View>

                <View style={styles.player_info}> 
                <ImageBackground
                  source={require('../../assets/battlesystem/playerholder.jpg')}
                  style={styles.player_info}
                  > 

                  <View style={styles.playeridentity}>
                  <Image source={require('../../assets/player_avatars/star_athlete.png')}/>
                  {/* <Image source={require({friend_icon})}/> */}


                      <Text style={styles.playername}>
                      {route.params.friendinfo[0]}
                      </Text>
                  </View> 
                  
                  <View style={styles.playerstats}>
                      <View style={styles.playerstats_child}>
                          <View style={styles.playerstatsicon}>
                              <Image
                                  style={{
                                      flex: 1,
                                      width: 30,
                                      resizeMode: 'contain',
                                  }}
                                  source={require('../../assets/battlesystem/heart.png')}
                                  />

                          </View>
                          

                          <View style={styles.statusbar}>
                            <View style ={[styles.statusbar,{backgroundColor:'#fc080d', width: parseInt(route.params.friendinfo[4])}]}>
                                
                            </View>
                          </View>

                      </View>

                      <View style={styles.playerstats_child}> 
                          <View style={styles.playerstatsicon}>
                              <Image
                                  style={{
                                      flex: 1,
                                      width: 30,
                                      resizeMode: 'contain',
                                  }}
                                  source={require('../../assets/battlesystem/power.png')}
                                  />
                          </View>

                          <View style={styles.statusbar}>
                            <View style ={[styles.statusbar,{backgroundColor:'#D5B71C', width: parseInt(route.params.friendinfo[5])}]}>
                                
                            </View>
                          </View>

                      </View>
                  </View>
                    </ImageBackground>


                </View>


            </View>

            <View style={styles.animationwindow}>
                <Image 
                source={require('../../assets/battlesystem/battlebackground.jpg')}
                style={styles.battlebackgroundimage}
                />
            </View>
            <View style={styles.infobox}>
                <Text style={[styles.text, {textAlign: "left", paddingLeft: 15}]}> 
                    Choose your next move!
                </Text>
            </View>


            <View style={styles.inputbox}>

                <View style={styles.moves_container}>
                    <Pressable style={[styles.moves_button, {backgroundColor: '#fc080d',orderColor: '#8e0000'}]}  
                    onPress = {() => console.log('Attack')}>
                        <Text style={styles.text}> ATTACK </Text>
                    </Pressable>

                    <Pressable style={[styles.moves_button, {backgroundColor: '#D5B71C',orderColor: '#635f09'}]} 
                    onPress = {() => console.log('ULTIMATE')}>
                        <Text style={[styles.text, {fontSize: 19}]}> ULTIMATE </Text>
                    </Pressable>
                </View>

                <View style={styles.moves_container}>
                    <Pressable style={[styles.moves_button, {backgroundColor: '#61A631',orderColor: '#0E6600'}]} 
                    // onPress = {() => console.log('HEAL')}>   

                    onPress={ () => {
                    return (
                        console.log('HEAL'),
                        healthstat += 10
                    )}

                }>
                        <Text style={styles.text}> HEAL </Text>


                        </Pressable>


                    <Pressable style={[styles.moves_button, {backgroundColor: '#76C4E8',orderColor: '#0098BA'}]} 
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

    players_info_container: {
        flex: 0.7,
        backgroundColor: 'black',
        flexDirection: 'row', 
    },

    player_info: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,       
    },


    playeridentity: {
        //playericon
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,

    },


    playername: {
        flex: 1,
        fontWeight: '400',
        fontSize: 25,
        textAlign: 'center',
        textAlignVertical: 'bottom',
        color: '#FFFFFF',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 4,      
    },

    playerstats: {
        flex: 2,
        flexDirection: 'column',
        // borderColor: 'red',
        // borderWidth: 5,
    },
    playerstats_child: {
        flex: 1,
        flexDirection: 'row',
    },

    playerstatsicon: {
        flex: 0.2,
    },

    statusbar: {
        flex: 1,
        width: 10,
        height:25, 
        borderWidth:2, 
        borderRadius: 5, 
        borderColor:'black', 
        backgroundColor: 'grey',
        
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

    moves_container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-evenly',
    },

    moves_button:{
        flex: 1,
        borderWidth: 5,
        borderRadius: 15,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
        justifyContent: 'center',

    },

    text:{
        fontFamily: "PressStart2P-Regular",
        fontWeight: '400',
        fontSize: 25,
        lineHeight: 30,
        textAlign: 'center',
        color: '#FFFFFF',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 3.5 },
        textShadowRadius: 4,
    
    },

})