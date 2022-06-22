import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import GlobalContext from '../context/Context'
import { Grid, Row, Col } from 'react-native-easy-grid'
import Avatar from './Avatar'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'


export default function Listitem({type, style, description, user, time, room, image, active}) {
    const navigation = useNavigation()
    const {theme} = useContext(GlobalContext)
    const {colors}  = useTheme()
    return (
        <TouchableOpacity style = {{height: 80, ...style}} onPress = {() => navigation.navigate('roomchat', {user, room, image})} >
            <Grid style = {{maxHeight: 80}} >
                <Col style = {{width: 70, alignItems: 'center', justifyContent: 'center'}} >
                    <Avatar user={user} size={type === "contacts" ? 40 : 50} />
                </Col>
                <Col style={{marginLeft: 10}} >
                    <Row style = {{alignItems: 'center'}} >
                        <Col>
                            <Text style = {{color: colors.text}} >{user.contactName || user.displayName}</Text>
                            {/* {active ? (
                                <Ionicons name='checkmark-done' size={Dimensions.get("window").width * 0.05}  color={colors.text} style = {{
                                    position: "absolute",
                                    right: Dimensions.get("window").width * 0.2,
                                }}  />
                            ) : <MaterialIcons name='done' size={Dimensions.get("window").width * 0.05}  color={colors.text} style = {{
                                position: "absolute",
                                right: Dimensions.get("window").width * 0.2,
                            }} /> } */}
                        </Col>
                        {time && (
                            <Col style = {{alignItems: 'flex-end', marginRight: 10}} >
                                <Text style = {{color: "#757575", fontSize: 11}} >{new Date(time.seconds * 1000).toLocaleDateString()}</Text>
                            </Col>
                        )}
                        
                    </Row>
                    {description && (
                        <Row style = {{marginTop: -5}} >
                            <Text style = {{color: "#757575", fontSize: 13, width: Dimensions.get("window").width * 0.7}} >{description}</Text>
                        </Row>
                    )}
                    
                </Col>
            </Grid>
        </TouchableOpacity>
    )
}