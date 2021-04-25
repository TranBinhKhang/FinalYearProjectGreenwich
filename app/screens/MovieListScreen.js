import React, {useContext, useEffect} from 'react';
import useState from 'react-usestateref'; //This is beautiful. This is magic. Thank you Aminadav Glickshtein
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
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import MovieItem from '../components/MovieItem';



function MovieListScreen(props) {
    const { user } = useContext(Auth);
    const [movieData, setMovieData, movieDataRef] = useState(null); //I use a special version of useState from a library
    const [genre, setGenre, genreRef] = useState(null);//It accepts 3 argument. The third item on the array will always return the latest state 
    const [genreList, SetGenreList] = useState([]);
    useEffect(() => {
        fetchMovie();
      }, []);

    const fetchMovie = async () => {
        axios
          .get("http://192.168.1.142:4000/api/movielist")
          .then(response => {
              setMovieData(response.data);

              let middleArray = [];
              for (i = 0; i < response.data.length; i++) {
                middleArray.push(response.data[i].genre);
              }

              var duplicate = [middleArray[0]]; //remove all the duplicate
              for (var i=1; i< middleArray.length; i++) {
               if (middleArray[i]!=middleArray[i-1]) duplicate.push(middleArray[i]);
            }

              SetGenreList(duplicate);
            });
    }
    
    const test =  () => {
        console.log(genreList);

    }
    const filter = async (itemValue) => {

        if (genreRef.current === 'ignore dis') return console.log('returned'); //genreRef.current will return the latest state of Genre

        if (genreRef.current === 'reset') {
            return axios
            .get("http://192.168.1.142:4000/api/movielist")
            .then(response => {setMovieData(response.data);});
        }

        const filtergenre = {
            genre: genreRef.current
        }
        await axios.post("http://192.168.1.142:4000/api/moviefilter", filtergenre)
        .then(response => setMovieData(response.data));
    }
    
    return (
        <>
        <Picker
            selectedValue={genre}
            onValueChange={(itemValue, itemIndex) => {
                setGenre(itemValue); 
                filter(itemValue);
                }} >
            <Picker.Item value='ignore dis' label='Filter movie by genre' />
            {genreList && genreList.map((item, key)=>(
                <Picker.Item label={item} value={item} key={key} />)
                )}
            <Picker.Item value='reset' label='Remove filter' />
        </Picker>
        <SafeAreaView style={styles.flexcontainer}>
        <FlatList
          data={movieDataRef.current}
          keyExtractor={(movie) => movie._id.toString()}
          renderItem={({ item }) => (
            <MovieItem
            title={item.movieName}
            image={item.image}
            subTitle={item.genre}
            onPress={() => props.navigation.navigate('Movie Detail', item)}
          />
          )}
        />
        {/* <View style={{width: '98%', justifyContent: 'flex-end', alignSelf: 'center', position: 'absolute', bottom: 0}}>
            <View style={{backgroundColor: '#841584', height: 50, width: 50, borderRadius: 50, 
            alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center',  marginBottom: 10}}>
                <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Admin Movie Add')}>
                <Text style={{fontSize: 30, color: 'white'}}>{'+'}</Text></TouchableWithoutFeedback>
            </View>
        </View> */}
        
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

export default MovieListScreen;