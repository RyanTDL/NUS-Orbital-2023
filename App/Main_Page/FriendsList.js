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

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen


export default function FriendsList({navigation}) {

    const [isAddModalVisible, setIsAddModalVisible]= useState(false);
    const [isRemoveModalVisible, setIsRemoveModalVisible]= useState(false);
    const [playerName, setPlayerName]= useState('');
    const [friendID, setFriendID]= useState('');
    const [allFriends, setAllFriends]= useState([]);
    const [refreshFlatlist, setRefreshFlatlist]= useState(false);
    const [current_user, loading, error]= useAuthState(auth);


    // let [myStats, setMyStats]= useState({})
    //const [myFriendStats, setMyFriendStats]= useState({})

    //Retrieve my player name, and friends list
    const getMyDatabase = async() => {    
        const myDocRef= doc(db, "users", current_user.uid)
        const myDocSnapshot= await getDoc(myDocRef)
        if (myDocSnapshot.exists()) {
            setPlayerName(myDocSnapshot.data()['playerID'])
            setAllFriends(myDocSnapshot.data()['friends'])

        //     myStats= {
        //         name: myDocSnapshot.data()['playerID'],
        //         icon: myDocSnapshot.data()['icon'],
        //         strength: myDocSnapshot.data()['strength'],
        //         agility: myDocSnapshot.data()['agility'],
        //         stamina: myDocSnapshot.data()['stamina'],
        //         intellect: myDocSnapshot.data()['intellect'],
        //         // friends: myDocSnapshot.data()['friends']
        // }
        //     setMyStats(myStats)
        }
    }
    // console.log(myStats);

    //Updates allFriends database whenever friend is added/removed, which re-renders the flatlist
    useEffect(()=>{
        getMyDatabase();
    }, [isAddModalVisible, isRemoveModalVisible])


    //Find & Add friend based on player ID
    // https://firebase.google.com/docs/firestore/query-data/queries
    const addFriend = async() => {   
        //Finds friend, based on query using friend's player ID
        const q= query(collection(db, "users"), where("playerID", "==", friendID))
        const querySnapshot= await getDocs(q)
        querySnapshot.forEach((doc) => {
            stats= {
                title: doc.data()['username'],
                friendID: doc.data()['playerID'],
                icon: '../../assets/player_avatars/gym_bro.png',
                strength: doc.data()['total_exercise'],
                agility: Math.trunc(doc.data()['total_steps']/10),
                stamina: Math.trunc(doc.data()['total_sleep']/7),
                intellect: Math.trunc(doc.data()['total_study']/3)
            } 
        });
        //Adds friends data (Name & stats) to my database under "Friends" section
        const docRef= doc(db, "users", current_user.uid)
        await updateDoc(docRef, {
            friends: arrayUnion(stats)
        });
    }


    //Find & Remove friend based on player ID
    const removeFriend = async() => {   
        //Finds friend, based on query using friend's player ID
        const q= query(collection(db, "users"), where("playerID", "==", friendID))
        const querySnapshot= await getDocs(q)
        querySnapshot.forEach((doc) => {
            stats= {
                title: doc.data()['username'],
                friendID: doc.data()['playerID'],
                icon: '../../assets/player_avatars/gym_bro.png',
                strength: doc.data()['total_exercise'],
                agility: Math.trunc(doc.data()['total_steps']/10),
                stamina: Math.trunc(doc.data()['total_sleep']/7),
                intellect: Math.trunc(doc.data()['total_study']/3)
            }
        }
        );
        //Adds friends data (Name & stats) to my database under "Friends" section
        const docRef= doc(db, "users", current_user.uid)
        await updateDoc(docRef, {
            friends: arrayRemove(stats)
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
                            <Text style={styles.modalSubtext}>{playerName}</Text>
                        </View>
                        <View>
                            <TextInput 
                                style={styles.modalInputBox}
                                placeholder="Enter player ID"
                                onChangeText={newID => setFriendID(newID)}
                                defaultValue= {friendID}
                            />
                        </View>
                        <View style={{gap:10}}>
                            <AppButton 
                                title="Add friend"
                                onPress={()=> {
                                    addFriend()
                                    setIsAddModalVisible(!isAddModalVisible)
                                    setFriendID('')
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                                textStyle= {[styles.modalButtonText, {color:'white'}]}
                            />
                            <AppButton 
                                title="Cancel"
                                onPress={()=> {
                                    setFriendID('')
                                    setIsAddModalVisible(!isAddModalVisible)
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'#E0E0E0'}]}
                                textStyle= {[styles.modalButtonText, {color:'black'}]}
                            />
                        </View>
                    </View>
                </Modal>

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
                                onChangeText={newID => setFriendID(newID)}
                                defaultValue= {friendID}
                            />
                        </View>
                        <View style={{gap:10}}>
                            <AppButton 
                                title="Remove friend"
                                onPress={()=> {
                                    removeFriend()
                                    setIsRemoveModalVisible(!isRemoveModalVisible)
                                    setFriendID('')
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                                textStyle= {[styles.modalButtonText, {color:'white'}]}
                            />
                            <AppButton 
                                title="Cancel"
                                onPress={()=> {
                                    setFriendID('')
                                    setIsRemoveModalVisible(!isRemoveModalVisible)
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'#E0E0E0'}]}
                                textStyle= {[styles.modalButtonText, {color:'black'}]}
                            />
                        </View>
                    </View>
                </Modal>
            </ImageBackground>
        </SafeAreaView>
        
    );
}


function Friend_Box({player, playerID, player_icon, strength, agility, stamina, intellect}) {

    const navigation = useNavigation();
    let friendinfo = [player, player_icon, strength, agility, stamina, intellect ];

    return (
        <View style={styles.playerInfo}>
            <Image source={require('../../assets/player_avatars/gym_bro.png')}/>
            <View>
                <Text style={{fontSize:12, fontWeight: 500}}>{player} (Player ID: #{playerID})</Text>
                <Text style={{fontSize:12, fontWeight: 300}}> Strength: {strength}/100  Agility: {agility}/100</Text>
                <Text style={{fontSize:12, fontWeight: 300}}> Stamina: {stamina}/100  Intellect:{intellect}/100</Text>
            </View>
            <AppButton 
                title="Fight"
                onPress={ () => {
                    return (
                        console.log('Begin Battle!', player),
                        navigation.navigate('BattleStart', {friendinfo})
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