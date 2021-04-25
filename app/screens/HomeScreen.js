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



function HomeScreen(props) {
    const { user } = useContext(Auth);
    const [lessonData, setLessonData] = useState();
    const [completedLesson, setCompletedLesson] = useState();

    const fetchCompletedLesson = {
        userId: user._id,
    }

    const fetchData = async () => {
      await console.log('blahblahblah' + completedLesson[0]);
    }

    const compareData = async () => {
        // for (i = 0; i < completedLesson.length; i++) {
        
        //     if (lessonData.some(lesson => lesson._id == completedLesson[i])) return console.log('blahblahblah') 
        
        // }
        console.log('mr. blah')
        
    }

    useEffect(() => {

         axios.get("http://192.168.1.142:4000/api/lesson")
        .then(response => {setLessonData(response.data)});

         axios.post("http://192.168.1.142:4000/api/completedlessonlist", fetchCompletedLesson)
        .then(response => {setCompletedLesson(response.data)});



      }, []);
      const test = async () => {
        console.log(lessonData);
        console.log(completedLesson);
    }

    return (
        <React.Fragment>
        <View style={{
            backgroundColor: 'white'
        }}>
        <Text>Hello, {user.userName}. Have fun studying.</Text>
        </View>
        <SafeAreaView style={styles.flexcontainer}>
            {/* <View style={styles.container}>
            <Text>Hello, {user.userName}. Have fun studying.</Text>
            </View> */}
           
            {/* <Lesson title='Noun' image={require("./background.png")} />
            <Lesson title='Noun' image={require("./background.png")} />
            <Lesson title='Noun' image={require("./background.png")} />
            <Lesson title='Noun' image={require("./background.png")} /> */}

        <FlatList
          data={lessonData}
          numColumns={2}
          columnWrapperStyle={styles.flexcontainer}
          keyExtractor={(lesson) => lesson._id.toString()}
          renderItem={({ item }) => (
            <Lesson
              title={item.name}
              onPress={() => props.navigation.navigate('Lesson', item)}
            />
          )}
        />
        </SafeAreaView>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({

    flexcontainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        flexShrink: 0,
        flexWrap: 'wrap',
        padding: -10,
        marginTop: 10

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

export default HomeScreen;