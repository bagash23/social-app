import { View, Text, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'

export default function TentangKami() {
    const navigation = useNavigation()
    const {colors}  = useTheme()

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
            <TouchableOpacity style = {{flexDirection: "row", padding: Dimensions.get("window").width * 0.05, }} onPress={() => navigation.goBack('')}  >
                <Entypo name='chevron-small-left' size={Dimensions.get('window').width * 0.1}  color={colors.text}  />
            </TouchableOpacity>
            <ImageBackground source={require('../assets/chatbg.png')} style = {{flex: 1}} >            
                <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style = {{fontSize: Dimensions.get("window").width * 0.05, color: colors.text, fontFamily: 'Poppins-SemiBold'}} >Tentang Kami</Text>
                    <Text style = {{fontSize:  Dimensions.get("window").width * 0.03, color: colors.text, marginVertical:  Dimensions.get("window").width * 0.05, textAlign: 'center', marginHorizontal:  Dimensions.get("window").width * 0.03}} >Kami adalah sebuah komunitas kecil yang suka membuat sebuah teknologi baru di tengah masyarakat dan dunia, Kami membuat aplikasi JengCall ini untuk memberikan hasil yang kami pelajari selama ini dan aplikasi ini masi tahap pengembangan lebih lanjut. Terima kasih sudah mencoba aplikasi kami dan kami harap kamu bisa bertahan bersama kami</Text>
                    <Text style = {{fontSize: Dimensions.get("window").width * 0.05, color: colors.text, fontFamily: 'Poppins-SemiBold'}} >JengCall</Text>
                </View>
            </ImageBackground>
        </View>
    )
}