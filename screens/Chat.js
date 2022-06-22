import { View, Text, StatusBar, TouchableOpacity, FlatList, ImageBackground, Dimensions, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { auth, db } from '../firebase'
import GlobalContext from '../context/Context'
import Context from '../context/Context'
import ContactsFloatingIcon from '../components/ContactsFloatingIcon'
import Listitem from '../components/Listitem'
import useContact from '../hooks/useHooks'
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import Modal from "react-native-modal";
import RowList from '../components/RowList'
import { EventRegister } from 'react-native-event-listeners'
import MasonryList from '@react-native-seoul/masonry-list'



// fonts
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import { Switch } from 'react-native-paper'
import Avatar from '../components/Avatar'



export default function Chat() {    
    const {currentUser} = auth    
    const { rooms, setRooms, setUnfilteredRooms, unfilteredRooms } = useContext(GlobalContext)
    const {theme} = useContext(Context)    
    const contacts = useContact()
    const navigation = useNavigation()
    const [show, setShow] = useState(false)
    const {colors}  = useTheme()
    const [selected, setSelected] = useState(false)

    
    const [darkMode, setDarkMode] = useState(false)
            
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

    const chatsQuery = query(
        collection(db, "rooms"),
        where("participantsArray", "array-contains",  currentUser.email)
    )
    useEffect(() => {
        const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
            const parsedChats = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                userB: doc.data().participants.find(p => p.email !== currentUser.email),
            }));
            setUnfilteredRooms(parsedChats)
            setRooms(parsedChats.filter((doc) => doc.lastMessage))
        });
        return () => unsubscribe();
    }, []);


    function getUserB(user, contacts) {
        const userContact = contacts.find((c) => c.email === user.email);
        if (userContact && userContact.contactName ) {
            return {...user, contactName: userContact.contactName}
        }
        return user;
    };
    
    // membuat fungsi handle logout
    async function handleLogout() {
        try {
            await auth.signOut().then(() => {
                navigation.replace('getstarted')
            })
            
        } catch (error) {
            console.log(error);
        }
    }

    const alluserRef = collection(db, "users")
    const alluserQuery = query(alluserRef, where("email", "!=", currentUser.email))
    const [alluser, setAlluser] = useState([])    
    useEffect(() => {
        const unsubscribe = onSnapshot(alluserQuery, (querySnapshot) => {
            const parsedUsers = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setAlluser(parsedUsers)
        });
        return () => unsubscribe();
    }, []);

    return (        
        <View style = {{flex: 1, backgroundColor: colors.background}} >            
            {/* <StatusBar backgroundColor={"#000"} barStyle="light-content" /> */}
            
            <View style = {{
                backgroundColor: colors.background,
                height: Dimensions.get('window').width * 0.6,
            }} >
                <View style = {{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: Dimensions.get("window").width * 0.05,
                }} >
                    <Text style = {{
                        fontFamily: 'Poppins-Bold',
                        fontSize: Dimensions.get("window").width * 0.05,
                        color: colors.text,
                    }} >Pesan</Text>
                    {/* <View style = {{flexDirection: 'row', alignItems: 'center', }} >
                        <TouchableOpacity style = {{marginRight: Dimensions.get('window').width * 0.05}} onPress = {() => navigation.navigate('feed')} >
                            <Ionicons name='add-circle-sharp' size={Dimensions.get("window").width * 0.07}  color={"#2330D5"}  />
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => setShow(true)} >
                            <Ionicons name='md-settings-sharp' size={Dimensions.get("window").width * 0.07}  color={"#2330D5"} />
                        </TouchableOpacity>                    
                    </View> */}
                </View>
                <FlatList
                    data={alluser}
                    horizontal={true}
                    renderItem={({ item }) => (
                        <RowList                           
                            type="contacts" 
                            user={item}                            
                            room={unfilteredRooms.find(room => room.participantsArray.includes(item.email))}                            
                        />
                    )}
                />
            </View>

            {rooms.map((room) => 
                <Listitem 
                    type="chat" 
                    description={room.lastMessage.text} 
                    key={room.id} 
                    room={room} 
                    time={room.lastMessage.createdAt} 
                    user={getUserB(room.userB, contacts)}                    

                />
            )}
            {/* <Modal
                isVisible={show}
                style={{justifyContent: 'flex-end', margin: 0}}
                animationIn="slideInUp"
            >
                <View style = {{backgroundColor: colors.background, height: Dimensions.get('window').height * 0.6,}} >
                    <ImageBackground source={require('../assets/chatbg.png')} style = {{flex: 1}} >
                        <TouchableOpacity onPress={() => setShow(false)} style = {{position: 'absolute', right: Dimensions.get("window").width * 0.05, top: Dimensions.get("window").width * 0.03, backgroundColor: "#dcf8c6", padding: Dimensions.get("window").width * 0.02, borderRadius: Dimensions.get("window").width * 0.05}} >
                            <MaterialIcons name='clear' size={Dimensions.get("window").width * 0.05}/>
                        </TouchableOpacity>
                        <View style = {{paddingHorizontal: Dimensions.get("window").width * 0.05, marginTop: Dimensions.get("window").width * 0.1}} >
                            <Text style = {{fontSize: Dimensions.get("window").width * 0.05, color: colors.text, fontFamily: "Poppins-SemiBold"}} >Pengaturan</Text>
                            <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-Regular",}} >Masih tahap pengembangan🙂</Text>
                            <View style = {{marginTop: Dimensions.get("window").width * 0.1}} >
                                <TouchableOpacity style = {{flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginBottom: Dimensions.get("window").width * 0.1}} onPress={() => navigation.replace('edit')} >
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}} >
                                        <MaterialCommunityIcons name='account' size={Dimensions.get("window").width * 0.05}  color={colors.text}  />
                                        <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-Regular", marginLeft: Dimensions.get("window").width * 0.03}} >Profil Saya</Text>
                                    </View>
                                    <Entypo name='chevron-small-right' size={Dimensions.get("window").width * 0.05}  color={colors.text}  />
                                </TouchableOpacity>                        
                                <TouchableOpacity style = {{flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginBottom: Dimensions.get("window").width * 0.1}} onPress={() => navigation.replace('tentang')} >
                                    <View style = {{flexDirection: 'row', alignItems: 'center'}} >
                                        <MaterialCommunityIcons name='information-outline' size={Dimensions.get("window").width * 0.05}  color={colors.text}  />
                                        <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-Regular", marginLeft: Dimensions.get("window").width * 0.03}} >Tentang Kami</Text>
                                    </View>
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
                        <View style = {{position: "absolute", bottom: 0}} >
                            <View style = {{flexDirection: 'row', alignItems: 'center', paddingHorizontal: Dimensions.get("window").width * 0.05}} >
                                <MaterialCommunityIcons name='infinity' size={30}  color={colors.text}  />
                                <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-SemiBold", marginLeft: Dimensions.get("window").width * 0.03}} >JengCall</Text>
                            </View>
                            <View style = {{padding: Dimensions.get("window").width * 0.05}}  >
                                <Text style = {{fontSize: Dimensions.get("window").width * 0.03, color: colors.text, fontFamily: "Poppins-Regular"}} >Kontrol pengaturan untuk pengalaman terhubung di jengcall termasuk berbagi cerita melalu pesan</Text>                    
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </Modal> */}
            <ContactsFloatingIcon />
        </View>
    )
}