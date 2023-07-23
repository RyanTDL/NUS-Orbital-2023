import {React, useState, useEffect, useRef} from "react";
import {Dimensions, ScrollView, StyleSheet, ImageBackground, Text, View, Animated,  SafeAreaView, Modal, Image, Pressable, TouchableOpacity} from 'react-native';
import { StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons'; 
import FastImage from 'react-native-fast-image';


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

    //player icons cannot sync, keep getting stupid call stack error :(
    // const userIcon = require('../../assets/player_avatars/always_late.png');
    // const friendIcon = require('../../assets/player_avatars/star_athlete.png');  
    // console.log(userStats.icon);
    // console.log('GOD HELP');
    // const userIcon = require(userStats.icon);
    // const friendIcon = require(friendStats.icon);
    // console.log(userIcon);
    // const [userIcon, setUserIcon] = useState(null);
    // const [friendIcon, setFriendIcon] = useState(null);
    // const userMainIcon = require('../../assets/player_avatars/always_late.png');
    // const friendMainIcon = require('../../assets/player_avatars/star_athlete.png');  
    const userIcon = require('../../assets/player_bots/bot1.png');
    const friendIcon = require('../../assets/player_bots/bot2.png');  

    const [infoText, setInfoText]= useState('Choose your next move!');
    const [runInstructionsVisible, setRunInstructionsVisible]= useState(false);
    const [runModalVisible, setRunModalVisible]= useState(false);
    const [runGameOverModal, setRunGameOverModal]= useState(false);
    const [winner, setWinner] = useState();
    
    //Heal Button
    const [healStat, setHealStat] = useState((userStats.stamina+50) > 100 ? 100 : (userStats.stamina+20));
    const [friendHealStat, setFriendHealStat] = useState((friendStats.stamina+50) > 100 ? 100 : (friendStats.stamina+20));
    const [healCount, setHealCount] = useState(0);
    const [friendHealCount, setFriendHealCount] = useState(0);
    const [isHealButtonDisabled, setIsHealButtonDisabled] = useState(false);

    //Attack button
    const [attackStat, setAttackStat] = useState(userStats.strength);
    const [friendAttackStat, setFriendAttackStat] = useState(friendStats.strength);

    //Dodge Stats
    const [agilityStat, setAgilityStat] = useState(userStats.agility+10);
    const [friendAgilityStat, setFriendAgilityStat] = useState(friendStats.agility+10);

    //Ulti Button with charging feature
    const [ultiLimit, setUltiLimit] = useState(userStats.intellect);
    const [friendUltiLimit, setFriendUltiLimit] = useState(friendStats.intellect);
    const [ultiUsed, setUltiUsed] = useState(0);
    const [friendUltiUsed, setFriendUltiUsed] = useState(false);
    const [ultiLeft, setUltiLeft] = useState(0);
    const [friendUltiLeft, setFriendUltiLeft] = useState(0);
    const [isCharging, setIsCharging] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const [isUltiButtonDisabled, setIsUltiButtonDisabled] = useState(false);
    const [ultiButtonLabel, setUltiButtonLabel] = useState('ULTIMATE');
    const [ultiEngaged, setUltiEngaged] = useState(false);
    const [friendUltiEngaged, setFriendUltiEngaged] = useState(false);

    const [isUltiModalVisible, setIsUltiModalVisible] = useState(false);
    const [ultiTapCount, setUltiTapCount] = useState(0);
    const [ultiModalTimer, setUltiModalTimer] = useState(5);
    const [positiveScore, setPositiveScore] = useState(0);
    const [negativeScore, setNegativeScore] = useState(0);
    const [correctTaps, setCorrectTaps] = useState(0);
    const [wrongTaps, setWrongTaps] = useState(0);
    const positiveObjectImage = require('../../assets/battlesystem/mini_game/ultimatePotion.png');
    const negativeObjectImage = require('../../assets/battlesystem/mini_game/ultimatePoison.png');
    const [refreshIntervalId, setRefreshIntervalId] = useState(null);

    const startCharging = () => {
        setIsCharging(true);
        setIsUltiModalVisible(true);
        setUltiTapCount(0);
        setUltiModalTimer(15);
        setUltiEngaged(true);

        const id = setInterval(() => {
            setUltiModalTimer((prevTimer) => {
            if (prevTimer > 0) {
                return prevTimer - 1;
            } else {
                clearInterval(id);
                setIntervalId(null);
                setIsUltiButtonDisabled(true);
                setIsUltiModalVisible(false);
                console.log('CHARGING STOPPED!');
                
                setIsBotMakingMove(true);
                setAutoBattle(true);
            }
            });
        }, 1000);

        setIntervalId(id);
    };

    
    const generateObjects = () => {
        const objects = [];
        const totalObjects = 15; // Set the total number of objects here
        const maxPositiveObjects = 2; // Set the maximum number of positive objects here
        let numPositiveObjects = 0;
      
        // Generate objects
        for (let i = 0; i < maxPositiveObjects || (totalObjects - i) > (maxPositiveObjects - numPositiveObjects); i++) {
            let objectType;
    
            if (numPositiveObjects < maxPositiveObjects) {
                // If we can generate more positive objects, randomly choose between them
                objectType = Math.random() < 0.5 ? "positiveObject" : "negativeObject";
            } else {
                // If we reached the maximum number of positive objects, set the type to negative
                objectType = "negativeObject";
            }
      
            const position = {
                x: Math.random(),
                y: Math.random(),
            };
      
            if (objectType === "positiveObject") {
                numPositiveObjects++;
            } 
            objects.push({ objectType, position });
        }
      
        return objects;
    };


    const [currentObjects, setCurrentObjects] = useState(generateObjects());
  
    const handleObjectTap = (objectType) => {
        if (objectType === "positiveObject") {
            setPositiveScore((score) => score + 1);
            setCorrectTaps((count) => count + 1);
            setUltiUsed((used) => used + 1); // Used to do damage using ulti each turn
            setUltiLeft((left) => left + 1); // Used to update power bar
            
            if (ultiUsed + 1 === 1) {
                setInfoText(`${ultiUsed + 1} Potion found!`); // Display info text when charging starts
            } else {
                setInfoText(`${ultiUsed + 1} Potions found!`); // Display info text when charging starts
            }
    
            // Check if the ultimate limit of positive objects is reached
            if (ultiUsed + 1 === ultiLimit) {
                setIsUltiModalVisible(false); // Set ultiModalVisible to false when ultimate limit is reached
                setUltiEngaged(true);
                setIsUltiButtonDisabled(true);
                setInfoText(`Max ${ultiUsed+1} Potions is found!`);
                setAutoBattle(true);
                setIsBotMakingMove(true);
                clearInterval(intervalId);

            }
    
        } else if (objectType === "negativeObject") {
            setNegativeScore((score) => score - 1);
            setWrongTaps((count) => count + 1);
            setHealStat((stat) => (stat > 1 ? stat - 5 : 1));
        }
      
        setCurrentObjects(generateObjects());
    };
     
    useEffect(() => {
        const refreshObjectPositions = () => {
            setCurrentObjects(generateObjects());
        };

        const intervalId = setInterval(refreshObjectPositions, 2000);

        setRefreshIntervalId(intervalId);

        return () => {
            clearInterval(refreshIntervalId);
        };
    }, []); // Refresh the objects every 2 seconds

    
    useEffect(() => {
        if (!isUltiModalVisible) {
            if (ultiUsed === 0 && ultiEngaged) {
                setUltiUsed(1);
                setInfoText(`Here's a consolation potion for you!`)
            }
            setIsCharging(false);
        }
      }, [isUltiModalVisible]);

    //Animation logic
    const slashGif = require('../../assets/battlesystem/move_effects/slash.gif');
    const healEffectGif = require('../../assets/battlesystem/move_effects/healEffect.gif');
    const chargingFlameGif = require('../../assets/battlesystem/move_effects/chargingFlame.gif');
    const ultimateGif = require('../../assets/battlesystem/move_effects/ultimate.gif');
    const dodgingEffectGif = require('../../assets/battlesystem/move_effects/dodgeEffect.gif');

    const [isSlashing, setIsSlashing] = useState(false);
    const performSlashingAnimation = () => {
        const slashDuration = 2000; // Adjust duration as needed
        setIsSlashing(true);
        setTimeout(() => setIsSlashing(false), slashDuration);
      };

    const [isUltimate, setIsUltimate] = useState(false);
    const [isFriendUltimate, setIsFriendUltimate] = useState(false);
    const performUltimateAnimation = (playerUsingUltimate) => {
        const ultimateDuration = 1000; // Adjust duration as needed
        if (playerUsingUltimate) {
            setIsFriendUltimate(true);
            setTimeout(() => setIsFriendUltimate(false), ultimateDuration);
        } else {
            setIsUltimate(true);
            setTimeout(() => setIsUltimate(false), ultimateDuration);
        }
      };

    const [isHealing, setIsHealing] = useState(false);
    const [isFriendHealing, setIsFriendHealing] = useState(false);
    const performHealingAnimation = (playerHealing) => {
        const healDuration = 1000; // Adjust duration as needed
        if (playerHealing) {
            setIsFriendHealing(true);
            setTimeout(() => setIsFriendHealing(false), healDuration);
        } else {
            setIsHealing(true);
            setTimeout(() => setIsHealing(false), healDuration);
        }
      };

    const [isDodging, setIsDodging] = useState(false);
    const [isFriendDodging, setIsFriendDodging] = useState(false);
    const performDodgeAnimation = (playerDodging) => {
        const dodgeDuration = 500; // Adjust duration as needed
        if (playerDodging) {
            setIsFriendDodging(true);
            setTimeout(() => setIsFriendDodging(false), dodgeDuration);
        } else {
            setIsDodging(true);
            setTimeout(() => setIsDodging(false), dodgeDuration);
        }
      };

   
    //Animation Duration
    const userIconAnim = useRef(new Animated.Value(0)).current;
    const friendIconAnim = useRef(new Animated.Value(0)).current;

    const animateUserIcon = () => {
        Animated.sequence([
            Animated.timing(userIconAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            }),
            Animated.timing(userIconAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
            }),
        ]).start();
    };
        
    const animateFriendIcon = () => {
        Animated.sequence([
            Animated.timing(friendIconAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            }),
            Animated.timing(friendIconAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
            }),
        ]).start();
    };

    //Auto battle
    const [autoBattle, setAutoBattle] = useState(false);
    const [isBotMakingMove, setIsBotMakingMove] = useState(false); // Track if bot is making a move
    
    useEffect(() => {
        if (autoBattle) {
          // Automatically perform bot move after the user's move
          performBotMove();
          setAutoBattle(false);
        }
      }, [autoBattle]); // Triggers the bot move when auto battle is true

    useEffect(() => {
        if (!ultiEngaged) {
          setIsUltiButtonDisabled(false); // Enable the ultimate button
          setUltiButtonLabel('ULTIMATE'); // Reset the label
        } else if (ultiUsed >= ultiLimit) {
          setIsUltiButtonDisabled(true); // Disable the ultimate button when the limit is reached
          setInfoText(`Max ULIIMATE is charged!`);
        }
      }, [ultiEngaged, ultiLimit]); // Disable Ulit (Max Charge)

    useEffect(() => {
        if (ultiLeft >= 100) {
            setIsUltiButtonDisabled(true); // Disable the ultimate button when ultiLeft reaches 100
          }
          
        else if (autoBattle && !isBotMakingMove) {
            setIsBotMakingMove(true); // Disable buttons when it's the bot's turn
            performBotMove();
            setAutoBattle(false);
        }
    }, [autoBattle, isBotMakingMove]); // Disable buttons (Ulti empty + Bot turn)

    useEffect(() => {
        setIsHealButtonDisabled(healStat === 100);
      }, [healStat]); // Disable Heal (Max health)

    //Load Font 
    const [loaded] = useFonts({
        'PressStart2P-Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),      
    });
    if(!loaded) {
        return null;
    }

    //Usermoves

    const attackClick = () => {
        const dodgeChance = friendAgilityStat / 100;
        const isDodged = Math.random() < dodgeChance;
      
        if (!ultiEngaged && !isDodged) {
          // Regular attack
          const damageDealt = attackStat;
          const newFriendHealstat = friendHealStat - damageDealt;
      
          setFriendHealStat(Math.max(0, newFriendHealstat));
          console.log(`Damage dealt by user: ${damageDealt}`);
          setInfoText(`You dealt ${damageDealt} damage!`);
      
          if (newFriendHealstat <= 0) {
            setWinner("You won!");
            setRunGameOverModal(true);
          } else {
            setIsBotMakingMove(true);
            setAutoBattle(true);
          }
      
          animateUserIcon();
          performSlashingAnimation();
        } else if (ultiEngaged && !isDodged) {
          // Attack with ultimate
          const damageDealt = ultiUsed * 2;
          const newFriendHealstat = friendHealStat - damageDealt;
      
          setFriendHealStat(Math.max(0, newFriendHealstat));
          console.log(`Ultimate Damage dealt by user: ${damageDealt}`);
          setUltiUsed(0);
          setInfoText(`You dealt ${damageDealt} damage using ultimate!`);
          setUltiEngaged(false);
      
          if (newFriendHealstat <= 0) {
            setWinner("You won!");
            setRunGameOverModal(true);
          } else {
            setIsBotMakingMove(true);
            setAutoBattle(true);
          }
      
          animateUserIcon();
          performUltimateAnimation(false);
        } else {
          // Attack was dodged
          if (ultiEngaged) {
            setInfoText('Enemy dodged the ultimate attack!');
            setUltiUsed(0);
            setIsBotMakingMove(true);
            setAutoBattle(true);
            setUltiEngaged(false);
          } else {
            setInfoText('Enemy dodged the attack!');
            setIsBotMakingMove(true);
            setAutoBattle(true);
          }
        // Trigger dodge animation
        performDodgeAnimation(false);
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
            // Trigger heal annimation
            performHealingAnimation(false);
        } 

    };
          

    //Botmoves
    const friendAttackClick = () => {
        const dodgeChance = agilityStat / 100;
        const isDodged = Math.random() < dodgeChance;
      
        if (friendUltiUsed && !isDodged) {
          // Attack with ultimate
          const damageDealt = friendUltiLimit * 2;
          const newUserHealstat = healStat - damageDealt;
          setHealStat(newUserHealstat >= 0 ? newUserHealstat : 0);
          console.log(`Ultimate damage dealt by bot: ${damageDealt}`);
          setFriendUltiUsed(false);
          setFriendUltiEngaged(false);
          setTimeout(() => {
            setIsBotMakingMove(false);
          }, 2000);
          setAutoBattle(false);
          setInfoText(`The enemy dealt ${damageDealt} damage using ultimate!`);
      
          if (newUserHealstat <= 0) {
            setWinner("You lost!");
            setRunGameOverModal(true);
          }
      
          // Trigger friend icon animation
          animateFriendIcon();
          // Trigger ultimate animation
          performUltimateAnimation(true);
        } else if (!isDodged) {
          // Regular attack
          const damageDealt = friendAttackStat;
          const newUserHealstat = healStat - damageDealt;
          setHealStat(newUserHealstat >= 0 ? newUserHealstat : 0);
          console.log(`Damage dealt by bot: ${damageDealt}`);
          setInfoText(`The enemy dealt ${damageDealt} damage!`);
      
          if (newUserHealstat <= 0) {
            setWinner("You lost!");
            setRunGameOverModal(true);
          } else {
            setAutoBattle(false);
            setTimeout(() => {
              setIsBotMakingMove(false);
            }, 2000);
          }
      
          // Trigger friend icon animation
          animateFriendIcon();
          // Trigger slash animation
          performSlashingAnimation();
        } else {
          // Attack was dodged
          if (friendUltiUsed) {
            setInfoText('You dodged the ultimate attack!');
            setIsBotMakingMove(false);
            setAutoBattle(false);
            setFriendUltiUsed(false);
            setFriendUltiEngaged(false);
          } else {
            setInfoText('You dodged the enemy attack!');
            setIsBotMakingMove(false);
            setAutoBattle(false);
          }
            // Trigger dodge animation
            performDodgeAnimation(true);
        }
      };
      
    const friendHealClick = () => {
        if (friendHealCount < 3) {
            const newfriendHealstat = friendHealStat + 20;
            setFriendHealStat(newfriendHealstat <= 100 ? newfriendHealstat : 100);
            setInfoText(`The enemy healed 20 health!`);
            console.log('Bot healed 20 health!');
            console.log(`Bot's current health ${friendHealStat}`);
            setTimeout(()=> {
                setIsBotMakingMove(false);
            }, 2000);
            setAutoBattle(false);
            setFriendHealCount(friendHealCount + 1);
            // Trigger heal annimation
            performHealingAnimation(true);
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
                    setTimeout(()=> {
                        setIsBotMakingMove(false);
                    }, 2000);
                    setFriendUltiUsed(true);
                    setFriendUltiEngaged(true);
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
            
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.playersInfoContainer}>

                <View style={styles.playerInfo}> 
                    <ImageBackground style={styles.infoBackground}
                        source={require('../../assets/battlesystem/backgrounds/playerInfoBackground.jpg')}
                        > 

                        <View style={styles.playerIcon}>
                            <Image style={styles.playerBotIcon} source={userIcon}/>
                            <Text style={styles.playerName}>
                            {userStats.name}
                            </Text>
                        </View> 

                        <View style={{flex: 2}}>
                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/stat_icons/heart.png')}
                                        />
                                </View>
                                
                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarFill,{ backgroundColor:'#fc080d', width: `${healStat}%`}]}>
                                    </View>
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: 'red'}]}> {healStat} </Text>
                            </View>

                            <View style={styles.playerStats}> 
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/stat_icons/power.png')}
                                        />
                                </View>

                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarFill,{backgroundColor:'#D5B71C', width: (100 - ultiLeft) + '%'}]}>
                                    </View>
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: 'yellow'}]}> {(100 - ultiLeft) + '%'} </Text>
                            </View>

                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/stat_icons/heal.png')}
                                        />
                                </View>
                                
                                <View style={[styles.statusbar,{flexDirection: 'row', height: 20}]}>
                                    {[...Array(3)].map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                            styles.statusbarFill,
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
                        source={require('../../assets/battlesystem/backgrounds/playerInfoBackground.jpg')}
                        > 

                        <View style={styles.playerIcon}>
                            <Image style={styles.playerBotIcon} source={userIcon}/>
                            <Text style={styles.playerName}>
                            {friendStats.name}
                            </Text>
                        </View> 

                        <View style={{flex: 2}}>
                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/stat_icons/heart.png')}
                                        />
                                </View>
                                
                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarFill,{ backgroundColor:'#fc080d', width: `${friendHealStat}%` }]}>
                                    </View>
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: 'red'}]}> {friendHealStat} </Text>
                            </View>

                            <View style={styles.playerStats}> 
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/stat_icons/power.png')}
                                        />
                                </View>

                                <View style={styles.statusbar}>
                                    <View style ={[styles.statusbarFill,{backgroundColor:'#D5B71C', width: (100 - friendUltiLeft) + '%'}]}>
                                    </View>
                                </View>
                                <Text style ={[styles.statusbarinfo,{color: 'yellow'}]}> {(100 - friendUltiLeft) + '%'} </Text>
                            </View>

                            <View style={styles.playerStats}>
                                <View style={styles.playerStatsIcon}>
                                    <Image
                                        style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                        source={require('../../assets/battlesystem/stat_icons/heal.png')}
                                        />
                                </View>
                                
                                <View style={[styles.statusbar,{flexDirection: 'row'}]}>
                                    {[...Array(3)].map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                            styles.statusbarFill,
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
                source={require('../../assets/battlesystem/backgrounds/battlebackground3.webp')}>
                    <View styles={{flex: 1, flexDirection: 'row'}}>                        
                        <TouchableOpacity onPress={() => setRunInstructionsVisible(true)} >
                            <MaterialIcons
                                name="help-outline"
                                size={30}
                                style={styles.instructionsIcon}
                            />  
                        </TouchableOpacity>
                    </View>

                    <View style= {{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                        <View style= {{flex: 1, alignItems: 'center', marginBottom: 40, marginLeft: 35}}>
                            <Animated.Image
                                style={[
                                    styles.iconImage,
                                    {
                                    transform: [
                                        {
                                        scale: userIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.3], // size of icon
                                        }),
                                        },

                                        {
                                        translateY: userIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -20], // icon vertical movement
                                        }),
                                        },
                                    ],
                                    },
                                ]}
                                source={userIcon}
                            />
                            {isSlashing && (
                                <Animated.View
                                    style={[
                                        styles.slashOverlay,
                                        {
                                        opacity: friendIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1], // transparency of slash
                                        }),
                                        transform: [
                                            {
                                            scale: friendIconAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.5], // size of slash
                                            }),
                                            },
                                        ],
                                        },
                                    ]}
                                    >
                                    <Image source={slashGif} style={styles.slashGif} />
                                </Animated.View>
                            )}
                            {isHealing && (
                                <Image
                                    source={healEffectGif}
                                    style={styles.healEffect}
                                />
                            )}
                            {ultiEngaged && (
                                <Image
                                    source={chargingFlameGif}
                                    style={styles.chargingEffect}
                                />
                            )}
                            {isFriendUltimate && (
                                <Image
                                    source={ultimateGif}
                                    style={styles.ultimateEffect}
                                />
                            )}

                            {isFriendDodging && (
                                <Image
                                    source={dodgingEffectGif}
                                    style={styles.dodgingEffect}
                                />
                            )}

                        </View>

                        <View style= {{flex: 1, alignItems: 'center', marginBottom: 100, marginRight: 25}}>
                            <Animated.Image
                                style={[
                                    styles.iconImage,
                                    {
                                    transform: [
                                        {
                                        scale: friendIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, 1.3], // size of icon
                                        }),
                                        },
                                        {
                                        translateY: friendIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -20], // icon vertical movement
                                        }),
                                        },
                                    ],
                                    },
                                ]}
                                source={friendIcon}
                            />
                            {isSlashing && (
                                <Animated.View
                                    style={[
                                        styles.slashOverlay,
                                        {
                                        opacity: userIconAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1], // transparency of slash
                                        }),
                                        transform: [
                                            {
                                            scale: userIconAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.5], // size of slash
                                            }),
                                            },
                                        ],
                                        },
                                    ]}
                                    >
                                    <Image source={slashGif} style={styles.slashGif} />
                                </Animated.View>
                            )}
                            {isFriendHealing && (
                                <Image
                                    source={healEffectGif}
                                    style={styles.healEffect}
                                />
                            )}

                            {friendUltiEngaged && (
                                <Image
                                    source={chargingFlameGif}
                                    style={styles.chargingEffect}
                                />
                            )}

                            {isUltimate && (
                                <Image
                                    source={ultimateGif}
                                    style={styles.ultimateEffect}
                                />
                            )}

                            {isDodging && (
                                <Image
                                    source={dodgingEffectGif}
                                    style={styles.dodgingEffect}
                                />
                            )}

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
                    style={({ pressed }) => [
                        styles.ultimateButton,
                        pressed && { opacity: 0.7 },
                        (isUltiButtonDisabled && !isBotMakingMove) && { opacity: 0.5, backgroundColor: 'gray' },
                        isBotMakingMove && { opacity: 0.3, backgroundColor: 'gray' },
                        isCharging && { opacity: 0.3, backgroundColor: 'gray' },
                    ]}
                    disabled={isUltiButtonDisabled || isBotMakingMove}
                    onPressIn={() => {
                        if (isUltiButtonDisabled || isBotMakingMove) {
                          return;
                        }
                        startCharging();
                        setInfoText(`Find the potions to charge up!`); // Display info text when charging starts
                      }}
                    
                    >
                        <Text style={[styles.text, { fontSize: 18 }]}>
                            {isUltiButtonDisabled ? `${ultiUsed*2} ATK CHARGED!` : isCharging ? 'CHARGING!' : ultiLeft === 100 ? 'EMPTY!' : 'ULTIMATE'}
                        </Text>
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
       
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={runInstructionsVisible}
                >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, {height: 530, width: 350}]}>
                        <Text style={[styles.abandonText, {verticalAlign: 'top', textDecorationLine: 'underline', flex: 0.1, marginTop: 10}]}>How to Play?</Text>
                        <ScrollView style={styles.instructionsContainer} >
                            <Text style={styles.howToPlayText}>
                                1. First player to lose all health loses! {'\n'}
                                2. ATTACK deals damage equivalent to Strength  {'\n'}
                                3. ULTIMATE charges up the attack for the next turn {'\n'}
                                4. Charge depends on the number of yellow potions found {'\n'}
                                5. Every purple poison will result in 5 damage! {'\n'}
                                6. Maximum charge depends on the Intellect and the Power Bar level {'\n'}
                                7. Agility will affect the probability of dodging an attack or ultimate {'\n'}
                                8. HEAL heals 10 health {'\n'}
                                9. Each Player has 3 HEALS! {'\n'}
                                10. The maximum health for each player is 100!
                            </Text>
                        </ScrollView>  

                        <Pressable
                            style={({pressed}) => [
                                styles.modalButton,
                                {flex: 0.1},
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

            <Modal visible={isUltiModalVisible} animationType="fade" onRequestClose={() => {}}>
                <View style={styles.ultiModalContainer}>
                    <ImageBackground style={styles.infoBackground}
                        source={require('../../assets/battlesystem/backgrounds/playerInfoBackground.jpg')}
                        > 
                        
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <View style={[styles.infobox,{flex: 0.7, backgroundColor: 'transparent'}]}>
                                <Text style={styles.infoBoxText}> 
                                    {infoText}
                                </Text>
                            </View>

                            <View  style={[styles.infobox,{flex: 0.5, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center'}]}>
                                <View style={{flex: 0.2,alignItems: 'center'}}>
                                    <Image style={styles.playerBotIcon} source={userIcon}/>
                                </View>
                                <View style={{flex: 1, flexDirection: 'column'}}>
                                    <View style={styles.playerStats}>
                                        <View style={styles.playerStatsIcon}>
                                            <Image
                                                style={{flex: 1, width: 30, resizeMode: 'contain'}}
                                                source={require('../../assets/battlesystem/stat_icons/heart.png')}
                                                />
                                        </View>
                                        
                                        <View style={styles.ultiStatusbar}>
                                            <View style ={[styles.statusbarFill,{ backgroundColor:'#fc080d', width: `${healStat}%`}]}>
                                            </View>
                                        </View>
                                        <Text style ={[styles.statusbarinfo,{color: 'red', alignSelf: 'center'}]}> {healStat} </Text>
                                    </View>

                                    <View style={styles.playerStats}> 
                                        <View style={styles.playerStatsIcon}>
                                            <Image
                                                style={{flex: 1, width: 30, resizeMode: 'contain',}}
                                                source={require('../../assets/battlesystem/stat_icons/power.png')}
                                                />
                                        </View>

                                        <View style={styles.ultiStatusbar}>
                                            <View style ={[styles.statusbarFill,{backgroundColor:'#D5B71C', width: (100 - ultiLeft) + '%'}]}>
                                            </View>
                                        </View>
                                        <Text style ={[styles.statusbarinfo,{color: 'yellow', alignSelf: 'center'}]}> {(100 - ultiLeft) + '%'} </Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                        {ultiEngaged && (
                                <Image
                                    source={chargingFlameGif}
                                    style={[styles.chargingEffect, {left: -60, bottom: 0}]}
                                />
                        )}
                    </ImageBackground>     

                    <ImageBackground
                        style={styles.ultiGame}
                        source={require('../../assets/battlesystem/backgrounds/battlebackground1.jpg')}
                        >
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={styles.counterBox}>
                                    <Text style={styles.tapCounter}>{`Timer: ${ultiModalTimer}`}</Text>
                                </View>
                                <View style={styles.counterBox}>
                                    <Text style={styles.tapCounter}>{`Found: ${correctTaps + wrongTaps}`}</Text>
                                </View>
                                <View style={styles.counterBox}>
                                    <Text style={styles.tapCounter}>{`Potions: ${correctTaps}`}</Text>
                                </View>
                                <View style={styles.counterBox}>
                                    <Text style={styles.tapCounter}>{`Poisons: ${wrongTaps}`}</Text>
                                </View>
                                <View>                        
                                    <TouchableOpacity onPress={() => setRunModalVisible(!runModalVisible)} >
                                        <MaterialIcons
                                            name="directions-run"
                                            size={30}
                                            style={styles.minigameRun}
                                        />  
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {currentObjects.map((object, index) => (
                                <TouchableOpacity
                                key={index}
                                style={[
                                    styles.modalTapArea,
                                    {
                                    left: `${object.position.x * 100}%`,
                                    top: `${object.position.y * 100}%`,
                                    },
                                ]}
                                onPress={() => handleObjectTap(object.objectType)}
                                >
                                {object.objectType === 'positiveObject' && (
                                    <Image source={positiveObjectImage} style={styles.objectImage} />
                                )}
                                {object.objectType === 'negativeObject' && (
                                    <Image source={negativeObjectImage} style={styles.objectImage} />
                                )}
                                </TouchableOpacity>
                                
                            ))}
                            <View style={styles.box} />

                    </ImageBackground>
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

    playerBotIcon: {
        resizeMode: 'contain',
        width: 60,
        height: 60
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

    playerStatsIcon: {
        flex: 0.2,
    },

    statusbar: {
        flex: 1,
        height:20, 
        marginEnd: 8,
        overflow: 'hidden',
    },

    statusbarFill: {
        flex: 1,
        height:25, 
        borderWidth:1.5, 
        borderRadius: 6, 
        borderColor:'black', 
    },

    statusbarinfo: {
        flex: 0.3, 
        fontSize: 12,
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
        textAlign: 'right',
        color: 'white'
        
    },

    iconImage: {
        width: 70,
        height: 70,
    },

    slashGif: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },

    slashOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    healEffect: {
        position: 'absolute',
        width: 200, 
        height: 200,
        top: -80
    },

    chargingEffect: {
        position: 'absolute',
        bottom: -10,
        opacity: 0.5,  
        tintColor: '#f0b851'  
    },

    ultimateEffect: {
        position: 'absolute',
        bottom: -10,
        opacity: 0.8,  
    },

    dodgingEffect: {
        position: 'absolute',
        opacity: 0.9,  
        width: 200, 
        height: 200,
        bottom: 0
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

    howToPlayText: {
        flex: 4,
        color: 'black',
        fontWeight: '600',
        fontSize: 17,
        margin: 20,
        lineHeight: 30,

    },
    instructionsContainer: {
        flex: 1,
    },

    ultiModalContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      },
    
    ultiStatusbar: {
        flex: 1,
        height:20, 
        marginEnd: 8,
        overflow: 'hidden',
        alignSelf: 'center'
    },

    counterBox: {
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: '#D5B71C',
        borderRadius: 5,
        margin: 6,
        width: 75,
        height: 23,
    },

    minigameRun: {
        borderWidth: 3,
        borderRadius: 5,
        borderColor: '#0098BA',
        backgroundColor: '#76C4E8',
        margin: 4,
        width: 35,
        height: 40,
        textAlign: 'center', 
        verticalAlign: 'middle',
        color: 'black'
    },

    tapCounter: {
        fontSize: 12,
        color: "black",
        fontWeight: "bold",
        textAlign: 'center'
    },

    ultiCounter: {
        flex: 0.08,
        flexDirection: "row",        
    },

    ultiGame: {
        flex: 3,
    },

    objectImage: {
        width: 40,
        height: 40,
    },
    modalTapArea: {
        width: 100,
        height: 100,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },

    returnBattleButton: {
        color: 'white',
        fontWeight: '600',
        fontSize: 25,
        textAlign: 'center'
    },

    gameOverText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 28,
        textAlign: 'center',
    },


})