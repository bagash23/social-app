// @refresh result
import { View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useRoute } from '@react-navigation/native'
import { nanoid } from 'nanoid'
import "react-native-get-random-values"
import GlobalContext from '../context/Context'
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { Actions, GiftedChat, InputToolbar, Bubble } from 'react-native-gifted-chat'
import { Ionicons } from '@expo/vector-icons'
import { pickImage, uploadImage } from '../utils'
import ImageView from 'react-native-image-viewing'

const randomId = nanoid()

export default function RoomChat() {

    const [roomHash, setRoomHash] = useState("");
    const [messages, setMessages] = useState([])
    const [show, setShow] = useState(false);
    const [selectedImageView, setSelectedImageView] = useState("")
    const {theme: {colors}} = useContext(GlobalContext);

    const {currentUser} = auth;
    const route = useRoute();
    const room = route.params.room;    
    const selectedImage = route.params.image;
    const userB = route.params.user;

    const senderUser = currentUser.photoURL ? {name: currentUser.displayName, _id: currentUser.uid, avatar: currentUser.photoURL} : {name: currentUser.displayName, _id: currentUser.uid};
    const roomId = room ? room.id : randomId;

    const roomRef = doc(db, "rooms", roomId);
    const roomMessagesRef = collection(db, "rooms", roomId, "messages");

    useEffect(() => {
        (async () => {
            if (!room) {
                const currentUserData = {
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                }
                if (currentUser.photoURL) {
                    currentUserData.photoURL = currentUser.photoURL
                }
                const userBData = {
                    displayName: userB.contactName || userB.displayName || "",
                    email: userB.email,
                }
                if (userB.photoURL) {
                    userBData.photoURL = userB.photoURL
                }
                const roomData = {
                    participants: [currentUserData, userBData],
                    participantsArray: [currentUser.email, userB.email]
                }
                try {
                    await setDoc(roomRef, roomData)
                } catch (error) {
                    console.log(error);
                }
            }
            const emailHash = `${currentUser.email} : ${userB.email}`;
            setRoomHash(emailHash);
        })()
    }, [])


    useEffect(() => {
        const unsubscribe = onSnapshot(roomMessagesRef, querySnapshot => {
            const messagesFirestore = querySnapshot.docChanges().filter(({type}) => type === "added").map(({doc}) => {
                const message = doc.data();
                return {...message, createdAt: message.createdAt.toDate()}
            }).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
            appendMessages(messagesFirestore)
        });
        return () => unsubscribe();
    }, [])

    const appendMessages = useCallback((messages) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages) );
    }, [messages])

    async function onSend(messages = []) {
        const writes = messages.map(m => addDoc(roomMessagesRef, m));
        const lastMessage = messages[messages.length - 1];
        writes.push(updateDoc(roomRef, {lastMessage}));
        await Promise.all(writes);
    };

    async function sendImage(uri, roomPath) {
        const { url, fileName } = await uploadImage(
            uri,
            `images/rooms/${roomPath || roomHash}`
        );
        const message = {
            _id: fileName,
            text: "",
            createdAt: new Date(),
            user: senderUser,
            image: url,            
        };
        const lastMessage = { ...message, text: "Image" };
        await Promise.all([
            addDoc(roomMessagesRef, message),
            updateDoc(roomRef, { lastMessage }),
        ]);
    }
    
    async function handlePhotoPicker() {
        const result = await pickImage();
        if (!result.cancelled) {
            await sendImage(result.uri);
        }
    }

    return (
        <ImageBackground resizeMode='cover' source={require('../assets/chatbg.png')} style = {{flex: 1}} >
            <GiftedChat 
                onSend={onSend}
                messages={messages}
                user={senderUser}
                renderAvatar={null}
                onPressActionButton={handlePhotoPicker}
                renderActions={(props) => (
                    <Actions {...props} containerStyle={{position: 'absolute', right: 60, bottom: 3, zIndex: 9999}} icon = {() => <Ionicons name = "camera" size ={30} color={colors.iconGray} /> } />
                )}
                timeTextStyle={{right: {color: colors.iconGray}}}
                renderBubble={(props) => (
                    <Bubble {...props}  textStyle={{right: {color: colors.text}}} wrapperStyle = {{left: {backgroundColor: colors.white}, right: {backgroundColor: colors.tertiary}}}  />
                )}
                renderMessageImage={(props) => {
                    return (
                        <View style = {{borderRadius: 15, padding: 2}} >
                            <TouchableOpacity onPress={() => {
                                setShow(true)
                                setSelectedImageView(props.currentMessage.image)
                            }} >
                                <Image resizeMode = "contain" source = {{uri: props.currentMessage.image}} style = {{width: 200, height: 200, borderRadius: 15, padding: 6, resizeMode: "cover"}}   />
                                {(selectedImageView) ? (
                                    <ImageView imageIndex={0} visible={show} onRequestClose={() => setShow(false)} images = {[{uri: selectedImageView}]} />
                                ) : null}
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </ImageBackground>
    )
}