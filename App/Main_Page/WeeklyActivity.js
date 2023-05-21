import React from "react";
import {Dimensions, StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import NavTab from "./NavTab";
import {LineChart} from 'react-native-chart-kit';

const {width, height}= Dimensions.get('window'); //retrieves dimensions of the screen


export default function WeeklyActivity({navigation}) {
    return (
        <SafeAreaView style={styles.container}>

            <View style={[styles.child_container, {flex:1}]}>
                <Text style={{color:'white', fontSize:20, fontWeight:'700'}}>Weekly Activity</Text>
            </View>

            <View style={[styles.child_container, {flex:6}]}>
                <ScrollView>
                    <View>
                        <Text style={[styles.subheader, {color:'#D21A1A'}]}>Number of hours of exercise</Text>
                        <OneGraph graph_data={exercise_data} y_axis_suffix={' hours'} graph_color_1={'#FFFFFF'} graph_color_2={'#D21A1A'}/>
                    </View>

                    <View>
                        <Text style={[styles.subheader, {color:'#3273D4'}]}>Number of steps taken</Text>
                        <OneGraph graph_data={steps_data} y_axis_suffix={' steps'} graph_color_1={'#FFFFFF'} graph_color_2={'#3273D4'}/>
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

            
            <View style={[styles.child_container, {flex:1}]}>
                <NavTab navigation={navigation}/>
            </View>
        </SafeAreaView>
        
    );
}


const exercise_data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets : [
        {
            data: [2, 3, 1, 3, 4, 6, 7],
            strokeWidth: 2,
        },
    ],
}

const steps_data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets : [
        {
            data: [2991, 3124, 10329, 3133, 7884, 7436, 9437],
            strokeWidth: 2,
        },
    ],
}

const sleep_data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets : [
        {
            data: [8, 4, 11, 7, 7, 6, 7],
            strokeWidth: 2,
        },
    ],
}

const study_data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets : [
        {
            data: [4, 6, 1, 1, 0, 0, 3],
            strokeWidth: 2,
        },
    ],
}

function OneGraph({graph_data, y_axis_suffix, graph_color_1, graph_color_2}) {
    return (
        <LineChart
            data={graph_data}
            width={350}
            height={350}
            withDots= {false}
            withOuterLines={false}
            withInnerLines={false}
            fromZero={true}
            yAxisSuffix={y_axis_suffix}
            yLabelsOffset= {10}
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

    child_container: {
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