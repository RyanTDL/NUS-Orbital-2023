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

    const [infoText, setInfoText]= useState('Choose your next move!');
    
    const [runModalVisible, setRunModalVisible]= useState(false);
    const [runGameOverModal, setRunGameOverModal]= useState(false);
    const [winner, setWinner] = useState();

    const [healStat, setHealStat] = useState(userStats.stamina+50);
    const [friendHealStat, setFriendHealStat] = useState(friendStats.stamina+50);

    const [attackStat, setAttackStat] = useState(userStats.strength);
    const [friendAttackStat, setFriendAttackStat] = useState(friendStats.strength);

    //Ulti Button with charging feature
    const [ultiLimit, setUltiLimit] = useState(userStats.intellect+10);
    const [friendUltiLimit, setFriendUltiLimit] = useState(friendStats.intellect+10);

    const [ultiUsed, setUltiUsed] = useState(0);
    const [friendUltiUsed, setFriendUltiUsed] = useState(false);

    const [ultiLeft, setUltiLeft] = useState(0);
    const [friendUltiLeft, setFriendUltiLeft] = useState(0);

    const [isCharging, setIsCharging] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isUltiButtonDisabled, setIsUltiButtonDisabled] = useState(false);
    const [ultiButtonLabel, setUltiButtonLabel] = useState('ULTIMATE');

    //Auto battle
    const [autoBattle, setAutoBattle] = useState(false);
    const [isBotMakingMove, setIsBotMakingMove] = useState(false); // Track if bot is making a move

    useEffect(() => {
        if (autoBattle) {
          // Automatically perform bot move after the user's move
          performBotMove();
          setAutoBattle(false);
        }
      }, [autoBattle]); // Triggers the bot move

    //Console log ulti charging feature
    useEffect(() => {
        console.log(`Ulti used: ${ultiUsed}`);
        console.log(`Ulti left: ${ultiLeft}`);
    }, [ultiUsed,ultiLeft]);


    useEffect(() => {
        if (ultiUsed === 0) {
          setIsUltiButtonDisabled(false); // Enable the ultimate button
          setUltiButtonLabel('ULTIMATE'); // Reset the label
        } else if (ultiUsed >= ultiLimit) {
          setIsUltiButtonDisabled(true); // Disable the ultimate button when the limit is reached
          setInfoText("WARNING!\nULIIMATE is charged!");
        }
      }, [ultiUsed, ultiLimit]);

    useEffect(() => {
        if (ultiLeft >= 100) {
            setIsUltiButtonDisabled(true); // Disable the ultimate button when ultiLeft reaches 100
          }
          
        else if (autoBattle && !isBotMakingMove) {
            setIsBotMakingMove(true); // Disable buttons when it's the bot's turn
            performBotMove();
            setAutoBattle(false);
        }
    }, [autoBattle, isBotMakingMove]);

    const startCharging = () => {
        setIsCharging(true);
        const id = setInterval(() => {
          setUltiLeft((prevUltiLeft) => {
            if (!isUltiButtonDisabled && prevUltiLeft < 100) {
              const newUltiLeft = prevUltiLeft + 1;
              return newUltiLeft <= 100 ? newUltiLeft : 100; // Limit ultileft to 100
            }
            return prevUltiLeft;
          });
      
          setUltiUsed((prevUltiUsed) => {
            if (prevUltiUsed < ultiLimit) {
              return prevUltiUsed + 1;
            }
            return prevUltiUsed;
          });
      
          if (ultiUsed >= ultiLimit) {
            setIsUltiButtonDisabled(true); // Disable the ultimate button
            setIsBotMakingMove(true); // Disable buttons when it's the bot's turn
            clearInterval(intervalId); // Stop the charging interval
            setIntervalId(null);
          }
        }, 100); // Adjust the interval duration as needed
        setIntervalId(id);
    };
      
    const stopCharging = () => {
        setIsCharging(false);
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
        setIsUltiButtonDisabled(true); // Disable the ultimate button on onPressOut
        setIsBotMakingMove(true); // Disable buttons after the user's move
        setAutoBattle(true);
    };
    
    //Load Font 
    const [loaded] = useFonts({
        'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),      
    });
    if(!loaded) {
        return null;
    }

    //Usermoves
    const attackClick = () => {
        if (ultiUsed === 0) {
            // Regular attack
            const newFriendHealstat = friendHealStat - attackStat;
            setFriendHealStat(newFriendHealstat >= 0 ? newFriendHealstat : 0);
            console.log(`Damage dealt by user: ${attackStat}`);
            setInfoText(`You dealt ${attackStat} damage!`);
            setIsBotMakingMove(true); // Disable buttons after the user's move
            setAutoBattle(true);
       
        } else {
            // Attack with ultimate
            const newFriendHealstat = friendHealStat - ultiUsed;
            setFriendHealStat(newFriendHealstat >= 0 ? newFriendHealstat : 0);
            console.log(`Ultimate Damage dealt by user: ${ultiUsed}`);
            setUltiUsed(0);
            setInfoText(`You dealt ${friendUltiLimit} damage using ultimate!`);
            setIsBotMakingMove(true); // Disable buttons after the user's move
            setAutoBattle(true);
            
            
        }

        if (healStat <= 0 || friendHealStat <= 0) {
            if (healStat <= 0 && friendHealStat <= 0) {
              setWinner("It's a tie!");
            } else if (healStat <= 0) {
              setWinner("You lost!");
            } else {
              setWinner("You won!");
            }
            setRunGameOverModal(true);
          }

        };

    const healClick = () => {
        const newHealstat = healStat + 10;
        setHealStat(newHealstat <= 100 ? newHealstat : 100);
        console.log(`User's current ${healStat}`);
        setInfoText(`You healed 10 health!`);
        setIsBotMakingMove(true); // Disable buttons after the user's move
        setAutoBattle(true);
        };

    //Botmoves
    const friendAttackClick = () => {
        if (friendUltiUsed) {
          // Attack with ultimate
          const newUserHealstat = healStat - friendUltiLimit;
          setHealStat(newUserHealstat >= 0 ? newUserHealstat : 0);
          console.log(`Ultimate damage dealt by bot: ${friendUltiLimit}`);
          setFriendUltiUsed(false);
          setIsBotMakingMove(false); // Enable buttons after the user's move
          setAutoBattle(false);
          setInfoText(`The enemy dealt ${friendUltiLimit} damage using ultimate!`);
        } else {
          // Regular attack
          const newUserHealstat = healStat - friendAttackStat;
          setHealStat(newUserHealstat >= 0 ? newUserHealstat : 0);
          console.log(`Damage dealt by bot: ${friendAttackStat}`);
          setInfoText(`The enemy dealt ${friendAttackStat} damage!`);
          setIsBotMakingMove(false); // Enable buttons after the user's move
          setAutoBattle(false);
        }

        if (healStat <= 0 || friendHealStat <= 0) {
            if (healStat <= 0 && friendHealStat <= 0) {
              setWinner("It's a tie!");
            } else if (healStat <= 0) {
              setWinner("You lost!");
            } else {
              setWinner("You won!");
            }
            setRunGameOverModal(true);
          }
      };

    const friendHealClick = () => {
        const newfriendHealstat = friendHealStat + 10;
        setFriendHealStat(newfriendHealstat <= 100 ? newfriendHealstat : 100);
        console.log(`Bot's current health ${friendHealStat}`);
        setInfoText(`The enemy healed 10 health!`);
        console.log(`Bot's current health ${friendHealStat}`);
        setIsBotMakingMove(false); // Enable buttons after the user's move
        setAutoBattle(false);
        };

    //Auto Battle
    const startAutoBattle = () => {
        setAutoBattle(true);
        performBotMove();
      };
    
    const performBotMove = () => {

        // Bot logic to choose a move
        const moves = ["attack", "ultimate", "heal"];
        const randomMoveIndex = Math.floor(Math.random() * moves.length);
        const randomMove = moves[randomMoveIndex];
      
        // Check if the ultimate has already been charged
        if (randomMove === "ultimate" && friendUltiUsed) {
          friendAttackClick(); // Perform a regular attack instead
          return;
        }
      
        // Perform the chosen move after a delay
        setTimeout(() => {
          switch (randomMove) {
            case "attack":
              friendAttackClick();
              break;
            case "ultimate":
              setInfoText("The enemy charged his ultimate!");
              setIsBotMakingMove(false); // Enable buttons after the user's move
              setFriendUltiLeft((prev) => prev + friendUltiLimit);
              setTimeout(() => {
                setFriendUltiUsed(true);
              }, 1000); // Delay of 2000 milliseconds (2 seconds)
              break;
            case "heal":
              friendHealClick();
              break;
            default:
              break;
          }
        }, 2000); // Delay of 4000 milliseconds (4 seconds)
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
                                    <View style ={[styles.statusbarinside,{backgroundColor:'#D5B71C', width: (100 - ultiLeft) + '%'}]}>
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
                                    <View style ={[styles.statusbarinside,{backgroundColor:'#D5B71C', width: (100 - friendUltiLeft) + '%'}]}>
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
                    {infoText}
                </Text>
            </View>

            <View style={styles.inputbox}>

                <View style={styles.movesContainer}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.attackButton,
                            pressed && {opacity: 0.7},
                            isBotMakingMove && {opacity: 0.3, backgroundColor: 'gray'}, // Apply styling to disable all the button 
                        ]}
                        disabled={isBotMakingMove} // Disable the button
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
                            (isUltiButtonDisabled && !isBotMakingMove) && {opacity: 0.5, backgroundColor: 'gray'}, // Apply styling to disable the isUltiButtonDisabled button
                            isBotMakingMove && {opacity: 0.3, backgroundColor: 'gray'}, // Apply styling to disable the isBotMakingMove button
                        ]}
                        disabled={isUltiButtonDisabled || isBotMakingMove} // Disable the button
                        onPressIn={() => {
                            if (ultiUsed>=ultiLimit) {
                                console.log('CHARGED!');
                                stopCharging();
                            }
                            console.log('CHARGING!');
                            startCharging();
                        }}
                        onPressOut={() => {
                            console.log('CHARGED!');
                            stopCharging();
                        }}
                        >
                        {({ pressed }) => (
                        <Text style={[styles.text, {fontSize: 17}]}>
                            {pressed ? 'CHARGING!' : ultiLeft === 100 ? 'EMPTY!' : isUltiButtonDisabled ? 'CHARGED!' : 'ULTIMATE'}
                        </Text>
                        )}
                        
                    </Pressable>
                </View>

                <View style={styles.movesContainer}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.healButton,
                            pressed && {opacity: 0.7},
                            isBotMakingMove && {opacity: 0.3, backgroundColor: 'gray'}, // Apply styling to disable all the button  
                        ]} 
                        disabled={isBotMakingMove} // Disable the button
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
                                            style={({pressed}) => [
                                                styles.modalButton,
                                                pressed && {opacity: 0.7}, 
                                            ]}  
                                            onPress={() => {
                                                setRunModalVisible(!runModalVisible);
                                                navigation.navigate('Friends List');
                                            }}

                                        >
                                            <Text style={styles.yesNoText}>YES</Text>
                                        </Pressable>
                                        <Pressable
                                            style={({pressed}) => [
                                                styles.modalButton,
                                                pressed && {opacity: 0.7}, 
                                            ]} 
                                            onPress={() => setRunModalVisible(!runModalVisible)}

                                        >
                                            <Text style={styles.yesNoText}>NO</Text>
                                        </Pressable>
                                    </View>

                                </View>
                            </View>
                        </Modal>    
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={runGameOverModal}
                            >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.abandonText}>{winner}</Text>

                                    <View style={styles.modalContentChild}>
                                        <Pressable
                                            style={({pressed}) => [
                                                styles.modalButton,
                                                pressed && {opacity: 0.7}, 
                                            ]}  
                                            onPress={() => {
                                                setRunGameOverModal(!runGameOverModal);
                                                navigation.navigate('Friends List');
                                            }}

                                        >
                                            <Text style={styles.gameOverText}>RETURN HOME!</Text>
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
        fontSize: 20,
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
        borderColor: '#76C4E8',
        borderWidth: 5,
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

      gameOverText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 28,
        textAlign: 'center',
      },

})