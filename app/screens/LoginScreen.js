import React, {useContext, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, StyleSheet, TextInput, Platform, View} from 'react-native';
import jwtDecode from 'jwt-decode';

import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';



function LoginScreen(props) {
    const { user, setUser } = useContext(Auth);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isError, setIsError] = useState(false);

    const handleLogin = async () => {
        
        const accountObj = {
            email: email,
            password: password,
          };

          const jwt = await axios.post('http://192.168.43.218:4000/api/auth', accountObj)
          .then(setIsError(false))
          .catch(err =>{
            setIsError(true)
        });
            // const value = jwt.data;
            // console.log('SHIT FUCK', value);
            console.log(jwt.data);
            const user = jwtDecode(jwt.data);
            setUser(user);
            try {      
                await securecache.secureStore('token', jwt.data);   
            } catch (error) {
                console.log(error)
            }



            // try {
            //     await AsyncStorage.setItem("token", JSON.stringify(jwt.data));
            //     const value = await AsyncStorage.getItem("token");
            //     const parsed = JSON.parse(value);
            //     console.log(parsed);
                
            // } catch (error) {
            //     console.log(error);
            // }

            

        };

    return (
        <SafeAreaView style={styles.outercontainer}>
            <View style={styles.container}>
            <Image source={require("./logo.png")} 
            style={styles.logo} />

            <Text style={styles.title}>Login Form</Text>
            
            {isError && <Text style={styles.error}>Invalid account credentials</Text>}

            <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType='email-address'
            placeholder="Email"
            borderWidth={1}
            height={40}
            borderColor='#841584'
            onChangeText={text => setEmail(text)}
            />

            <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="password"
            secureTextEntry
            borderWidth={1}
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => setPassword(text)} 
            />


            <View style={styles.loginButton}>
            <Button title='Log in' onPress={handleLogin}
                            color="#841584"></Button></View>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    outercontainer: {
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        backgroundColor: 'white',
        flex: 1,
    },

    container: {
        backgroundColor: 'white',
        padding: 25
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#841584',
        marginBottom: 5,
    },
    error: {
        color: '#841584',
        marginBottom: 5,
        justifyContent: "center",
        textAlign: 'center',
        backgroundColor: "orange",
        borderWidth: 1,
        borderColor: 'red',
    },
   logo: {
       width: 90,
       height: 90,
       alignSelf: 'center',
       marginTop: 50,
       marginBottom: 20,
   },
   loginButton: {
    marginTop: 15,
    justifyContent: "center",
},
})

export default LoginScreen;