import { Text, LogBox, SafeAreaView, ActivityIndicator, Modal, View, Appearance, TouchableOpacity  } from 'react-native';
import {useAssets} from 'expo-asset'
import { useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase';
import { NavigationContainer, DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignIn from './screens/SignIn';
import ContextWrapper from './context/ContextWrapper';
import Context from './context/Context';
import Profile from './screens/Profile';
import Chat from './screens/Chat';
import Contacts from './screens/Contacts';
import RoomChat from './screens/RoomChat';
import ChatHeader from './components/ChatHeader';
import TentangKami from './screens/TentangKami';
import EditProfil from './screens/EditProfil';
import { EventRegister } from 'react-native-event-listeners';
import Feed from './screens/Feed';
import PostFeed from './screens/PostFeed';
import Search from './screens/Search';
import OutherProfil from './screens/OutherProfil';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialIcons, Ionicons, MaterialCommunityIcons, Entypo, Octicons } from '@expo/vector-icons'





LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core",  
  "EventEmitter.removeListener"
]);

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();


function MyTabs() {
  const {colors} = useTheme()
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor={colors.text}
      barStyle={{ backgroundColor: colors.card }}
    >
      <Tab.Screen
        name="feed"
        component={Feed}
        options={{
          tabBarLabel: 'Cerita',
          tabBarIcon: ({ color }) => (
            <Octicons name="feed-repo" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={Chat}
        options={{
          tabBarLabel: 'Pesan',
          tabBarIcon: ({ color }) => (
            <Octicons name="feed-discussion" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="edit"
        component={EditProfil}
        options={{
          tabBarLabel: 'Akun',
          tabBarIcon: ({ color }) => (
            <Octicons name="feed-person" color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}



function App() {

  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {theme: {colors}} = useContext(Context)


  const [darkApp, setDarkApp] = useState(false);
  const appTheme = darkApp ? DarkTheme : DefaultTheme

  useEffect(() => {
    let eventListener = EventRegister.addEventListener('changeThemeEvent', (data) => {
      setDarkApp(data)
    })

    return () => {
      EventRegister.removeEventListener(eventListener)
    }
  }, [])
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false)
      if (user) {
        setCurrUser(user)
      }
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
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
            <ActivityIndicator animating={loading} color="black" />
          </View>
        </View>
      </Modal>
    )
  }



  return (
    
    <NavigationContainer theme={appTheme} >

      {!currUser ? (
        <Stack.Navigator screenOptions={{headerShown: false}} >
          <Stack.Screen name='signIn' component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerStyle: {
          backgroundColor: "#000",
          shadowOpacity: 0,
          elevation: 0,
        }, headerTintColor: colors.white}} >
          {!currUser.displayName && (
            <Stack.Screen name="profile" component={Profile} options={{headerShown: false}} />
          )}
          
          {/* <Stack.Screen name='chat' component={Chat} options={{headerShown: false}} />                       
          <Stack.Screen name='edit' component={EditProfil} options={{headerShown: false}} />   
          <Stack.Screen name='feed' component={Feed} options={{headerShown: false}} />    */}
          <Stack.Screen name='myApp' component={MyTabs} options={{headerShown: false}} />   
          <Stack.Screen name='post' component={PostFeed} options={{headerShown: false}} />   
          <Stack.Screen name='search' component={Search} options={{headerShown: false}} />   
          <Stack.Screen name='outher' component={OutherProfil} options={{headerShown: false}} />   
          <Stack.Screen name='tentang' component={TentangKami} options={{headerShown: false}} />          
          <Stack.Screen name='contacts' component={Contacts} options = {{title: "Select Contacts"}} />
          <Stack.Screen name='roomchat' component={RoomChat} options={{headerTitle: (props) => <ChatHeader {...props} />}} />                  
        </Stack.Navigator>
      )}
      
    </NavigationContainer>    
  );
}


function Main() {
  const [assets] = useAssets(
    require('./assets/icon-square.png'),
    require('./assets/chatbg.png'),
    require('./assets/user-icon.png'),
    require('./assets/welcome-img.png'),
  );

  if (!assets) {
    return <Text>Loading ..</Text>;
  }
  return ( 
      <ContextWrapper>
        <App/>
      </ContextWrapper>    
  )
}

export default Main