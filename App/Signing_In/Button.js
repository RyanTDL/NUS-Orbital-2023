import React from "react";
import {TouchableOpacity, Text } from "react-native";
// import LinearGradient from "react-native-linear-gradient";

export default function AppButton({ onPress, title, buttonStyle, textStyle}){
    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            {/* <LinearGradient colors={["red", "blue"]}> */}
            <Text style={textStyle}>{title}</Text>
            {/* </LinearGradient> */}
        </TouchableOpacity>
    );
} 