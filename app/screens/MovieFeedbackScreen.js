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

const homenetwork = 'http://192.168.1.142:4000/api/clips';

function MovieDetailScreen({route, navigation}) {
    const { user, setUser } = useContext(Auth);

    const [movieLesson, setMovieLesson] = useState(null);
    const [movieAdded, setMovieAdded] = useState(false);
    
    const movieData = route.params;


  const fetchMovieLesson = {
    _id: movieData._id
  }

  const movieToAdd = {
    _id: user._id,
    movieId: movieData._id
  }

  checkIsAdded = async () => {
    axios.post("http://192.168.1.142:4000/api/getusermovie", movieToAdd).then(response => { //this should be done with token, but I'm too lazy for that
          if (response.data.some(movie => movie == movieData._id)) setMovieAdded(true);
          else if (response.data.some(movie => movie !== movieData._id)) setMovieAdded(false);
    })
  }

    useEffect(() => {
      checkIsAdded()
       axios
          .post("http://192.168.1.142:4000/api/fetchmovielesson", fetchMovieLesson)
          .then(response => {setMovieLesson(response.data)});

       
        
    }, []);

    const handleAddMovie = async () => {
      
      await axios.post("http://192.168.1.142:4000/api/addmovie", movieToAdd);

      checkIsAdded()
    }

    const handleRemoveMovie = async () => {
      
      await axios.post("http://192.168.1.142:4000/api/removemovie", movieToAdd);

      checkIsAdded()
    }



      const showAlert = () =>
        Alert.alert(
          "Error",
          "This clip has already been added",
        [
        {
          text: "Ok",
          style: "cancel",
        },
        ],
      );
      
      const showSuccessAlert = () =>
        Alert.alert(
          "Note",
          "This clip has been successfully updated",
        [
        {
          text: "Ok",
          style: "cancel",
        },
        ],
      );

      const showConfirmationDialog = () =>
      Alert.alert(
        "Alert",
        "Are you sure you want to delete this clip? This action cannot be undone.",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => deleteMovie() }
        ]
      );

      

    return (
      
        <SafeAreaView style={styles.outercontainer}>
            <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
            <Image source={{uri: (movieData.image ? movieData.image : 'https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg')}}
              style={{width: 140, height: 140}} /> 
            </View>
            <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                  padding: 10
                }}>
            <Text style={styles.title}>{movieData.movieName}</Text>
            <Text style={{textAlign: 'center'}}>{movieData.desc}</Text>
            
            
            

            </View>

            <View style={{height: '30%', width: '80%', position: 'absolute', bottom: 70, borderWidth: 2, borderColor: '#841584', justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
            <View style={{borderWidth: 1.5, borderColor: '#841584'}}>
            <Text style={{textAlign: 'center'}}>This movie contains examples of the following lessons:</Text></View>
            {movieLesson && <FlatList
              data={movieLesson}
              persistentScrollbar={true}
              keyExtractor={(clip) => movieLesson.indexOf(clip).toString()}
              renderItem={({ item }) => (
              <ListItemSmall
                title={item}
                // subTitle={item.lessonId}
                onPress={() => console.log('futile')}
              />
            )}
            />}</View>
          <View style={{ marginTop: 10, position: 'absolute', bottom: 0, marginBottom: 10, width: '60%', alignSelf: 'center'}}>
          <Button color={'#841584'} title={movieAdded ? 'Remove this movie from your watched list' : 'Add this movie to your watched list'} onPress={() => movieAdded ? handleRemoveMovie() : handleAddMovie()} />
          </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({

    outercontainer: {
        backgroundColor: 'white',
        // alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection:'column',
        flex: 1,
    },

    infoupdate: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    lessonlist: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'space-around'
    },

    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
      },

      container: {
        marginTop: -20,
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

export default MovieDetailScreen;