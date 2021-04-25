import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, FlatList, StyleSheet, TextInput, Platform, View, Alert} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';


import jwtDecode from 'jwt-decode';
import * as SecureStore from "expo-secure-store";
import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';
import * as FileSystem from 'expo-file-system';
import Lesson from '../components/Lesson';
import ListItemSmall from '../components/ListItemSmall';
import { ScrollView } from 'react-native-gesture-handler';

import Spinner from 'react-native-loading-spinner-overlay';



function AccountScreen(props) {
    const { user, setUser } = useContext(Auth);
    const [userInfo, setUserInfo] = useState();
    const [userName, setUserName] = useState(user.userName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);

    const [updateInfo, setUpdatedInfo] = useState({
        _id: user._id,
        userName: userName,
        email: email,
        password: password,
        newpassword: newPassword,
    })

    const userId = {
        _id: user._id,
      }
    
      const fetchInfo = async () => {
        await axios.post("http://192.168.1.142:4000/api/me", userId).then(response => { //this should be done with token, but I'm too lazy for that
        setUserInfo(response.data)
  })
      }

      useEffect(() => {
        fetchInfo()
      }, []);

    const logout = async () => {
        setUser(null);
        await SecureStore.deleteItemAsync('token');
    }

    const handleRemoveMovie = async (item) => {
        const removeMovie = {
            _id: userInfo._id,
            movieId: item._id
        }
        await axios.post("http://192.168.1.142:4000/api/removemovie", removeMovie);
        fetchInfo();
      }

      const handleUpdateUser = async () => {

        await axios.post("http://192.168.1.142:4000/api/updateuser", updateInfo);
        fetchInfo();
      }


    return (
        <SafeAreaView style={styles.outercontainer}>
            <View style={styles.container}>
            {userInfo && <Text style={styles.title}>{userInfo.userName}</Text>}
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>

            {userInfo && <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 5, color: '#841584'}}>Completed Lesson: <Text style={{fontWeight: 'normal'}}>{userInfo.completedLessons.length}</Text></Text>}

            </View>

            {userInfo && <TextInput 
            defaultValue={userInfo.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType='email-address'
            placeholder="Email"
            borderWidth={1}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setEmail(text); setUpdatedInfo({
                _id: user._id,
                userName: userName,
                email: text,
                password: password,
                newpassword: newPassword,
            })}}
            />}

{userInfo && <TextInput
            defaultValue={userInfo.userName}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username"
            borderWidth={1}
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setUserName(text); setUpdatedInfo({
                _id: user._id,
                userName: text,
                email: email,
                password: password,
                newpassword: newPassword,
            })}} 
            />}

{userInfo && <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Current Password"
            borderWidth={1}
            secureTextEntry
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setPassword(text); setUpdatedInfo({
                _id: user._id,
                userName: userName,
                email: email,
                password: text,
                newpassword: newPassword,
            })}} 
            />}

{userInfo && <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="New Password"
            borderWidth={1}
            secureTextEntry
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setNewPassword(text); setUpdatedInfo({
                _id: user._id,
                userName: userName,
                email: email,
                password: password,
                newpassword: text,
            })}} 
            />}

            <View style={{marginTop: 10}}><Button color={'#841584'} title={'Update user'} onPress={handleUpdateUser} /></View>

<View style={{height: '30%', borderWidth: 2, borderColor: '#841584', marginTop: '3%'}}>
<View style={{borderWidth: 0.5, borderColor: '#841584'}}>
            <Text style={{textAlign: 'center', color: '#841584', fontWeight: 'bold'}}>Watched movies:</Text></View>
            {userInfo && <FlatList
              data={userInfo.watchedMovie}
              persistentScrollbar={true}
              keyExtractor={(clip) => userInfo.watchedMovie.indexOf(clip).toString()}
              renderItem={({ item }) => (
              <ListItemSmall
                title={item.movieName}
                onPress={() => console.log('abc')}
                onPress2={() => handleRemoveMovie(item)}
              />
            )}
            />}
            </View>

            </View>

            

            <Button color={'#841584'} title="log out" onPress={logout} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    outercontainer: {
        backgroundColor: 'white',
        flex: 1,
    },

    container: {
        backgroundColor: 'white',
        marginTop: -10,
        flex: 1,
        flexDirection: 'column',
        padding: 20
    },
    title: {
        fontSize: 18,
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

export default AccountScreen;