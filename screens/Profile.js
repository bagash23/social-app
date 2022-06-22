import { View, Text, TouchableOpacity, Image, TextInput, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Context from '../context/Context'
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {pickImage, askForPermission, uploadImage} from '../utils'
import { auth, db } from '../firebase'
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const [displayName, setDisplayName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const {theme: {colors}} = useContext(Context);
    const navigation = useNavigation()

    async function handlePress(){
        const user = auth.currentUser;
        let photoURL;
        if (selectedImage) {
            const {url} = await uploadImage(selectedImage, `images/${user.uid}`, 'profilePicture')
            photoURL = url
        }
        const userData = {
            displayName,
            email: user.email
        }
        if (photoURL) {
            userData.photoURL = photoURL
        }
        await Promise.all([
            updateProfile(user, userData),
            setDoc(doc(db, "users", user.uid), {...userData, uid: user.uid})
        ])
        navigation.replace('chat')
    }
    const [permission, setPermission] = useState(null);
    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            setPermission(status);
        })();    
    }, [])

    async function handleProfilePicture(){
        const result = await pickImage()
        if (!result.cancelled) {
            setSelectedImage(result.uri)
        }
    }

    if (!permission) {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={permission}
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
                            <ActivityIndicator animating={permission} color="black" />
                        </View>
                    </View>
            </Modal>
        )
    }
    if (permission !== "granted") {
        return <Text>You need to allow this permission</Text>
    }


    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1, paddingTop: Constants.statusBarHeight + 20, padding: 20}} >
                <Text style = {{fontSize: 22, color: "#030303", fontWeight: 'bold'}} >Profil Info</Text>
                <Text style = {{fontSize: 12, color: colors.text, marginTop: 12}} >Harap berikan nama dan foto profil opsional Anda</Text>
                <TouchableOpacity     
                onPress={handleProfilePicture}         
                style={{
                    marginTop: 30,
                    borderRadius: 120,
                    width: 120,
                    height: 120,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                {!selectedImage ? (
                    <MaterialCommunityIcons
                        name="camera-plus"
                        color={colors.iconGray}
                        size={45}
                    />
                ) : (
                    <Image
                        source={{ uri: selectedImage }}
                        style={{ width: "100%", height: "100%", borderRadius: 120 }}
                    />
                )}
                </TouchableOpacity>
                <TextInput placeholder='Tulis nama kamu' value={displayName} onChangeText={setDisplayName} style = {{                    
                    backgroundColor: "#f3f5f6",  width: "100%", marginTop: 40, padding: 12
                }} />
                <View style = {{marginTop: "auto", width: "100%"}} >
                    <Button title='Selanjutnya' color={"#030303"} onPress={handlePress} disabled={!displayName} />
                </View>
            </View>
        </React.Fragment>
    )
}