// @refresh result
import { View, Text, Dimensions, TouchableOpacity, Image, FlatList, ActivityIndicator, TextInput  } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useNavigation, useTheme } from '@react-navigation/native'
import Avatar from '../components/Avatar'
import { auth, db } from '../firebase'
import Posting from '../components/Posting'
import GlobalContext from '../context/Context'
import { collection, doc, onSnapshot, query, where, setDoc, addDoc, updateDoc } from 'firebase/firestore'
import { Foundation , Ionicons } from '@expo/vector-icons'
import { nanoid } from 'nanoid'

const randomId = nanoid()

export default function Feed() {
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
    const { currentUser } = auth
    const { posts, setPosts } = useContext(GlobalContext)
    console.log(Object.values(posts));
    
    const postingan = query(
        collection(db, "posts"),
        where("user", "!=" , currentUser.uid)
    )
    
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onSnapshot(postingan, (querySnapshot) => {
            const parsedPosting = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setPosts(parsedPosting)
        })        
        return () => unsubscribe()
    }, [])

    const [comment, setComment] = useState('')
    const [proses, setProses] = useState(false)
    
    console.log(comment, "kiriman dari komentar");

    async function handleKomentar() {
        if (comment.length > 0) {
            const newComment = {
                _id: randomId,
                text: comment,
                createdAt: new Date(),
                user: {
                    _id: currentUser.uid,
                    name: currentUser.displayName,
                    avatar: currentUser.photoURL,
                },
            }
            setProses(true)
            await setDoc(collection(db, `posts/${Object.values()}`), "comments", newComment)
        }
    }

    const {colors}  = useTheme();
    return (
        <View style = {{flex: 1, backgroundColor: colors.background}} >
            <View style = {{padding: Dimensions.get('window').width * 0.05, alignItems: 'center', flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.card}} >
                {/* <TouchableOpacity onPress={() => navigation.navigate('chat')} >
                    <Entypo name='chevron-small-left' size={Dimensions.get("window").width * 0.1}  color={colors.text}  />
                </TouchableOpacity> */}
                <Text style = {{color: colors.text, fontSize: Dimensions.get('window').width * 0.05, fontFamily: "Poppins-Bold"}} >JengCall</Text>
                <Ionicons name='ios-newspaper' size={Dimensions.get("window").width * 0.08}  color={colors.text} onPress={() => navigation.navigate("search")}  />
            </View>
            <FlatList                
                data = {posts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    return (
                        <View style = {{
                            marginVertical: Dimensions.get('window').width * 0.02,
                            backgroundColor: colors.card,

                        }} >
                            <View style = {{                            
                                padding: Dimensions.get('window').width * 0.05,
                            }} >
                                <View style = {{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: Dimensions.get('window').width * 0.02,                                    
                                }}  >
                                    <Image source={{uri: item.user.avatar}} style = {{
                                        width: Dimensions.get('window').width * 0.12,
                                        height: Dimensions.get('window').width * 0.12,
                                        borderRadius: Dimensions.get('window').width * 0.1,
                                    }}  />
                                    <View style = {{
                                        marginLeft: Dimensions.get('window').width * 0.05,
                                    }} >
                                        <Text style = {{
                                            fontSize: Dimensions.get('window').width * 0.04,
                                            fontFamily: "Poppins-Medium",
                                            color: colors.text,
                                        }} >{item.user.name}</Text>
                                        <Text style = {{
                                            fontSize: Dimensions.get('window').width * 0.03,
                                            fontFamily: "Poppins-Regular",
                                            color: colors.text,
                                        }} >{new Date(item.createdAt.seconds * 1000).toDateString()}</Text>
                                    </View>
                                </View>
                                <Text style = {{
                                    fontSize: Dimensions.get('window').width * 0.03,
                                    fontFamily: "Poppins-Regular",
                                    color: colors.text,
                                    paddingVertical: Dimensions.get('window').width * 0.02,                                    
                                }} >{item.caption}</Text>
                                <Image source={{uri: item.image}} style = {{
                                    width: Dimensions.get('window').width * 0.9,
                                    height: Dimensions.get('window').width * 0.9,
                                    borderRadius: Dimensions.get('window').width * 0.02,
                                }} resizeMode="cover" />                                
                                <View style = {{flexDirection: "row", alignItems: 'center'}} >
                                    {/* <Text style = {{
                                        fontSize: Dimensions.get('window').width * 0.03,
                                        fontFamily: "Poppins-Bold",
                                        color: colors.text,
                                    }} >{item.user.name}</Text> */}
                                    
                                </View>
                                <View>
                                    {/* membuat input comment */}
                                    {/* <View>
                                        <TextInput
                                            placeholder='Tulis komentar...'
                                            placeholderTextColor={colors.text}
                                            style={{
                                                width: Dimensions.get('window').width * 0.8,
                                                height: Dimensions.get('window').width * 0.08,
                                                borderColor: colors.text,
                                                borderWidth: 1,
                                                borderRadius: Dimensions.get('window').width * 0.02,
                                                paddingHorizontal: Dimensions.get('window').width * 0.02,
                                                marginVertical: Dimensions.get('window').width * 0.02,
                                                fontSize: Dimensions.get('window').width * 0.03,
                                                fontFamily: "Poppins-Regular",
                                                color: colors.text,
                                            }}
                                            onChangeText={(text) => {
                                                setComment(text)
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={handleKomentar}
                                            style={{
                                                width: Dimensions.get('window').width * 0.8,
                                                height: Dimensions.get('window').width * 0.08,
                                                borderRadius: Dimensions.get('window').width * 0.02,
                                                backgroundColor: colors.primary,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginVertical: Dimensions.get('window').width * 0.02,
                                            }}
                                        >  
                                            <Text style = {{
                                                fontSize: Dimensions.get('window').width * 0.03,
                                                fontFamily: "Poppins-Bold",
                                                color: colors.card,
                                            }} >KOMENTAR</Text>  
                                        </TouchableOpacity>
                                    </View> */}

                                </View>
                            </View>
                        </View>
                    )
                }}
            />
            <Posting/>
        </View>
    )
}