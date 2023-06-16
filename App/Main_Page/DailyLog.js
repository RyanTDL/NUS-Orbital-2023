import React, {useState, useEffect, useCallback, StrictMode} from "react";
import {Dimensions, ImageBackground, StyleSheet, Text, TextInput, View, SafeAreaView} from 'react-native';
import NavTab from "./NavTab";
import AppButton from "../Signing_In/Button";
import {db, getDatabaseData} from "../../firebase";
import {collection, getDoc, setDoc, doc, increment} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "../../firebase";


const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen


export default function DailyLog({navigation}) {

    const [exerciseHours, setExerciseHours]= useState("")
    const [stepsTaken, setStepsTaken]= useState("")
    const [sleepHours, setSleepHours]= useState("")
    const [studyHours, setStudyHours]= useState("")
    const [current_user, loading, error]= useAuthState(auth);

    //Retrieve the weekly log
    const [exerciseWeek, setExerciseWeek]= useState([])
    const [stepsWeek, setStepsWeek]= useState([])
    const [sleepWeek, setSleepWeek]= useState([])
    const [studyWeek, setStudyWeek]= useState([])

    const getFromDatabase = async() => {    
        const docRef= doc(db, "users", current_user.uid)
        const docSnapshot= await getDoc(docRef)
        if (docSnapshot.exists()) {
            total_exercise= docSnapshot.data()['weekly_exercise']
            total_steps= docSnapshot.data()['weekly_steps']
            total_sleep= docSnapshot.data()['weekly_sleep']
            total_study= docSnapshot.data()['weekly_study']
            setExerciseWeek(total_exercise)
            setStepsWeek(total_steps)
            setSleepWeek(total_sleep)
            setStudyWeek(total_study)
        }
    }

    useEffect(()=>{
        getFromDatabase();
    }, [exerciseHours]) //updates everytime addToDatabase() is pressed, so that the new weekly log is retrieved


    //Update the Cloud Firestore
    //Updates the overall stats, as well as the weekly log
    const addToDatabase = async(exercise, steps, sleep, study, user) => {

        //parseInt converts string to int, also deals with values like "12s2"(converted to 122) and "nasw" (converted to NaN)
        daily_exercise= parseInt(exercise,10) 
        daily_steps= Math.round(parseInt(steps,10)/1000) //stores steps in the thousands: 1292 steps becomes 1k etc
        daily_sleep= parseInt(sleep,10)
        daily_study= parseInt(study,10)
        //Prevent input of strings, which will cause database to store value 'NaN'
        if (isNaN(daily_exercise) || isNaN(daily_steps) || isNaN(daily_sleep) || isNaN(daily_study)){
            alert("Please ensure all fields are filled correctly")
            return
        }
        else if (daily_exercise>24||daily_steps>20||daily_sleep>24||daily_study>24){
            alert("Please ensure all inputs are within 24 hours")
            return
        }

        //Push the new values into the database
        try {
            //Update the weekly log. Removes latest value, and adds in the new value
            exercise_intermediate= exerciseWeek.slice(1,).concat([daily_exercise])
            steps_intermediate= stepsWeek.slice(1,).concat([daily_steps])
            sleep_intermediate= sleepWeek.slice(1,).concat([daily_sleep])
            study_intermediate= studyWeek.slice(1,).concat([daily_study])
            
            const updated_stats={      
                //Update overall exercise/steps/sleep/study
                total_exercise: increment(daily_exercise), //increments the stat by given value
                total_steps: increment(daily_steps),
                total_sleep: increment(daily_sleep),
                total_study: increment(daily_study),   
                weekly_exercise: exercise_intermediate,
                weekly_steps: steps_intermediate,
                weekly_sleep: sleep_intermediate,
                weekly_study: study_intermediate,
            }

            const docRef= doc(db, "users", user.uid)
            const updateData = await setDoc(
                docRef,
                updated_stats, 
                {merge:true} //merge adds or replaces any new data, while leaving the rest of the data unchanged
                ); 


            }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/background/home_background.png")} resizeMode="contain" imageStyle={{opacity:1}}>
                <View style={[styles.childContainer, {flex:1}]}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'700',}}>Daily Log</Text>
                </View>
                
                <View style={[styles.childContainer, {flex:7}]}>
                    <View style={styles.form}>
                        <View>
                            <Text style={styles.formText}>Number of Hours Exercised</Text>
                            <TextInput 
                                style={styles.entries}
                                placeholder='Total Hours'
                                value={exerciseHours}
                                onChangeText={hours => setExerciseHours(hours)}
                            />
                        </View>
                        
                        <View>
                            <Text style={styles.formText}>Number of Steps Taken</Text>
                            <TextInput 
                                style={styles.entries}
                                placeholder='Total Steps'
                                value={stepsTaken}
                                onChangeText={steps => setStepsTaken(steps)}
                            />
                        </View>
                        
                        <View>
                            <Text style={styles.formText}>Number of Hours of Sleep</Text>
                            <TextInput 
                                style={styles.entries}
                                placeholder='Total Hours'
                                value={sleepHours}
                                onChangeText={hours => setSleepHours(hours)}
                            />
                        </View>    

                        <View>
                            <Text style={styles.formText}>Number of Hours Spent Studying</Text>
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
                                addToDatabase(exerciseHours, stepsTaken, sleepHours, studyHours, current_user)
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
                

                <View style={[styles.childContainer, {flex:1}]}>
                    <NavTab navigation={navigation}/>
                </View>    
            </ImageBackground>
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

    childContainer: {
        // borderWidth: 1, 
        // borderColor:'red',
        alignItems:'center',
        justifyContent: 'center',     
    },
    
    form : {
        alignItems: 'center',
        gap: 20,
    },

    formText: {
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