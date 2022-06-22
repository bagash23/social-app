import { View, Text, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView, FlatList } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { MaterialCommunityIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import GlobalContext from '../context/Context'
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { nanoid } from 'nanoid'

const randomId = nanoid()


export default function OutherProfil() {

    const navigation = useNavigation()
    const {colors}  = useTheme()
    const route = useRoute();    
    const DetilNews = route.params.item;      
    console.log(DetilNews, "ini detil news");

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require("../assets/fonts/Poppins-Regular.ttf"),
        'Poppins-Italic': require("../assets/fonts/Poppins-Italic.ttf"),
        'Poppins-Medium': require("../assets/fonts/Poppins-Medium.ttf"),
        'Poppins-SemiBold': require("../assets/fonts/Poppins-SemiBold.ttf"),
        'Poppins-Bold': require("../assets/fonts/Poppins-Bold.ttf"),
    });

    if (!fontsLoaded) {
        <AppLoading />
    };    

    return (
        <View style = {{
            flex: 1,
            backgroundColor: colors.card
        }} >
            <ScrollView showsVerticalScrollIndicator = {false} >
                <View style = {{
                    zIndex: -999,
                    position: "absolute",
                    top: 0,
                }} >
                    <Image source={{uri: DetilNews.image}} style = {{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height * 0.3
                    }} />
                </View>
                <TouchableOpacity onPress={() => navigation.goBack('')} >
                    <Entypo name='chevron-small-left' size={Dimensions.get("window").width * 0.08}  color={"#fff"}  />
                </TouchableOpacity>
                <View style = {{
                    backgroundColor: colors.card,
                    height: Dimensions.get('window').height,
                    top: Dimensions.get('window').height * 0.20,
                    // bottom: 0,
                    borderTopLeftRadius: Dimensions.get('window').width * 0.05,
                    borderTopRightRadius: Dimensions.get('window').width * 0.05,
                }} >
                    <View style = {{
                        margin: Dimensions.get('window').width * 0.05,
                    }} >
                        <View style = {{
                            // borderBottomWidth: 1,
                            // borderBottomColor: "#A00506",
                            marginBottom: Dimensions.get('window').width * 0.02
                            // width: Dimensions.get('window').width * 0.9,
                        }} >
                            <Text style = {{
                                fontFamily: 'Poppins-Medium',
                                fontSize: Dimensions.get('window').width * 0.03,
                                color: "#A00506",
                                
                            }} >{DetilNews.categori}</Text>
                        </View>
                        <Text style = {{
                            fontSize: Dimensions.get('window').width * 0.07,
                            fontFamily: "Poppins-Bold",
                            color: colors.text
                        }} >{DetilNews.judul}</Text>
                        <Text style = {{
                            fontFamily: 'Poppins-Regular',
                            fontSize: Dimensions.get('window').width * 0.03,
                            color: colors.text
                        }} >{new Date(DetilNews.createdAt.seconds * 1000).toDateString()}</Text>
                        <Text style = {{
                            marginTop: Dimensions.get('window').height * 0.05,
                            fontSize: Dimensions.get('window').width * 0.04,
                            fontFamily: "Poppins-Regular",
                            color: colors.text
                        }} >{DetilNews.deskripsi}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}