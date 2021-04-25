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
import { AntDesign, MaterialCommunityIcons, FontAwesome  } from '@expo/vector-icons'; 



function AdminHomeScreen(props) {
    const { user } = useContext(Auth);

    return (

        <SafeAreaView style={styles.flexcontainer}>
        <FontAwesome.Button name='file-movie-o' style={{width: 200}} size={31} onPress={() => props.navigation.navigate('Admin Clip List')} borderRadius={0} backgroundColor={'#841584'} iconStyle={{marginRight: 0}}>
        Clip Management
        </FontAwesome.Button>
        <MaterialCommunityIcons.Button name='movie' style={{width: 200}} size={31} onPress={() => props.navigation.navigate('Admin Movie List')} borderRadius={0} backgroundColor={'#841584'} iconStyle={{marginRight: 0}}>
        Movie Management
        </MaterialCommunityIcons.Button>
        <MaterialCommunityIcons.Button name='book-alphabet' style={{width: 200}} size={31} onPress={() => props.navigation.navigate('Admin Lesson List')} borderRadius={0} backgroundColor={'#841584'} iconStyle={{marginRight: 0}}>
        Lesson Management
        </MaterialCommunityIcons.Button>
        <FontAwesome.Button name='graduation-cap' size={31} style={{width: 200}} onPress={() => props.navigation.navigate('Admin Test List')} borderRadius={0} backgroundColor={'#841584'} iconStyle={{marginRight: 0}}>
        Test Management
        </FontAwesome.Button>
        <AntDesign.Button name='exclamation' size={31} style={{width: 200}} onPress={() => props.navigation.navigate('Admin Report')} borderRadius={0} backgroundColor={'#841584'} iconStyle={{marginRight: 0}}>
        Report Management
        </AntDesign.Button>
        
        
        


        {/* <Button title="Add New Clip" onPress={() => props.navigation.navigate('Admin Add Clip')} /> */}
        {/* <Button title="Add New Movie" onPress={() => props.navigation.navigate('Admin Movie Add')} /> */}
        {/* <Button title="Add New Lesson" onPress={() => props.navigation.navigate('Admin Lesson Add')} /> */}
        {/* <Button title="Admin Test Screen" onPress={() => props.navigation.navigate('Admin Test')} /> */}
        </SafeAreaView>
        

    );
}

const styles = StyleSheet.create({

    flexcontainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignContent: 'center',
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

export default AdminHomeScreen;