import { View, Text, TouchableOpacity, Image, Dimensions, TextInput, FlatList, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import GlobalContext from '../context/Context'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'


export default function Search() {
    const { colors } = useTheme()
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
    const navigation = useNavigation()
    const { news, setNews } = useContext(GlobalContext)    
    console.log(news);
    const berita = query(collection(db, "news"))    

    useEffect(() => {
        const unsubscribe = onSnapshot(berita, (querySnapshot) => {
            const parsedNews = querySnapshot.docs.map((doc) => {
                return { ...doc.data(), id: doc.id }
            })
            setNews(parsedNews)
        })
        return () => unsubscribe()
    }, [])

    

    return (
        <View style = {{
            flex: 1,
            backgroundColor: colors.background
        }} >
            <View style = {{
                flexDirection: "row",
                alignItems: 'center',
                justifyContent: "space-between",
                padding: Dimensions.get('window').width * 0.05
            }} >
                <TouchableOpacity onPress={() => navigation.goBack('')} >
                    <Entypo name='chevron-small-left' size={Dimensions.get("window").width * 0.08}  color={colors.text}  />
                </TouchableOpacity>
                <Text style = {{
                    fontFamily: 'Poppins-Bold',
                    fontSize: Dimensions.get('window').width * 0.05,
                    color: colors.text
                }} >JengCall Berita</Text>
            </View>
            {/* <View style = {{
                backgroundColor: "#FFCC8F",
                paddingHorizontal: Dimensions.get('window').width * 0.05,
                paddingVertical: Dimensions.get('window').width * 0.02,
            }} >
                <View style = {{
                    flexDirection: "row",
                    alignItems: 'center'
                }} >
                    <Text style = {{
                        fontFamily: 'Poppins-Medium',
                        fontSize: Dimensions.get('window').width * 0.04,
                        color: "#A00506"
                    }} >Sedang Trending</Text>
                    <Text style = {{
                        fontFamily: 'Poppins-Regular',
                        fontSize: Dimensions.get('window').width * 0.03,
                        color: "#030303",
                        marginLeft: Dimensions.get('window').width * 0.02
                    }} >Formula E Di Jakarta</Text>
                </View>
            </View> */}
            <View>
                {/* Trending Berita */}
                <View>
                    <FlatList
                        data={news.filter(item => item.categori === "Trending").sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator = {false}
                        renderItem={({ item, index }) => (
                            <>
                                <Pressable key={index} onPress={() => navigation.navigate('outher', {item})} >                                    
                                    <Image source={{uri: item.image}} style = {{
                                        width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').width * 0.5 ,
                                    }} />
                                    <View style = {{
                                        backgroundColor: "#fff",
                                        padding: Dimensions.get('window').width * 0.02,
                                        position: "absolute",
                                        bottom: Dimensions.get('window').width * 0.02,
                                        width: Dimensions.get('window').width * 0.9,                                        
                                        alignSelf: "center",
                                        // borderRadius: Dimensions.get('window').width * 0.02,
                                    }} >
                                        <Text style = {{
                                            fontFamily: 'Poppins-Medium',
                                            fontSize: Dimensions.get('window').width * 0.04,
                                            color: "#A00506",
                                        }} >{item.judul}</Text>
                                    </View>
                                </Pressable>
                            </>
                        )}
                    />
                </View>
                {/* berita biasa */}
                <View>
                    {news.filter(item => item.categori !== "Trending").sort((a, b) => b.createdAt.seconds - a.createdAt.seconds).map((item, index) => (
                        <Pressable key={index} style = {{
                            marginVertical: Dimensions.get('window').width * 0.05,
                            backgroundColor: colors.card
                        }} onPress={() => navigation.navigate('outher', {item})} >
                            <View style = {{
                                padding: Dimensions.get('window').width * 0.05,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }} >
                                <Image source={{uri: item.image}} style = {{
                                    width: Dimensions.get('window').width * 0.2,
                                    height: Dimensions.get('window').width * 0.2,
                                    borderRadius: Dimensions.get('window').width * 0.05,
                                }} />
                                <View style = {{
                                    marginLeft: Dimensions.get('window').width * 0.02,
                                }} >
                                    <Text style = {{
                                        fontFamily: 'Poppins-Medium',
                                        fontSize: Dimensions.get('window').width * 0.04,
                                        color: colors.text,
                                        width: Dimensions.get('window').width * 0.6,
                                    }} >{item.judul}</Text>
                                    <Text style = {{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: Dimensions.get('window').width * 0.03,
                                        color: colors.text
                                    }} >{new Date(item.createdAt.seconds * 1000).toDateString()}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    )
}