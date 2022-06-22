import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function ContactsFloatingIcon() {
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
        }} onPress={() => navigation.navigate('contacts')} >
            <MaterialCommunityIcons name="android-messages" size={30} color="#fff" style = {{transform: [{scaleX: -1}]}} />
        </TouchableOpacity>
    )
}