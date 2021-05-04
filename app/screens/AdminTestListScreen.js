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
import {Picker} from '@react-native-picker/picker';



function AdminTestListScreen(props) {
    const { user } = useContext(Auth);
    const [testData, setTestData] = useState(null);
    useEffect(() => {
        fetchLesson(); //this is still using a separate function because it's copied from Clip list screen, which still use my old style of programming
      }, []);

    const fetchLesson = async () => {
        axios
          .get("http://192.168.43.218:4000/api/lesson")
          .then(response => {setTestData(response.data);});
    }
    
    
    return (
        <>
        <SafeAreaView style={styles.flexcontainer}>
        <FlatList
          data={testData}
          keyExtractor={(lesson) => lesson._id.toString()}
          renderItem={({ item }) => (
            <ListItem
            title={item.name + ' test'}
            onPress={() => props.navigation.navigate('Admin Test Detail', item)}
          />
          )}
        />
        {/* <TextInput
            defaultValue={genre}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Clip name"
            borderWidth={1}
            height={40}
            borderColor='#841584'
            onChangeText={text => setGenre(text)}
            /> */}

        
        </SafeAreaView>
        </>
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

export default AdminTestListScreen;