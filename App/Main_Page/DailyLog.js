import React, {useState, useEffect, useCallback, StrictMode} from "react";
import {Dimensions, StyleSheet, Text, TextInput, View, SafeAreaView} from 'react-native';
import NavTab from "./NavTab";
import AppButton from "../Signing_In/Button";
import {db} from "../../firebase";
import {collection, addDoc} from "firebase/firestore";



const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

const addToDatabase = async(exercise, steps, sleep, study) => {
    try {
        const docRef = await addDoc(collection(db, "Player"), {
            Strength: parseInt(exercise,10), //parseInt converts string to int, also deals with values like "12s2"(converted to 122) and "nasw" (converted to NaN)
            Agility: parseInt(steps,10),
            Stamina: parseInt(sleep,10),
            Intellect: parseInt(study,10),
        });
    } 
    catch (e) {
        console.error("Error adding document: ", e);
    }
}


export default function DailyLog({navigation}) {

    const [exerciseHours, setExerciseHours]= useState("")
    const [stepsTaken, setStepsTaken]= useState("")
    const [sleepHours, setSleepHours]= useState("")
    const [studyHours, setStudyHours]= useState("")
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.child_container, {flex:1}]}>
                <Text style={{color:'white', fontSize:20, fontWeight:'700',}}>Daily Log</Text>
            </View>
            
            <View style={[styles.child_container, {flex:7}]}>
                <View style={styles.form}>
                    <View>
                        <Text style={styles.form_text}>Number of Hours Exercised</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Hours'
                            value={exerciseHours}
                            onChangeText={hours => setExerciseHours(hours)}
                        />
                    </View>
                    
                    <View>
                        <Text style={styles.form_text}>Number of Steps Taken</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Steps'
                            value={stepsTaken}
                            onChangeText={steps => setStepsTaken(steps)}
                        />
                    </View>
                    
                    <View>
                        <Text style={styles.form_text}>Number of Hours of Sleep</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Hours'
                            value={sleepHours}
                            onChangeText={hours => setSleepHours(hours)}
                        />
                    </View>    

                    <View>
                        <Text style={styles.form_text}>Number of Hours Spent Studying</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Hours'
                            value={studyHours}
                            onChangeText={hours => setStudyHours(hours)}
                        />
                    </View>
                    
                    <AppButton 
                        title="Update Daily Log" 
                        onPress={()=>{
                            addToDatabase(exerciseHours, stepsTaken, sleepHours, studyHours)
                            setExerciseHours("") //clears the values in the text input
                            setStepsTaken("")
                            setSleepHours("")
                            setStudyHours("")

                        }}
                        buttonStyle={styles.appButtonContainer}
                        textStyle= {styles.appButtonText}
                    />
                </View>
            </View>
            

            <View style={[styles.child_container, {flex:1}]}>
                <NavTab navigation={navigation}/>
            </View>    

        </SafeAreaView>
        
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
    },

    child_container: {
        // borderWidth: 1, 
        // borderColor:'red',
        alignItems:'center',
        justifyContent: 'center',     
    },
    
    form : {
        alignItems: 'center',
        gap: 20,
    },

    form_text: {
        color: 'white',
        fontSize: 18,
        marginBottom: 3,
    },

    entries: {
        width: 360,
        height: 50,
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: 'white',
        padding: 10,
    },

    appButtonContainer: {
        marginTop: 20,
        backgroundColor: "#9C3FE4",
        width: 300,
        borderRadius: 24,
        paddingVertical: 16,

    },

    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
    },
})