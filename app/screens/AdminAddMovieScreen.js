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

function AdminAddMovieScreen({route, navigation}) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user, setUser } = useContext(Auth);
    const [clipData, setClipData] = useState(null);

    const [spinner, setSpinner] = useState(false); //used to set the loading spinner

    const [allClips, setAllClips] = useState(null);
    const [file, setFile] = useState(null);
    // const [data, setData] = useState('null');
    const [movieName, setMovieName] = useState(null);
    const [desc, setDesc] = useState(null);
    const [clips, setClips] = useState([]); //Unlike in AdminMovieDetailScreen, this array will be sent directly to the database
    const [image, setImage] = useState(null);
    const [genre, setGenre] = useState(null);

    const [refresh, setRefresh] = useState(true);

    const [newMovie, setNewMovie] = useState({
      movieName: movieName,
      desc: desc,
      genre: genre,
      clips: clips,
      image: image
    });

    const getPermission = async () => {
      if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('We need your permissions to upload video');
          }
        }
  }
  // const fetchMovie = {
  //   _id: movieData._id
  // }

    useEffect(() => {

      getPermission();
      // axios
      //   .post("http://192.168.43.218:4000/api/fetchmovieclip", fetchMovie)
      //   .then(response => {setClipData(response.data)});
      axios
        .get("http://192.168.43.218:4000/api/cliplist")
        .then(response => {setAllClips(response.data)});
    }, []);


    // const [newMovie, setNewMovie] = useState({
    //   _id: route.params._id,
    //   movieName: movieName,
    //   desc: desc,
    //   image: image,
    //   clips: null
    // });


    


    


    const test = () => {
        // console.log(clips._id);
        console.log(newMovie);



    } 




      const uploadPicture = async () => {
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
            resource_type: 'image'
          }).then(res => {console.log(res.data.secure_url);
            setImage(res.data.secure_url);
            setNewMovie({ movieName: movieName, desc: desc, genre: genre, image: res.data.secure_url, clips: clips})

            setSpinner(false);
});
        }
      };


      const uploadMovie = async () => {

        var merged = []; // merge all the clips arrays in watchedMovie into one arrays
        for (var i = 0; i < clips.length; i++) {
            merged = merged.concat(clips[i]._id);
        }
        var duplicate = [merged[0]]; //remove all the duplicate because concat somehow causes duplicates
        for (var i=1; i< merged.length; i++) {
           if (merged[i]!=merged[i-1]) duplicate.push(merged[i]);
        }



        setNewMovie({ movieName: movieName, desc: desc, genre: genre, image: image, clips: duplicate});

        await axios.post('http://192.168.43.218:4000/api/uploadmovie', newMovie);
        showSuccessAlert();
      };

      // const deleteMovie = async () => {
      //   const deleteTarget = {
      //       _id: movieData._id
      //   }
      //   await axios.post('http://192.168.43.218:4000/api/deletemovie', deleteTarget);
      //   navigation.push('Admin Movie List');
      // };



      
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
          "This movie has been successfully added",
        [
        {
          text: "Ok",
          style: "cancel",
        },
        ],
      );
      

    return (
      
        <SafeAreaView style={styles.outercontainer}>
            <Spinner
            visible={spinner}
            textContent={'Uploading picture. This might take a while...'}
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
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Clip name"
            borderWidth={1}
            marginTop={-10}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setMovieName(text); setNewMovie({ movieName: text, desc: desc, genre: genre, image: image, clips: clips})}}
            />

            <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="desciption"
            multiline
            numberOfLines={3}
            borderWidth={1}
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setDesc(text); setNewMovie({ movieName: movieName, desc: text, genre: genre, image: image, clips: clips})}} 
            />

            <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Genre"
            borderWidth={1}
            height={40}
            marginTop={10}
            marginBottom={10}
            borderColor='#7442c8'           
            onChangeText={text => {setGenre(text); setNewMovie({ movieName: movieName, desc: desc, genre: text, image: image, clips: clips})}} 
            />




          
          <Button color={'#841584'} title="Upload picture" onPress={uploadPicture} />
 
          {/* <Text style={{fontSize: 18}}>Attached clips</Text> */}
          <View style={{ height: '35%', borderWidth: 2, borderColor: '#841584', marginTop: '3%' }}>
            <FlatList
              data={clips}
              extraData={refresh}
              persistentScrollbar={true}
              keyExtractor={(clip) => clip._id.toString()}
              renderItem={({ item }) => (
              <ListItemSmall
                title={item.clipName}
                // subTitle={item.lessonId}
                onPress={() => navigation.navigate('Admin Clip Detail', item)}
                onPress2={() => { for (let i = 0; i < clips.length; i++) {
                              if (clips[i]._id == item._id) {
                                clips.splice(i, 1);
                              }}
                              
                              setRefresh(false);
                              setTimeout(function() {
                                setRefresh(true)
                                }, 1000)
                              
                              }}
              />
            )}
            />
            </View>
            
            {allClips && <Picker
                mode={'dropdown'}
                selectedValue={allClips}
                onValueChange={(itemValue) => {
                  if (clips.some(clip => clip._id == itemValue._id)) return showAlert(); 
                  
                  else clips.push(itemValue);
                   
                  setRefresh(false); 
                 
                  setTimeout(function() {
                  setRefresh(true)
                  }, 2000);} 
              
              
              
              } >
                <Picker.Item label={'Please select a value'} value={null} />
                { allClips.map((item, key)=>(
                <Picker.Item label={item.clipName} value={{_id : item._id, clipName: item.clipName}} key={key} />)
                )}
            </Picker>}
          <Button color={'#841584'} title="Upload movie" onPress={uploadMovie} />
            {/* <Button color={'#841584'} title="Test" onPress={test} /> */}

            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                
                {/* <Button title="Delete Clip" onPress={addClip} /> */}
                {/* <Button title="Pick an image from camera roll to update" onPress={pickImage} />
                <Button title="Update video" onPress={uploadMovie} />
                <Button title="Delete video" onPress={deleteMovie} />
                <Button title="Test" onPress={test} /> */}
            </View>


            {/* <FlatList
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                legacyImplementation={false}
                data={lessonData}
                
                columnWrapperStyle={styles.flexcontainer}
                keyExtractor={(lesson) => lesson._id.toString()}
                style={{width: '100%', height:'50%'}}
                renderItem={({ item }) => (
                  <Lesson
                    title={item.name}
                    onPress={() => console.log(item)}
                  />
                )}
            /> */}

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

export default AdminAddMovieScreen;