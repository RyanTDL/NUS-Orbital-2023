import {React, useState, useEffect, useRef} from "react";
import {Dimensions, Alert, StyleSheet, ImageBackground, Text, View, Animated,  SafeAreaView, Modal, Image, Pressable, TouchableOpacity} from 'react-native';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons'; 


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

    // console.log(userStats.icon);
    // console.log('GOD HELP');
    // const userIcon = require(userStats.icon);
    // const friendIcon = require(friendStats.icon);

    // console.log(userIcon);

    // const [userIcon, setUserIcon] = useState(null);
    // const [friendIcon, setFriendIcon] = useState(null);

    const [infoText, setInfoText]= useState('Choose your next move!');

    const [runInstructionsVisible, setRunInstructionsVisible]= useState(false);
    const [runModalVisible, setRunModalVisible]= useState(false);
    const [runGameOverModal, setRunGameOverModal]= useState(false);
    const [winner, setWinner] = useState();

    const [healStat, setHealStat] = useState((userStats.stamina+50) > 100 ? 100 : (userStats.stamina+50));
    const [friendHealStat, setFriendHealStat] = useState((friendStats.stamina+50) > 100 ? 100 : (friendStats.stamina+50));

    const [healCount, setHealCount] = useState(0);
    const [friendHealCount, setFriendHealCount] = useState(0);
    const [isHealButtonDisabled, setIsHealButtonDisabled] = useState(false);

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

    //animation logic
    const userIconAnim = useRef(new Animated.Value(0)).current;
    const friendIconAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (autoBattle) {
          // Automatically perform bot move after the user's move
          performBotMove();
          setAutoBattle(false);
        }
      }, [autoBattle]); // Triggers the bot move

    useEffect(() => {
        if (ultiUsed === 0) {
          setIsUltiButtonDisabled(false); // Enable the ultimate button
          setUltiButtonLabel('ULTIMATE'); // Reset the label
        } else if (ultiUsed >= ultiLimit) {
          setIsUltiButtonDisabled(true); // Disable the ultimate button when the limit is reached
          setInfoText(`WARNING!\nMax ULIIMATE is charged!`);
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

    useEffect(() => {
        setIsHealButtonDisabled(healStat === 100);
      }, [healStat]);

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
        setInfoText(`${ultiUsed*2} ATK is charged for next turn!`);
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
      
          if (newFriendHealstat <= 0) {
            setWinner("You won!");
            setRunGameOverModal(true);
          } else {
            setIsBotMakingMove(true); // Disable buttons after the user's move
            setAutoBattle(true);
          }

        // Trigger user icon animation
        animateUserIcon();

        } else {
          // Attack with ultimate
          const newFriendHealstat = friendHealStat - (ultiUsed*2);
          setFriendHealStat(newFriendHealstat >= 0 ? newFriendHealstat : 0);
          console.log(`Ultimate Damage dealt by user: ${(ultiUsed*2)}`);
          setUltiUsed(0);
          setInfoText(`You dealt ${(ultiUsed*2)} damage using ultimate!`);
      
          if (newFriendHealstat <= 0) {
            setWinner("You won!");
            setRunGameOverModal(true);
          } else {
            setIsBotMakingMove(true); // Disable buttons after the user's move
            setAutoBattle(true);
          }

        // Trigger user icon animation
        animateUserIcon();
        }
      };



    const healClick = () => {
        console.log(healCount);
        if (healCount < 3) {
            const newHealstat = healStat + 20;
            setHealStat(newHealstat <= 100 ? newHealstat : 100);
            console.log(`User's gained 20 health!`);
            console.log(`User's current ${healStat}`);
            setInfoText(`You healed 20 health!`);
            setIsBotMakingMove(true); // Disable buttons after the user's move
            setAutoBattle(true);
            setHealCount(healCount + 1);
        } 

    };
          

    //Botmoves
    const friendAttackClick = () => {
        if (friendUltiUsed) {
          // Attack with ultimate
          const newUserHealstat = healStat - (friendUltiLimit*2);
          setHealStat(newUserHealstat >= 0 ? newUserHealstat : 0);
          console.log(`Ultimate damage dealt by bot: ${(friendUltiLimit*2)}`);
          setFriendUltiUsed(false);
          setIsBotMakingMove(false); // Enable buttons after the user's move
          setAutoBattle(false);
          setInfoText(`The enemy dealt ${(friendUltiLimit*2)} damage using ultimate!`);
      
          if (newUserHealstat <= 0) {
            setWinner("You lost!");
            setRunGameOverModal(true);
          }

        // Trigger friend icon animation
        animateFriendIcon();

        } else {
          // Regular attack
          const newUserHealstat = healStat - friendAttackStat;
          setHealStat(newUserHealstat >= 0 ? newUserHealstat : 0);
          console.log(`Damage dealt by bot: ${friendAttackStat}`);
          setInfoText(`The enemy dealt ${friendAttackStat} damage!`);
      
          if (newUserHealstat <= 0) {
            setWinner("You lost!");
            setRunGameOverModal(true);
          } else {
            setAutoBattle(false);
            setIsBotMakingMove(false); // Enable buttons after the user's move
          }

        // Trigger friend icon animation
        animateFriendIcon();
        }
      };
      
    const friendHealClick = () => {
        if (friendHealCount < 3) {
          const newfriendHealstat = friendHealStat + 20;
          setFriendHealStat(newfriendHealstat <= 100 ? newfriendHealstat : 100);
          setInfoText(`The enemy healed 20 health!`);
          console.log('Bot healed 20 health!');
          console.log(`Bot's current health ${friendHealStat}`);
          setIsBotMakingMove(false); // Enable buttons after the user's move
          setAutoBattle(false);
          setFriendHealCount(friendHealCount + 1);
        }
    };
      

        // Auto Battle
    const startAutoBattle = () => {
        setAutoBattle(true);
        performBotMove();
    };
    
    const performBotMove = () => {
        // Bot logic to choose a move
        const moves = ["attack", "ultimate", "heal"];
        const randomMoveIndex = Math.floor(Math.random() * moves.length);
        let randomMove = moves[randomMoveIndex];
    
        // Check if the ultimate has already been charged
        setTimeout(() => {
        if (randomMove === "ultimate" && friendUltiUsed) {
            friendAttackClick(); // Perform a regular attack instead
            return;
        }
    
        // Check if the friend has already used the heal move three times
        setTimeout(() => {
            if (randomMove === "heal" && friendHealCount >= 3) {
            // Choose a different move if the heal move limit is reached
            const availableMoves = moves.filter((move) => move !== "heal");
            const newRandomMoveIndex = Math.floor(Math.random() * availableMoves.length);
            randomMove = availableMoves[newRandomMoveIndex];
            }
    
            // Perform the chosen move after a delay
            setTimeout(() => {
            switch (randomMove) {
                case "attack":
                friendAttackClick();
                break;
                case "ultimate":
                console.log('Bot charged its ultimate!');
                setInfoText("The enemy charged his ultimate!");
                setIsBotMakingMove(false); // Enable buttons after the user's move
                setFriendUltiUsed(true);
                setFriendUltiLeft((prev) => prev + friendUltiLimit);
                break;
                case "heal":
                friendHealClick();
                break;
                default:
                break;
            }
            }, 1000); // Delay of 2000 milliseconds for the final move
        }, 500); // Delay of 2000 milliseconds for the heal move check
        }, 700); // Delay of 2000 milliseconds for the ultimate move check
    };


    //animation logic
    const animateUserIcon = () => {
        Animated.sequence([
          Animated.timing(userIconAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(userIconAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      };
      
      const animateFriendIcon = () => {
        Animated.sequence([
          Animated.timing(friendIconAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(friendIconAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
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
                                <Text style ={[styles.statusbarinfo,{color: 'red'}]}> {healStat} </Text>
                            </View>

                            <View style={styles.playerStats}> 
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/power.png')}
                                        />
                                </View>

                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarinside,{backgroundColor:'#D5B71C', width: (100 - ultiLeft) + '%'}]}>
                                    </View>
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: 'yellow'}]}> {(100 - ultiLeft) + '%'} </Text>
                            </View>

                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/heal.png')}
                                        />
                                </View>
                                
                                <View style={[styles.statusbar,{flexDirection: 'row', height: 20}]}>
                                    {[...Array(3)].map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                            styles.statusbarinside,
                                            {
                                                backgroundColor: index < 3 - healCount ? '#61A631' : 'grey',
                                                height: 20,
                                            
                                            },
                                            ]}
                                        />
                                ))}
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: '#61A631'}]}> {3-healCount} </Text>
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
                                <Text style ={[styles.statusbarinfo,{color: 'red'}]}> {friendHealStat} </Text>
                            </View>

                            <View style={styles.playerStats}> 
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/power.png')}
                                        />
                                </View>

                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarinside,{backgroundColor:'#D5B71C', width: (100 - friendUltiLeft) + '%'}]}>
                                    </View>
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: 'yellow'}]}> {(100 - friendUltiLeft) + '%'} </Text>
                            </View>

                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/heal.png')}
                                        />
                                </View>
                                
                                <View style={[styles.statusbar,{flexDirection: 'row'}]}>
                                    {[...Array(3)].map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                            styles.statusbarinside,
                                            {
                                                backgroundColor: index < 3 - friendHealCount ? '#61A631' : 'grey',
                                                height: 20,
                                            },
                                            ]}
                                        />
                                ))}
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: '#61A631'}]}> {3-friendHealCount} </Text>
                            </View>

                        </View>
                    </ImageBackground>
                </View>


            </View>

            <View style={styles.animationwindow}>
                <ImageBackground
                style={styles.battlebackgroundimage}
                source={require('../../assets/battlesystem/battlebackground.jpg')}>
                    <TouchableOpacity onPress={() => setRunInstructionsVisible(true)} >
                        <MaterialIcons
                            name="help-outline"
                            size={35}
                            style={styles.instructionsIcon}
                        />  
                    </TouchableOpacity>
                    <View style= {{flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 30}}>
                        <View style= {{flex: 1, alignItems: 'center'}}>
                                <Animated.Image
                                    style={[
                                        styles.iconImage,
                                        {
                                        transform: [
                                            {
                                            scale: userIconAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.2],
                                            }),
                                            },
                                        ],
                                        },
                                    ]}
                                    source={userIcon}
                                />
                        </View>

                        <View style= {{flex: 1, alignItems: 'center'}}>
                            <Animated.Image
                                style={[
                                    styles.iconImage,
                                    {
                                    transform: [
                                        {
                                        scale: friendIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.2],
                                        }),
                                        },
                                    ],
                                    },
                                ]}
                                source={friendIcon}
                            />
                            
                        </View>
                    </View>

                </ImageBackground> 
            </View>



            <View style={styles.infobox}>
                <Text style={styles.infoBoxText}> 
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
                        <Text style={[styles.text, {fontSize: 18}]}>
                            {pressed ? 'CHARGING!' : ultiLeft === 100 ? 'EMPTY!' : isUltiButtonDisabled ? `CHARGED!` : 'ULTIMATE'}
                        </Text>
                        )}
                        
                    </Pressable>
                </View>

                <View style={styles.movesContainer}>
                    <Pressable 
                        style={({pressed}) => [
                            styles.healButton,
                            pressed && {opacity: 0.7},
                            (isHealButtonDisabled || healCount === 3) && {opacity: 0.5, backgroundColor: 'gray'}, // Apply styling to disable the Heal button
                            isBotMakingMove && {opacity: 0.3, backgroundColor: 'gray'}, // Apply styling to disable all the button
                        ]} 
                        disabled={isHealButtonDisabled || isBotMakingMove || healCount === 3} // Disable the button
                        onPress={() => {
                            console.log('HEAL');
                            healClick();
                        }}
                        > 
                        {({ pressed }) => (
                        <Text style={[styles.text, { fontSize: 18 }]}>
                            {pressed ? 'HEALING!' : healCount <3  ? 'HEAL' : 'EMPTY!'}
                        </Text>
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
                            visible={runInstructionsVisible}
                            >
                            <View style={styles.modalContainer}>
                                <View style={[styles.modalContent, {height: 530, width: 350}]}>
                                    <Text style={[styles.abandonText, {verticalAlign: 'top', textDecorationLine: 'underline', flex: 0.5, marginTop: 10}]}>How to Play?</Text>
                                    <Text style={styles.howToPlayText}>
                                        1. First player to lose all health loses! {'\n'}
                                        2. ATTACK deals damage equivilant to Strength  {'\n'}
                                        3. ULTIMATE charges up the attack for the next turn {'\n'}
                                        4. Maximum charge depends on Intellect and POWER BAR Level {'\n'}
                                        5. HEAL heals 10 health {'\n'}
                                        6. Each Player has 3 HEALS! {'\n'}
                                    </Text>

                                    <Pressable
                                        style={({pressed}) => [
                                            styles.modalButton,
                                            {flex: 0.4},
                                            pressed && {opacity: 0.7}, 
                                        ]}  
                                        onPress={() => {
                                            setRunInstructionsVisible(!runInstructionsVisible);
                            
                                        }}
                                    >
                                        <Text style={styles.returnBattleButton}>RETURN TO BATTLE!</Text>
                                    </Pressable>

                                </View>
                            </View>
                        </Modal> 
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
        height:20, 
        marginEnd: 8,
        overflow: 'hidden',

    },

    statusbarinside: {
        flex: 1,
        height:25, 
        borderWidth:1.5, 
        borderRadius: 6, 
        borderColor:'black', 

    },

    statusbarinfo: {
        flex: 0.3, 
        fontSize: 10,
        fontWeight: '900',
        paddingRight: 0,
    },

    animationwindow: {
        flex: 1,
    },

    battlebackgroundimage: {
        flex: 1,
        resizeMode: 'cover',
        borderWidth: 4,
        borderColor: 'black',
        borderRadius: 7,
  
    },

    instructionsIcon: {
        textAlign: 'right'
        
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

    infoBoxText:{
        fontFamily: "PressStart2P-Regular",
        fontSize: 18,
        lineHeight: 30,
        textAlign: "left",
        paddingLeft: 15,
        color: '#FFFFFF',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2.2, height: 3.5 },
        textShadowRadius: 4,
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

      howToPlayText: {
        flex: 4,
        color: 'black',
        fontWeight: '600',
        fontSize: 17,
        margin: 20,
        lineHeight: 30,

      },
    
      returnBattleButton: {
        color: 'white',
        fontWeight: '600',
        fontSize: 25,
        textAlign: 'center'
      },

})