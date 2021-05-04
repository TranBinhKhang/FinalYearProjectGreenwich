import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, FlatList, StyleSheet, TextInput, Platform, View} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';



import jwtDecode from 'jwt-decode';
import * as SecureStore from "expo-secure-store";
import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';
import * as FileSystem from 'expo-file-system';


const homenetwork = 'http://192.168.43.218:4000/api/clips';

function CongratScreen({route, navigation}) {
    const { user, setUser } = useContext(Auth);
    const [clipData, setClipData] = useState();
    const lessoninfo = route.params;
    const [isAlreadyDone, setIsAlreadyDone] = useState(false);


    const completeLesson = {
                userId: lessoninfo.userId,
                lessonId: lessoninfo.lessonId
            }


    const checkIsAlreadyCompleted = async () => {
        await axios
          .post("http://192.168.43.218:4000/api/completelesson", completeLesson)
          .then(response => {
              if (response.data) {setIsAlreadyDone(true); console.log('already completed')}
              else {setIsAlreadyDone(false); console.log(response)}
          })
    }

    useEffect(() => {
        checkIsAlreadyCompleted(); //If user has already completed the lesson, it will display a different message
      }, []);

      const test = () => {
          console.log(completeLesson);
      }
    
      

    return (
        <SafeAreaView style={styles.outercontainer}>
            <View style={styles.container}>
            <AntDesign style={{bottom: 30}} name="checkcircle" size={80} color="#841584" />
            {isAlreadyDone && <Text style={{textAlign: 'center', fontWeight: 'bold', bottom: 20}}>You have already completed {lessoninfo.name}, but good job anyway!</Text>}
            {!isAlreadyDone && <Text style={{textAlign: 'center', fontWeight: 'bold', bottom: 20}}>You have completed {lessoninfo.name}. Good work!</Text>}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    outercontainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        flex: 1,
        
    },

    video: {

        width: 320,
        height: 200,
      },

    container: {
        // paddingTop: Platform.OS === 'android' ? 25 : 0,
        backgroundColor: 'white',
        marginTop: 10,
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 0.6,
        // flexDirection: 'column',
        // justifyContent: 'space-between',
        padding: 25
    },
    title: {
        fontSize: 25,
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

export default CongratScreen;