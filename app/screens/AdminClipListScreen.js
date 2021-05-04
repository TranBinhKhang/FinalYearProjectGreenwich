import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, StyleSheet, FlatList, TextInput, Platform, View} from 'react-native';
import jwtDecode from 'jwt-decode';
import * as SecureStore from "expo-secure-store";
import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';
import Lesson from '../components/Lesson';
import ListItem from '../components/ListItem';

import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';



function AdminClipListScreen(props) {
    const { user } = useContext(Auth);
    const [clipData, setClipData] = useState();
    useEffect(() => {
        axios
          .get("http://192.168.43.218:4000/api/cliplist")
          .then(response => {setClipData(response.data); console.log(response.data); console.log(response.data[5].lessonId.name)});
      }, []);
    return (

        <SafeAreaView style={styles.flexcontainer}>
        <FlatList
          data={clipData}
          keyExtractor={(clip) => clip._id.toString()}
          renderItem={({ item }) => (
            <ListItem
            title={item.clipName}
            subTitle={item.lessonId.name}
            onPress={() => props.navigation.navigate('Admin Clip Detail', item)}
          />
          )}
        />
        <View style={{width: '98%', justifyContent: 'flex-end', alignSelf: 'center', position: 'absolute', bottom: 0}}>
            <View style={{backgroundColor: '#841584', height: 50, width: 50, borderRadius: 50, 
            alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center',  marginBottom: 10}}>
                <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Admin Add Clip')}>
                <Text style={{fontSize: 30, color: 'white'}}>{'+'}</Text></TouchableWithoutFeedback>
            </View>
        </View>
       
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({

    flexcontainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        padding: -10

    },

    container: {
        // paddingTop: Platform.OS === 'android' ? 25 : 0,
        backgroundColor: 'white',
        marginTop: -10,
        flex: 1,
        flexDirection: 'row',
        // flex: 0.6,
        // flexDirection: 'column',
        
        padding: 20
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

export default AdminClipListScreen;