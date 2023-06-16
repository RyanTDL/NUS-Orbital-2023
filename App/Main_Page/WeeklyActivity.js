import React, { useState, useEffect } from "react";
import {Dimensions, StyleSheet, ImageBackground, Text, View, ScrollView, SafeAreaView} from 'react-native';
import NavTab from "./NavTab";
import {db, auth} from "../../firebase";
import {doc, getDoc} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {LineChart} from 'react-native-chart-kit';

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen


export default function WeeklyActivity({navigation}) {

    let [weeklyExercise, setWeeklyExercise]= useState([0,0,0,0,0,0,0])
    let [weeklySteps, setWeeklySteps]= useState([0,0,0,0,0,0,0])
    let [weeklySleep, setWeeklySleep]= useState([0,0,0,0,0,0,0])
    let [weeklyStudy, setWeeklyStudy]= useState([0,0,0,0,0,0,0])

    //Retrieve data (weekly logs) from firebase whenever screen is loaded
    const [current_user, loading, error]= useAuthState(auth);
    const getFromDatabase = async() => {    
        const docRef= doc(db, "users", current_user?.uid)
        const docSnapshot= await getDoc(docRef)

        if (docSnapshot.exists()) {
            weeklyExercise= setWeeklyExercise(docSnapshot.data()['weekly_exercise']) 
            weeklySteps= setWeeklySteps(docSnapshot.data()['weekly_steps'])
            weeklySleep= setWeeklySleep(docSnapshot.data()['weekly_sleep'])
            weeklyStudy= setWeeklyStudy(docSnapshot.data()['weekly_study'])
        }}

    useEffect(()=>{
        getFromDatabase();
    }, [])

    //Set the values for the line graph
    const exercise_data = {
        labels: ['Day 1', '', '', 'Day 4', '', '', 'Today'],
        datasets : [{ data: weeklyExercise, strokeWidth:2, }],
    }
    const steps_data = {
        labels: ['Day 1', '', '', 'Day 4', '', '', 'Today'],
        datasets : [{ data: weeklySteps, strokeWidth:2, }],
    }
    const sleep_data = {
        labels: ['Day 1', '', '', 'Day 4', '', '', 'Today'],
        datasets : [{ data: weeklySleep, strokeWidth:2, }],
    }
    const study_data = {
        labels: ['Day 1', '', '', 'Day 4', '', '', 'Today'],
        datasets : [{ data: weeklyStudy, strokeWidth:2, }],
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require("../../assets/background/home_background.png")} resizeMode="contain" imageStyle={{opacity:0.4}}>
                <View style={[styles.childContainer, {flex:1}]}>
                    <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>Weekly Activity</Text>
                </View>

                <View style={[styles.childContainer, {flex:6}]}>
                    <ScrollView>
                        <View>
                            <Text style={[styles.subheader, {color:'#D21A1A'}]}>Number of hours of exercise</Text>
                            <OneGraph graph_data={exercise_data} y_axis_suffix={' hours'} graph_color_1={'#FFFFFF'} graph_color_2={'#D21A1A'}/>
                        </View>

                        <View>
                            <Text style={[styles.subheader, {color:'#3273D4'}]}>Number of steps taken</Text>
                            <OneGraph graph_data={steps_data} y_axis_suffix={'k steps'} graph_color_1={'#FFFFFF'} graph_color_2={'#3273D4'}/>
                        </View>

                        <View>
                            <Text style={[styles.subheader, {color:'#08AA5C'}]}>Number of hours of sleep</Text>
                            <OneGraph graph_data={sleep_data} y_axis_suffix={' hours'} graph_color_1={'#FFFFFF'} graph_color_2={'#08AA5C'}/>
                        </View>

                        <View>
                            <Text style={[styles.subheader, {color:'#6B20E4'}]}>Number of hours spent studying</Text>
                            <OneGraph graph_data={study_data} y_axis_suffix={' hours'} graph_color_1={'#FFFFFF'} graph_color_2={'#6B20E4'}/>
                        </View>

                    </ScrollView>
                </View>

                
                <View style={[styles.childContainer, {flex:1}]}>
                    <NavTab navigation={navigation}/>
                </View>
            </ImageBackground>
        </SafeAreaView>
        
    );
}


function OneGraph({graph_data, y_axis_suffix, graph_color_1, graph_color_2}) {
    return (
        <LineChart
            data={graph_data}
            width={width*0.9}
            height={350}
            withDots= {false}
            withOuterLines={false}
            fromZero={true}
            yAxisSuffix={y_axis_suffix}
            yLabelsOffset= {5}
            segments={3}
            chartConfig={{
                backgroundGradientFrom: graph_color_1,
                backgroundGradientFromOpacity: 0.1,
                backgroundGradientTo: graph_color_2,
                backgroundGradientToOpacity: 0.3,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
        />
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
        alignItems:'center',
        justifyContent: 'center',     
    },

    subheader: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        textDecorationLine: 'underline',
    }
})