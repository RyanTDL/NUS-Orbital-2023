import React, { useContext } from "react";
import {Dimensions, StyleSheet, ImageBackground, Text, View, SafeAreaView, FlatList, Image, Pressable} from 'react-native';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';



const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen




export default function BattlePage({navigation, route}) {

    console.log(route.params.friendinfo);
    console.log(route.params.friendinfo[0]);



    //Load Font 
    const [loaded] = useFonts({
        'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),      
    });
    if(!loaded) {
        return null;
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.playerinfo}>
       
                <View style={styles.playerholderimage}> 
                    <ImageBackground
                    source={require('../../assets/battlesystem/playerholder.jpg')}
                    style={styles.playerholderimage}
                    > 

                    <View style={styles.playeridentity}>
                        <Image source={require('../../assets/player_avatars/gym_bro.png')}/>
                        <Text style={styles.playername}>
                        {route.params.friendinfo[0]}
                        </Text>
                    </View> 
                    

                    <View style={styles.playerstats}>
                        <View >
                        <Image source={require('../../assets/battlesystem/heart.png')} style={styles.playerstatsicon} />
                        </View>

                        <View >
                        <Image source={require('../../assets/battlesystem/power.png')} style={styles.playerstatsicon}/>
                        </View>

                    </View>

                    </ImageBackground>

                </View>

                <View style={styles.playerholderimage}> 
                    <ImageBackground
                    source={require('../../assets/battlesystem/playerholder.jpg')}
                    style={styles.playerholderimage}
                    > 

                    <View style={styles.playeridentity}>
                        <Image source={require('../../assets/player_avatars/gym_bro.png')}/>
                        <Text style={styles.playername}>
                        {route.params.friendinfo[0]}
                        </Text>
                    </View> 
                    

                    <View style={styles.playerstats}>
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
                    onPress = {() => console.log('FIGHT')}>
                        <Text style={styles.text}> FIGHT </Text>
                    </Pressable>

                    <Pressable style={[styles.moves_button, {backgroundColor: '#D5B71C',orderColor: '#635f09'}]} 
                    onPress = {() => console.log('ULTIMATE')}>
                        <Text style={[styles.text, {fontSize: 20}]}> ULTIMATE </Text>
                    </Pressable>
                </View>

                <View style={styles.moves_container}>
                    <Pressable style={[styles.moves_button, {backgroundColor: '#61A631',orderColor: '#0E6600'}]} 
                    onPress = {() => console.log('HEAL')}>   
                        <Text style={styles.text}> HEAL </Text>
                        </Pressable>

                    <Pressable style={[styles.moves_button, {backgroundColor: '#76C4E8',orderColor: '#0098BA'}]} 
                    onPress={() => {
                        console.log('RUN');
                        navigation.navigate('Battle');
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
        gap: 1, 
        padding: 0,
        margin: 0, 
        
    },

    playerinfo: {
        flex: 0.7,
        backgroundColor: 'black',
        marginBottom: 0, 
        flexDirection: 'row', 
        borderColor: 'blue',
        justifyContent: 'center',
    },

    playerholderimage: {
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
        flexDirection: 'row',
        borderWidth: 4,
        borderColor: 'white',
 
    },

    playerstatsicon: {
        flex: 1,
        resizeMode: 'cover',
   
    },


    box: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 4,
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
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 4,
    
    },

})