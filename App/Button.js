import React, {Component} from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";


export default function AppButton({ onPress, title, buttonStyle, textStyle }){
    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
} 