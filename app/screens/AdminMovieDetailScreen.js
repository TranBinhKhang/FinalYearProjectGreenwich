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

const homenetwork = 'http://192.168.43.218:4000/api/clips';

function AdminMovieDetailScreen({route, navigation}) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user, setUser } = useContext(Auth);

    const [clipData, setClipData] = useState(null);
    const [allClips, setAllClips] = useState(null);
    
    const [file, setFile] = useState(null);
    // const [data, setData] = useState('null');
    const [movieName, setMovieName] = useState(route.params.movieName);
    const [desc, setDesc] = useState(route.params.desc);
    const [image, setImage] = useState(route.params.image);
    const [genre, setGenre] = useState(route.params.genre);
    const movieData = route.params;

    const [spinner, setSpinner] = useState(false); //used to set the loading spinner

    const [updatedMovie, setUpdatedMovie] = useState({
      _id: movieData._id,
      movieName: movieName,
      desc: desc,
      genre: genre,
    });

    const getPermission = async () => {
      if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('We need your permissions to upload video');
          }
        }
  }
  const fetchMovie = {
    _id: movieData._id
  }

    useEffect(() => {

      getPermission();
      axios
        .post("http://192.168.43.218:4000/api/fetchmovieclip", fetchMovie)
        .then(response => {setClipData(response.data)});
      axios
        .get("http://192.168.43.218:4000/api/cliplist")
        .then(response => {setAllClips(response.data)});
    }, []);

    const test = () => {
        console.log(spinner)
    } 




      const updatePicture = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true
        });
    
        if (!result.cancelled) {
          setSpinner(true);
          const uploaddata = {
            file: 'data:image/jpg;base64,' + result.base64,
            upload_preset: "iaixh6ou",
            resource_type: 'image'
          }
          await axios.post('https://api.cloudinary.com/v1_1/daekmobzf/image/upload', uploaddata, {
            resource_type: 'video'
          }).then(res => {console.log(res.data.secure_url);
            // setUpdatedMovie({ _id: movieData._id, movieName: movieName, desc: desc, image: res.data.secure_url, genre: genre}); 
            setImage(res.data.secure_url);
            const imagedata={
              _id: movieData._id,
              image: res.data.secure_url
            }
            axios.post('http://192.168.43.218:4000/api/updatemoviepicture', imagedata);
            setSpinner(false);
        }).catch(err =>{
console.log(err)
});
        }
      };


      const updateMovie = async () => {
        setUpdatedMovie({ _id: movieData._id, movieName: movieName, desc: desc, genre: genre})
        await axios.post('http://192.168.43.218:4000/api/updatemovie', updatedMovie);
        showSuccessAlert();
      };

      const deleteMovie = async () => {
        const deleteTarget = {
            _id: movieData._id
        }
        await axios.post('http://192.168.43.218:4000/api/deletemovie', deleteTarget);
        navigation.push('Admin Movie List');
      };

      const addClip = async (itemValue) => {
        const newClip = {
            movieId: movieData._id,
            clipId: itemValue
        }
        await axios.post('http://192.168.43.218:4000/api/addclip', newClip);
        await axios
        .post("http://192.168.43.218:4000/api/fetchmovieclip", fetchMovie)
        .then(response => {setClipData(response.data)});
      };

      const removeClip = async (item) => {
        
        const removeClip = {
            movieId: movieData._id,
            clipId: item._id
        }
        await axios.post('http://192.168.43.218:4000/api/removeclip', removeClip);
        await axios
        .post("http://192.168.43.218:4000/api/fetchmovieclip", fetchMovie)
        .then(response => {setClipData(response.data)});
      };

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
            <Spinner
            visible={spinner}
            textContent={'Uploading and updating...'}
            textStyle={{
              color: '#FFF'
            }}
            />
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                }}>
            <Image source={{uri: (image ? image : 'https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg')}}
              style={{width: 200, height: 100}} /> 
            </View>
            <View style={styles.container}>

            <TextInput
            defaultValue={movieData.movieName}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Clip name"
            borderWidth={1}
            marginTop={-10}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setMovieName(text); setUpdatedMovie({ _id: movieData._id, movieName: text, desc: desc, genre: genre})}}
            />

            <TextInput
            defaultValue={movieData.desc}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Content"
            multiline
            numberOfLines={3}
            borderWidth={1}
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setDesc(text); setUpdatedMovie({ _id: movieData._id, movieName: movieName, desc: text, genre: genre})}} 
            />

            <TextInput
            defaultValue={movieData.genre}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Content"
            borderWidth={1}
            height={40}
            marginTop={10}
            marginBottom={10}
            borderColor='#7442c8'           
            onChangeText={text => {setGenre(text); setUpdatedMovie({ _id: movieData._id, movieName: movieName, desc: desc, genre: text})}} 
            />



          <View style={styles.infoupdate}>
          <View style={{width: '45%'}}>
          <Button title="Update info" color={'#841584'} onPress={updateMovie} /></View>
          <View style={{width: '45%'}}><Button title="Update picture" color={'#841584'} onPress={updatePicture} /></View>
          </View>
          {/* <Text style={{fontSize: 18}}>Attached clips</Text> */}
          <View style={{height: '30%', borderWidth: 2, borderColor: '#841584', marginTop: '3%'}}>
            {clipData && <FlatList
              data={clipData}
              persistentScrollbar={true}
              keyExtractor={(clip) => clip._id.toString()}
              renderItem={({ item }) => (
              <ListItemSmall
                title={item.clipName}
                // subTitle={item.lessonId}
                onPress={() => navigation.navigate('Admin Clip Detail', item)}
                onPress2={() => {removeClip(item)}}
              />
            )}
            />}
            </View>
            
            {allClips && <Picker
                mode={'dropdown'}
                selectedValue={allClips}
                onValueChange={(itemValue) => {

                  

                  if (clipData.some(clip => clip._id == itemValue._id)) return showAlert(); 
                  
                  else addClip(itemValue);
                } } >
                <Picker.Item label={'Please select a value'} value={null} />
                { allClips.map((item, key)=>(
                <Picker.Item label={item.clipName} value={{_id : item._id, clipName: item.clipName}} key={key} />)
                )}
            </Picker>}
            {/* <Button title="Test" color={'#841584'} onPress={test} /> */}
            <Button title="Delete movie" color={'#841584'} onPress={showConfirmationDialog} />

            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                
            </View>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({

    outercontainer: {
        backgroundColor: 'white',
        // alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    infoupdate: {
      flexDirection: 'row',
      justifyContent: 'space-between'
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

export default AdminMovieDetailScreen;