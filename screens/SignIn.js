import { View, Text, StyleSheet, StatusBar, Image, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import Context from '../context/Context'
import { signIn, signUp } from '../firebase'

export default function SignIn() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("signUp")

  const {theme: {colors}} = useContext(Context)

  async function handlePress() {
    if (mode === 'signUp') {
      await signUp(email, password)
    }
    if (mode === 'signIn') { 
      await signIn(email, password)
    }
  }

  return (
    <View style = {[styles.container, {backgroundColor: colors.white}]} > 
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <Text style = {{color: "#030303", fontSize: 24, marginBottom: 20, fontWeight: "bold", textAlign: 'center'}} >Selamat datang di JengCall</Text>
        <Text style = {{textAlign: 'center', color: "#030303"}} >Aplikasi berbasis mobile yang memberikan fitur untuk kita bercertia dan berbicara ke semua orang</Text>
        <View style = {{marginTop: 20}} >
          <TextInput placeholder='Masukan Email Anda' style = {{backgroundColor: "#f3f5f6",  width: "100%", marginTop: 20, padding: 12}} value = {email} onChangeText={setEmail} />
        </View>
        <View style = {{marginTop: 20}} >
          <TextInput placeholder='Masukan Kata Sandi Anda' secureTextEntry={true} style = {{backgroundColor: "#f3f5f6",  width: "100%", marginTop: 20, padding: 12}} value={password} onChangeText={setPassword} />
          <Text style = {{fontSize: 10, fontStyle: "italic", color: colors.secondaryText}} >kata sandi minimal 6 karakter</Text>
          <View style = {{marginTop: 20}} >
            <Button color={"#030303"} title={mode === "signUp" ? "Daftar" : "Masuk"} disabled = {!password || !email} onPress={handlePress} />
          </View>
          <TouchableOpacity style = {{marginTop: 15}} onPress={() => mode === 'signUp' ? setMode('signIn') : setMode('signUp')} >
            <Text style = {{color: colors.secondaryText, textAlign: "center"}} >{mode === "signUp" ? "Sudah memiliki akun? Masuk": "Tidak punya akun? Daftar"}</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
        justifyContent: 'center',
        paddingHorizontal: 20
    },
});