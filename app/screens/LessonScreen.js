import React, {useContext, useEffect, useState, } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, FlatList, StyleSheet, TouchableWithoutFeedback, TextInput, Platform, View} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';



import jwtDecode from 'jwt-decode';
import * as SecureStore from "expo-secure-store";
import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';
import * as FileSystem from 'expo-file-system';


const homenetwork = 'http://192.168.1.142:4000/api/clips';

function LessonScreen({route, navigation}) {
    const { user, setUser } = useContext(Auth);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [clipData, setClipData] = useState();
    const lessoninfo = route.params;
    const [isEmpty, setIsEmpty] = useState(false);
    const [index, setIndex] = useState(0);
    const [clipNumber, setClipNumber] = useState(0);

    const fetchMovie = {
                userId: user._id,
                lessonId: lessoninfo._id
            }
    useEffect(() => {
        const fetchMovie = {
            userId: user._id,
            lessonId: lessoninfo._id
        }
        axios
          .post("http://192.168.1.142:4000/api/clips", fetchMovie)
          .then(response => {setClipData(response.data); 
            setClipNumber(response.data.length); 
            console.log(response.data)
        })
      }, []);


    
      

    return (
        <SafeAreaView style={styles.outercontainer}>
            <View style={styles.container}>
            {/* <Text>{lessoninfo._id}</Text>
            <Text>{user._id}</Text> */}
            
            <Text>{lessoninfo.content}</Text>
            </View>
            <View style={styles.VideoSection}>
                
            <View style={{flex: 0.7, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>  
            <Button onPress={() => {setIndex(index - 1)}} disabled={index == 0} color={'#841584'} title={'◄'} /></View>   
            
            <View style={{flex: 5}}>
            {clipData && <Video
                ref={video}
                style={styles.video}
                source={{
                uri: clipData[index].data,
		          overrideFileExtensionAndroid: 'true',
                }}
                useNativeControls
                resizeMode="cover"
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />}
            </View>
            
            <View style={{flex: 0.7, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>  
            <Button onPress={() => {setIndex(index + 1)}} disabled={index == clipNumber - 1} color={'#841584'} title={'►'} />
            </View>
            </View>
            <View style={{padding: 10, alignItems: 'center', alignContent: 'center', justifyContent: 'center'}}>
            {clipData && <Text style={{fontWeight: 'bold'}}>{clipData[index].clipName}</Text>}
            {clipData && <Text>{clipData[index].content}</Text>}</View>
            
            <View style={styles.buttons}>
            <View style={{width: '50%'}}>
            <Button color={'#841584'} title='Comment/Feedback' onPress={() => navigation.navigate('Comment', lessoninfo)} />
            </View>
            <View style={{width: '50%'}}>
            <Button color={'#841584'} title='Go to test' onPress={() => navigation.navigate('Test', lessoninfo)} />
            </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    outercontainer: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    buttons: {
        flexDirection: 'row', 
        alignContent: 'space-between', 
        alignItems: 'center', 
        justifyContent: 'space-around'
    },
    VideoSection: {
        flex: 1, 
        flexDirection: 'row', 
        alignContent: 'space-between', 
        alignItems: 'center', 
        justifyContent: 'space-around'
    },
    video: {
        width: 280,
        height: 200,
      },

    container: {
        // paddingTop: Platform.OS === 'android' ? 25 : 0,
        backgroundColor: 'white',
        marginTop: 10,
        flex: 1,
        flexDirection: 'row',
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

export default LessonScreen;