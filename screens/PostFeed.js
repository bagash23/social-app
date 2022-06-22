import { View, Text, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { pickImage, uploadImage } from '../utils';
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { auth, db } from '../firebase';
import { collection, setDoc, doc, updateDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid'
import { useNavigation, useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'



const randomId = nanoid()

export default function PostFeed() {
    const [selectedImage, setSelectedImage] = useState(null);
    const { currentUser } = auth;    
    const [post, setPost] = useState(null);
    const navigation = useNavigation()    
    const [postHash, setPostHash]  = useState('')
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require("../assets/fonts/Poppins-Regular.ttf"),
        'Poppins-Italic': require("../assets/fonts/Poppins-Italic.ttf"),
        'Poppins-Medium': require("../assets/fonts/Poppins-Medium.ttf"),
        'Poppins-SemiBold': require("../assets/fonts/Poppins-SemiBold.ttf"),
        'Poppins-Bold': require("../assets/fonts/Poppins-Bold.ttf"),
    });

    const senderUser = { name: currentUser.displayName, _id: currentUser.uid, avatar: currentUser.photoURL };

    if (!fontsLoaded) {
        <AppLoading />
    };

    async function handleProfilePicture(){
        const result = await pickImage()
        if (!result.cancelled) {
            setSelectedImage(result.uri) 
        }
    }

    async function handleSubmit(postPath){
        const { url, fileName } = await uploadImage(selectedImage,`images/posts/${postPath || postHash }`);
        const postData = {
            _id:  fileName,
            user: senderUser,
            image: url,
            createdAt: new Date(),
            id: randomId,
            caption: post,
            // comments: [],
        }
        setUploading(true)
        // setTransferred(Math.round( (transferred + 1) / postData.length * 100 ))
        await Promise.all([
            setDoc(doc(db, "posts", randomId), postData),            
        ])
        
        navigation.replace('myApp')
    }

    const { colors } = useTheme()


    return (
        <View style = {{
            flex: 1,
            backgroundColor: colors.background
        }} >
            <TouchableOpacity style = {{flexDirection: "row", alignItems: "center", paddingHorizontal: Dimensions.get("window").width * 0.05}} onPress={() => navigation.navigate('feed')} >
                <Entypo name='chevron-small-left' size={Dimensions.get("window").width * 0.1}  color={colors.text}  />
                <Text style = {{
                    fontSize: Dimensions.get('window').width * 0.05,
                    textAlign: 'center',
                    padding: Dimensions.get('window').width * 0.05,
                    fontFamily: "Poppins-Medium",
                    color: colors.text
                }} >Posting Cerita</Text>
            </TouchableOpacity>
            <View style = {{
                alignItems: 'center'
            }} >
                <TouchableOpacity onPress={handleProfilePicture} 
                    style={{
                        marginTop: 30,                    
                        width: Dimensions.get('window').width * 0.5,
                        height: Dimensions.get('window').width * 0.3,
                        backgroundColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                }} >
                    {!selectedImage ? (
                        <MaterialCommunityIcons
                            name="camera-plus"
                            color={"#030303"}
                            size={Dimensions.get('window').width * 0.1}
                        />
                    ) : (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: Dimensions.get('window').width * 0.5, height: Dimensions.get('window').width * 0.3 }}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style = {{
                borderWidth: 1,
                marginTop: Dimensions.get('window').width * 0.05,
                paddingHorizontal: Dimensions.get('window').width * 0.05,
                marginHorizontal: Dimensions.get('window').width * 0.05, 
                borderColor: colors.text             
            }} >
                <TextInput 
                    style = {{
                        height: Dimensions.get('window').width * 0.3,
                        justifyContent: "flex-start",
                        textAlignVertical: 'top',
                        paddingTop: Dimensions.get('window').width * 0.02,    
                        color: colors.text                          
                    }} 
                    numberOfLines={10} 
                    multiline={true}
                    placeholder="Apa yang sedang kamu pikirkan?"
                    value={post}
                    onChangeText={(content) => setPost(content)}
                    placeholderTextColor={colors.text}         
                />
            </View>
            {uploading ? (
                <Modal
                transparent={true}
                animationType={'none'}
                // visible={post}
                style={{ zIndex: 1100 }}
                onRequestClose={() => { }}>
                    <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    backgroundColor: '#rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                    }}>
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            height: 100,
                            width: 100,
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            {/* <Text>{transferred} % Berhasil</Text> */}
                            <Text style = {{
                                fontSize: Dimensions.get('window').width * 0.03,
                                fontFamily: "Poppins-Italic"
                            }} >Posting dulu masseh</Text>
                            <ActivityIndicator  color="black" size="large"  />
                        </View>
                    </View>
                </Modal>
            ) : null}
            <TouchableOpacity style = {{
                marginTop: Dimensions.get('window').width * 0.05,
                marginHorizontal: Dimensions.get('window').width * 0.05,
                paddingVertical: Dimensions.get('window').width * 0.02,
                backgroundColor: colors.primary,
                borderRadius: Dimensions.get('window').width * 0.02,
            }} onPress={handleSubmit} disabled={ !selectedImage || !post } >
                <Text style = {{
                    color: "#fff",
                    fontSize: Dimensions.get('window').width * 0.04,
                    fontFamily: "Poppins-Regular",
                    textAlign: 'center'                    
                }} >Posting</Text>
            </TouchableOpacity>

        </View>
    )
}