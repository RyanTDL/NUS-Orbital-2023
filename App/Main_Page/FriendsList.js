import {React, useState, useEffect} from "react";
import {Dimensions, StyleSheet, ImageBackground, Text, TextInput, View, SafeAreaView, FlatList, Image} from 'react-native';
import NavTab from "./NavTab";
import AppButton from "../Signing_In/Button";
import Modal from "react-native-modal";
import {db,} from "../../firebase";
import {collection, getDoc, FieldValue, setDoc, query, where, doc, increment, getDocs, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "../../firebase";
import { useNavigation } from '@react-navigation/native';
import { async } from "@firebase/util";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen


export default function FriendsList({navigation}) {

    const [isAddModalVisible, setIsAddModalVisible]= useState(false);
    const [isRemoveModalVisible, setIsRemoveModalVisible]= useState(false);
    const [isFriendAddedModalVisible, setIsFriendAddedModalVisible]= useState(false);
    const [isFriendRemovedModalVisible, setIsFriendRemovedModalVisible]= useState(false);

    const [myStats, setMyStats]= useState({});
    const [friendStats, setFriendStats]= useState({});
    const [allFriends, setAllFriends]= useState([]);
    const [myFriendID, setMyFriendID]= useState('');
    const [current_user, loading, error]= useAuthState(auth);

    //Retrieve my player name, and friends list
    const getMyDatabase = async() => {    
        const myDocRef= doc(db, "users", current_user.uid)
        const myDocSnapshot= await getDoc(myDocRef)
        if (myDocSnapshot.exists()) {
            setMyStats({
                title: myDocSnapshot.data()['username'],
                uid: myDocSnapshot.data()['uid'],
                friendID: myDocSnapshot.data()['playerID'],
                icon: '../../assets/player_avatars/gym_bro.png',
                strength: myDocSnapshot.data()['total_exercise'],
                agility: Math.trunc(myDocSnapshot.data()['total_steps']/10),
                stamina: Math.trunc(myDocSnapshot.data()['total_sleep']/7),
                intellect: Math.trunc(myDocSnapshot.data()['total_study']/3)
            })
        }
    }


    const getFriendDatabase = async() => {   
        //Finds friend, based on query using friend's player ID
        // https://firebase.google.com/docs/firestore/query-data/queries
        try {
            const q= query(collection(db, "users"), where("playerID", "==", myFriendID))
            const querySnapshot= await getDocs(q)
            const playerStatsArray= querySnapshot.docs[0].data()
            setFriendStats({
                title: playerStatsArray['username'],
                uid: playerStatsArray['uid'],
                friendID: playerStatsArray['playerID'],
                icon: '../../assets/player_avatars/gym_bro.png',
                strength: playerStatsArray['total_exercise'],
                agility: Math.trunc(playerStatsArray['total_steps']/10),
                stamina: Math.trunc(playerStatsArray['total_sleep']/7),
                intellect: Math.trunc(playerStatsArray['total_study']/3)
            }) 
        }
        catch {
            console.log("Database doesn't exist")
        }
    }
    

    //Retrieve my player's friendsList
    const getFriendList = async() => {    
        const myDocRef= doc(db, "friends", current_user.uid)
        const myDocSnapshot= await getDoc(myDocRef)
        if (myDocSnapshot.exists()) {
            setAllFriends(myDocSnapshot.data()['friends'])
        }
    }

    //Updates database whenever friend is added/removed, which re-renders the flatlist
    useEffect(()=>{
        getMyDatabase();
        getFriendList();
    }, [isAddModalVisible, isRemoveModalVisible])


    // //Find & Add friend based on player ID
    const addFriend = async() => {   
        const myDocRef= doc(db, "friends", current_user.uid)
        await updateDoc(myDocRef, {
            friends: arrayUnion(friendStats)
        });

        const friendDocRef= doc(db, "friends", friendStats.uid)
        await updateDoc(friendDocRef, {
            friends: arrayUnion(myStats)
        });
    }

    // //Find & Remove friend based on player ID
    const removeFriend = async() => {   
        getFriendDatabase();
        const myDocRef= doc(db, "friends", current_user.uid)
        await updateDoc(myDocRef, {
            friends: arrayRemove(friendStats)
        });

        const friendDocRef= doc(db, "friends", friendStats.uid)
        await updateDoc(friendDocRef, {
            friends: arrayRemove(myStats)
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/background/home_background.png")} resizeMode="contain" imageStyle={{opacity:0.2}}>
                <View style={[styles.childContainer, {flex:1}]}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'700',}}>Friends List</Text>
                </View>
                
                <View style={[styles.childContainer, {flex:6}]}>
                    <View style={{width:334, height:400, borderWidth:2, borderRadius: 10, borderColor:'white', backgroundColor:'white'}}>
                        <FlatList
                            data={allFriends}
                            extraData={isAddModalVisible}
                            renderItem={({item}) => 
                                <Friend_Box
                                    player={item.title}
                                    playerID={item.friendID}
                                    player_icon={item.icon}
                                    strength={item.strength}
                                    agility={item.agility}
                                    stamina={item.stamina}
                                    intellect={item.intellect}
                                    myStats={myStats}
                                />}
                        />
                    </View>
                </View>

                <View style={[styles.childContainer, {flex:1, flexDirection:"row", gap:10}]}>
                    <AppButton 
                        title="Add New Friend" 
                        onPress={()=> setIsAddModalVisible(!isAddModalVisible)}
                        buttonStyle={styles.appButtonContainer}
                        textStyle= {styles.appButtonText}
                    />
                    <AppButton 
                        title="Remove Friend" 
                        onPress={()=> setIsRemoveModalVisible(!isRemoveModalVisible)}
                        buttonStyle={styles.appButtonContainer}
                        textStyle= {styles.appButtonText}
                    />
                </View>   

                <View style={[styles.childContainer, {flex:1}]}>
                    <NavTab navigation={navigation}/>
                </View>    


                {/* Modal to add your friends */}
                {/* Add Friend Modal */}
                <Modal 
                    isVisible={isAddModalVisible} 
                    coverScreen= {false}
                    backdropOpacity= {0.4}
                    style= {{justifyContent:'center', alignItems:'center'}}
                >
                    <View style={styles.modalContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap:5}}>
                            <Text style={styles.modalText}>Your Player ID is: </Text>
                            <Text style={styles.modalSubtext}>{myStats.friendID}</Text>
                        </View>
                        <View>
                            <TextInput 
                                style={styles.modalInputBox}
                                placeholder="Enter player ID"
                                onChangeText={newID => setMyFriendID(newID)}
                                defaultValue= {myFriendID}
                            />
                        </View>
                        <View style={{gap:10}}>
                            <AppButton 
                                title="Add friend"
                                onPress={()=> {
                                    if (myStats.friendID==myFriendID){
                                        alert('Cannot enter your own ID')
                                    } else {
                                        getFriendDatabase()
                                        setIsAddModalVisible(!isAddModalVisible)
                                        setIsFriendAddedModalVisible(!isFriendAddedModalVisible)
                                    }
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                                textStyle= {[styles.modalButtonText, {color:'white'}]}
                            />
                            <AppButton 
                                title="Cancel"
                                onPress={()=> {
                                    setMyFriendID('')
                                    setIsAddModalVisible(!isAddModalVisible)
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'#E0E0E0'}]}
                                textStyle= {[styles.modalButtonText, {color:'black'}]}
                            />
                        </View>
                    </View>
                </Modal>
                {/* Friend added confirmation */}
                <Modal 
                    isVisible={isFriendAddedModalVisible} 
                    coverScreen= {false}
                    backdropOpacity= {0.4}
                    style= {{justifyContent:'center', alignItems:'center'}}
                >
                    <View style={styles.modalConfirmationContainer}>
                        <Text style={styles.modalText}>Adding new friend...</Text>
                        <AppButton 
                            title="Proceed"
                            onPress={()=> {
                                if (friendStats.uid==null){
                                    alert('Invalid player ID entered')
                                } else {
                                    addFriend()
                                }
                                setIsFriendAddedModalVisible(!isFriendAddedModalVisible)
                                setMyFriendID('')
                            }}
                            buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                            textStyle= {[styles.modalButtonText, {color:'white'}]}
                        />
                    </View>
                </Modal>

                {/* Modal to remove friends */}
                {/* Remove Friend Modal */}
                <Modal 
                    isVisible={isRemoveModalVisible} 
                    coverScreen= {false}
                    backdropOpacity= {0.4}
                    style= {{justifyContent:'center', alignItems:'center'}}
                >
                    <View style={styles.modalContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center', gap:5}}>
                            <Text style={styles.modalText}> Remove your friend </Text>
                        </View>
                        <View>
                            <TextInput 
                                style={styles.modalInputBox}
                                placeholder="Enter player ID"
                                onChangeText={newID => setMyFriendID(newID)}
                                defaultValue= {myFriendID}
                            />
                        </View>
                        <View style={{gap:10}}>
                            <AppButton 
                                title="Remove friend"
                                onPress={()=> {
                                    if (myStats.friendID==myFriendID){
                                        alert('Cannot enter your own ID')
                                    } else {
                                        getFriendDatabase()
                                        setIsRemoveModalVisible(!isRemoveModalVisible)
                                        setIsFriendRemovedModalVisible(!isFriendRemovedModalVisible)
                                    }
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                                textStyle= {[styles.modalButtonText, {color:'white'}]}
                            />
                            <AppButton 
                                title="Cancel"
                                onPress={()=> {
                                    setMyFriendID('')
                                    setIsRemoveModalVisible(!isRemoveModalVisible)
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'#E0E0E0'}]}
                                textStyle= {[styles.modalButtonText, {color:'black'}]}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Modal to confirm removal of friend */}
                <Modal 
                    isVisible={isFriendRemovedModalVisible} 
                    coverScreen= {false}
                    backdropOpacity= {0.4}
                    style= {{justifyContent:'center', alignItems:'center'}}
                >
                    <View style={styles.modalConfirmationContainer}>
                        <Text style={styles.modalText}> Removing your friend... </Text>
                        <AppButton 
                            title="Proceed"
                            onPress={()=> {
                                if (friendStats.uid==null){
                                    alert('Invalid player ID entered')
                                } else {
                                    removeFriend()
                                }
                                setIsFriendRemovedModalVisible(!isFriendRemovedModalVisible)
                                setMyFriendID('')
                            }}
                            buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                            textStyle= {[styles.modalButtonText, {color:'white'}]}
                        />
                    </View>
                </Modal>
            </ImageBackground>
        </SafeAreaView>
        
    );
}

function Friend_Box({player, playerID, player_icon, strength, agility, stamina, intellect, myStats}) {

    const navigation = useNavigation();
    const friendStats = [player, player_icon, strength, agility, stamina, intellect];
    const userStats = myStats;

    return (
        <View style={styles.playerInfo}>
            <Image source={require('../../assets/player_avatars/gym_bro.png')}/>
            <View>
                <Text style={{fontSize:12, fontWeight: 500}}>{player} (Player ID: {playerID})</Text>
                <Text style={{fontSize:12, fontWeight: 300}}> Strength: {strength}/100  Agility: {agility}/100</Text>
                <Text style={{fontSize:12, fontWeight: 300}}> Stamina: {stamina}/100  Intellect:{intellect}/100</Text>
            </View>
            <AppButton 
                title="Fight"
                onPress={ () => {
                    return (
                        console.log('Begin Battle!', `with ${player}`),
                        navigation.navigate('BattleStart', {friendStats, userStats})
                    ); 

                }}
                buttonStyle={styles.battleButtonContainer}
                textStyle= {styles.battleButtonText}
            />
            
        </View>
    )
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

    childContainer: {
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

    playerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DEE8EB',
        backgroundColor: '#DEE8EB',
        paddingVertical: 10,
        paddingHorizontal: 5,
        margin:2,
    },

    friendSection: {
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

    modalContainer: {
        justifyContent: 'space-around',
        alignItems:'flex-start',
        padding: 25,
        // gap:5,
        width: 350,
        height: 300,
        borderRadius: 30,
        backgroundColor: 'white',
    },

    modalConfirmationContainer: {
        justifyContent: 'space-around',
        alignItems:'center',
        padding: 25,
        // gap:5,
        width: 350,
        height: 200,
        borderRadius: 20,
        backgroundColor: 'white',
    },

    modalText: {
        fontSize: 24,
        fontWeight: 600,
    },

    modalSubtext: {
        fontSize: 20 ,
        fontWeight: 400,
    },

    modalInputBox : {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        width:300,
        padding: 10,
    },

    modalButtonContainer: {
        width: 300,
        borderRadius: 24,
        paddingVertical: 10,
    },

    modalButtonText:{
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: "center",
    }
})