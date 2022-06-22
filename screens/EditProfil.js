import { View, Text, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView, FlatList, Alert } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { MaterialCommunityIcons, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { useNavigation, useTheme } from '@react-navigation/native'
import { Switch } from 'react-native-paper'
import { EventRegister } from 'react-native-event-listeners'



export default function EditProfil() {

    const { currentUser } = auth
    const navigation = useNavigation()
    const {colors}  = useTheme()
    const [darkMode, setDarkMode] = useState(false)
    const [comming, setComming] = useState(false)


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
        <View style = {{flex: 1}} >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1
                }}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator = {false}
            >
                <View style = {{
                    alignItems: 'center',
                    top: Dimensions.get('window').height * 0.07,
                }} >
                    <Image source={{uri: currentUser.photoURL}} style = {{
                        width: Dimensions.get("window").width * 0.25,
                        height: Dimensions.get("window").width * 0.25,
                        borderRadius: Dimensions.get("window").width * 0.125,
                    }} />
                    <Text style = {{
                        fontSize: Dimensions.get("window").width * 0.05,
                        fontFamily: 'Poppins-Bold',
                        color: colors.text,
                        marginTop: Dimensions.get("window").height * 0.01,
                    }} >{currentUser.displayName}</Text>
                    <Text style = {{
                        fontSize: Dimensions.get("window").width * 0.03,
                        fontFamily: 'Poppins-Regular',
                        color: colors.text,
                    }} >{currentUser.email}</Text>
                </View>
                <View style = {{
                    paddingHorizontal: Dimensions.get("window").width * 0.05,                        
                    marginTop: Dimensions.get("window").height * 0.2,
                }} >
                    
                    <View>
                        <Text style = {{
                            fontSize: Dimensions.get("window").width * 0.04,
                            fontFamily: 'Poppins-SemiBold',
                            color: colors.text,
                        }} >Pengaturan Akun</Text>
                        {comming ? (                        
                            Alert.alert(
                                'Coming Soon',
                                '',
                                [
                                    {text: 'OK', onPress: () => setComming(false)}
                                ],
                                {cancelable: false},
                            )

                        ) : <TouchableOpacity style = {{
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }} onPress = {() => setComming(true)} >
                            <Text style = {{
                                fontSize: Dimensions.get("window").width * 0.03,
                                fontFamily: 'Poppins-Regular',
                                color: colors.text,
                                marginTop: Dimensions.get("window").height * 0.01,                        
                            }} >Keamanan Akun</Text>
                            <Entypo name='chevron-small-right' size={Dimensions.get("window").width * 0.05}  color={colors.text}  />
                        </TouchableOpacity> }
                        
                    </View>
                    <View style = {{
                        marginTop: Dimensions.get("window").height * 0.05,
                    }} >
                        <Text style = {{
                            fontSize: Dimensions.get("window").width * 0.04,
                            fontFamily: 'Poppins-SemiBold',
                            color: colors.text,
                        }} >Bantuan dan Dukungan</Text>
                        <TouchableOpacity style = {{
                            flexDirection: "row",
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }} onPress={() => navigation.navigate('tentang')} >
                            <Text style = {{
                                fontSize: Dimensions.get("window").width * 0.03,
                                fontFamily: 'Poppins-Regular',
                                color: colors.text,
                                marginTop: Dimensions.get("window").height * 0.01,                        
                            }} >Tentang Kami</Text>
                            <Entypo name='chevron-small-right' size={Dimensions.get("window").width * 0.05}  color={colors.text}  />
                        </TouchableOpacity>
                        <TouchableOpacity style = {{flexDirection: "row", alignItems: 'center'}} >
                            <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-Regular",}} >Tema Gelap</Text>
                            <Switch value={darkMode} onValueChange={(val) => {
                                setDarkMode(val)
                                EventRegister.emit('changeThemeEvent', val)
                            }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style = {{
                    position: "absolute",
                    bottom: 0,
                    padding: Dimensions.get("window").width * 0.05,
                }} >
                    <View style = {{flexDirection: 'row', alignItems: 'center', }} >
                        <MaterialCommunityIcons name='infinity' size={30}  color={colors.text}  />
                        <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-SemiBold", marginLeft: Dimensions.get("window").width * 0.03}} >JengCall</Text>
                    </View>
                    <View>
                        <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-Regular"}} >Kontrol pengaturan untuk pengalaman terhubung di jengcall termasuk berbagi cerita melalu pesan</Text>                    
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}