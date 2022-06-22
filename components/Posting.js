import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function Posting() {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style = {{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: "#2330D5",
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
        }} onPress={() => navigation.navigate('post')} >
            <Ionicons name='add' size={Dimensions.get("window").width * 0.1}  color="#D8E0F0"  />
        </TouchableOpacity>
    )
}