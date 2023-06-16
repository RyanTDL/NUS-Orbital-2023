import {React, useState, useEffect} from "react";
import {Dimensions, StyleSheet, ImageBackground, Text, TextInput, View, SafeAreaView, FlatList, Image} from 'react-native';
import NavTab from "./NavTab";
import AppButton from "../Signing_In/Button";
import Modal from "react-native-modal";
import {db, getDatabaseData} from "../../firebase";
import {collection, getDoc, FieldValue, setDoc, query, where, doc, increment, getDocs, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "../../firebase";
import { async } from "@firebase/util";


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

    const [isModalVisible, setIsModalVisible]= useState(false);
    const [playerName, setPlayerName]= useState('');
    const [friendID, setFriendID]= useState('');
    const [allFriends, setAllFriends]= useState([]);
    const [current_user, loading, error]= useAuthState(auth);

    //Retrieve my player info
    const getMyDatabase = async() => {    
        const myDocRef= doc(db, "users", current_user.uid)
        const myDocSnapshot= await getDoc(myDocRef)
        if (myDocSnapshot.exists()) {
            setPlayerName(myDocSnapshot.data()['playerID'])
        }
    }
    useEffect(()=>{
        getMyDatabase();
    }, [])

    //Find & Add friend based on player ID
    // https://firebase.google.com/docs/firestore/query-data/queries
    const addFriend = async() => {   
        //Finds friend, based on query using friend's player ID
        const q= query(collection(db, "users"), where("playerID", "==", friendID))
        const querySnapshot= await getDocs(q)
        querySnapshot.forEach((doc) => {
            stats= {
                name: doc.data()['username'],
                strength: doc.data()['total_exercise'],
                agility: doc.data()['total_steps']/10,
                stamina: doc.data()['total_sleep']/7,
                intellect: doc.data()['total_study']/3
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
                name: doc.data()['username'],
                strength: doc.data()['total_exercise'],
                agility: doc.data()['total_steps']/10,
                stamina: doc.data()['total_sleep']/7,
                intellect: doc.data()['total_study']/3
            }
        }
        );
        //Adds friends data (Name & stats) to my database under "Friends" section
        const docRef= doc(db, "users", current_user.uid)
        console.log(friendRemoved)
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
                            <FriendSection />
                        </View>
                        
                </View>

                <View style={[styles.childContainer, {flex:1, flexDirection:"row", gap:10}]}>
                    <AppButton 
                        title="Add New Friend" 
                        onPress={()=> setIsModalVisible(!isModalVisible)}
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

                <View style={[styles.childContainer, {flex:1}]}>
                    <NavTab navigation={navigation}/>
                </View>    

                <Modal 
                    isVisible={isModalVisible} 
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
                                    // addFriend()
                                    removeFriend()
                                    setIsModalVisible(!isModalVisible)
                                    setFriendID('')
                                }}
                                buttonStyle={[styles.modalButtonContainer, {backgroundColor:'black'}]}
                                textStyle= {[styles.modalButtonText, {color:'white'}]}
                            />
                            <AppButton 
                                title="Cancel"
                                onPress={()=> {
                                    setFriendID('')
                                    setIsModalVisible(!isModalVisible)
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



function Friend_Box({player, player_icon, strength, agility, stamina, intellect}) {
    return (
        <View style={styles.playerInfo}>
            {/* <Image source={player_icon}/> */}
            <Image source={require('../../assets/player_avatars/gym_bro.png')}/>
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DEE8EB',
        backgroundColor: '#DEE8EB',
        gap: 10,
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