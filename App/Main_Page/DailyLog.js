import React, {useState, useEffect, useCallback} from "react";
import {Dimensions, StyleSheet, Text, TextInput, View, SafeAreaView} from 'react-native';
import {useForm} from "react-hook-form";
import NavTab from "./NavTab";
import AppButton from "../Signing_In/Button";

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen

export default function DailyLog({navigation}) {

    // const [exerciseHours, setExerciseHours]= useState({hours:0, data_logged: false})
    // const [stepsTaken, setStepsTaken]= useState({steps:0, data_logged: false})
    // const [sleepHours, setSleepHours]= useState({hours:0, data_logged: false})
    // const [studyHours, setStudyHours]= useState({hours:0, data_logged: false})

    const {register, handleSubmit, setValue}= useForm();
    const onSubmit= useCallback(formData => {console.log(formData)}, []);
    const onChangeField= useCallback(name => text =>{setValue(name,text)}, []);

    useEffect(()=>{
        register('exerciseHours');
        register('stepsTaken');
        register('sleepHours');
        register('studyHours');
    }, [register]);


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
                            onChangeText={onChangeField('exerciseHours')}
                        />
                    </View>
                    
                    <View>
                        <Text style={styles.form_text}>Number of Steps Taken</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Steps'
                            onChangeText={onChangeField('stepsTaken')}
                        />
                    </View>
                    
                    <View>
                        <Text style={styles.form_text}>Number of Hours of Sleep</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Hours'
                            onChangeText={onChangeField('sleepHours')}
                        />
                    </View>    

                    <View>
                        <Text style={styles.form_text}>Number of Hours Spent Studying</Text>
                        <TextInput 
                            style={styles.entries}
                            placeholder='Total Hours'
                            onChangeText={onChangeField('studyHours')}
                        />
                    </View>
                    
                    <AppButton 
                        title="Update Daily Log" 
                        onPress={handleSubmit(onSubmit)}
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