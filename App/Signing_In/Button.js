import React from "react";
import {TouchableOpacity, Text } from "react-native";

export default function AppButton({ onPress, title, buttonStyle, textStyle}){
    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
} 

// export default function AppButton(){
//     return (
//         <Text>title</Text>
//     );
// }