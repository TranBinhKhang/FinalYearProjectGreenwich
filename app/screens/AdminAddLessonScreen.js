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

function AdminAddLessonScreen({route, navigation}) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user, setUser } = useContext(Auth);

    const [spinner, setSpinner] = useState(false); //used to set the loading spinner

    const [emptyLesson, setEmptyLesson] = useState(null);
    const [file, setFile] = useState(null);
    // const [data, setData] = useState('null');
    const [name, setName] = useState(null);
    const [content, setContent] = useState(null);
    const [image, setImage] = useState(null);
    const [lesson, setLesson] = useState(null);

    const [cliparray, setClipArray] = useState([]);

    const [clipId, setClipId] = useState(null); //This is used to send an array of clip id to backend.

    const [refresh, setRefresh] = useState(true);

    const [newLesson, setNewLesson] = useState({
      name: name,
      content: content,
      cliparray: cliparray
    });

  // const fetchMovie = {
  //   _id: movieData._id
  // }

    useEffect(() => {
      // axios
      //   .post("http://192.168.1.142:4000/api/fetchmovieclip", fetchMovie)
      //   .then(response => {setClipData(response.data)});
      axios
      .get("http://192.168.1.142:4000/api/nolessonlist")
      .then(response => {setEmptyLesson(response.data)});
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
        console.log(newLesson);
        



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
            setNewLesson({ name: name,
              content: content,
              cliparray: cliparray})

            setSpinner(false);
});
        }
      };


      const uploadLesson = async () => {

        var merged = []; // merge all the clips arrays in cliparray into one array
        for (var i = 0; i < cliparray.length; i++) {
            merged = merged.concat(cliparray[i]._id);
        }
        var duplicate = [merged[0]]; //remove all the duplicate because concat somehow causes duplicates
        for (var i=1; i< merged.length; i++) {
           if (merged[i]!=merged[i-1]) duplicate.push(merged[i]);
        }



        setNewLesson({ name: name, content: content, cliparray: duplicate});
        console.log(duplicate);

        await axios.post('http://192.168.1.142:4000/api/uploadlesson', newLesson);
        showSuccessAlert();
      };

      // const deleteMovie = async () => {
      //   const deleteTarget = {
      //       _id: movieData._id
      //   }
      //   await axios.post('http://192.168.1.142:4000/api/deletemovie', deleteTarget);
      //   navigation.push('Admin Movie List');
      // };

      const addClip = async () => {
        const newClip = {

            clipId: clips
        }
        await axios.post('http://192.168.1.142:4000/api/addclip', newClip);
        await axios
        .post("http://192.168.1.142:4000/api/fetchmovieclip", fetchMovie)
        .then(response => {setClipData(response.data)});
      };

      const removeClip = async (item) => {
        
        const removeClip = {

            clipId: item._id
        }
        await axios.post('http://192.168.1.142:4000/api/removeclip', removeClip);
        await axios
        .post("http://192.168.1.142:4000/api/fetchmovieclip", fetchMovie)
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
        "This lesson has been successfully added",
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
            placeholder="Lesson name"
            borderWidth={1}
            marginTop={-10}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setName(text); setNewLesson({ name: text, content: content, cliparray: cliparray})}}
            />

            <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Lesson content"
            multiline
            numberOfLines={3}
            borderWidth={1}
            height={80}
            marginTop={10}
            marginBottom={10}
            borderColor='#7442c8'           
            onChangeText={text => {setContent(text); setNewLesson({ name: name, content: text, cliparray: cliparray})}} 
            />



          
          {/* <Button color={'#841584'} title="Upload picture" onPress={uploadPicture} />
  */}
          {/* <Text style={{fontSize: 18}}>Attached clips</Text> */}
          <View style={{ height: '40%', borderWidth: 2, borderColor: '#841584', marginTop: '3%' }}>
            <FlatList
              data={cliparray}
              extraData={refresh}
              persistentScrollbar={true}
              keyExtractor={(clip) => clip._id.toString()}
              renderItem={({ item }) => (
              <ListItemSmall
                title={item.clipName}
                // subTitle={item.lessonId}
                onPress={() => navigation.navigate('Admin Clip Detail', item)}
                onPress2={() => { for (let i = 0; i < cliparray.length; i++) {
                              if (cliparray[i]._id == item._id) {
                                cliparray.splice(i, 1);
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
            
            {emptyLesson && <Picker
                mode={'dropdown'}
                selectedValue={emptyLesson}
                onValueChange={(itemValue) => {
                  if (cliparray.some(clip => clip._id == itemValue._id)) return showAlert(); 
                  
                  else cliparray.push(itemValue);
                   
                  setRefresh(false); 
                 
                  setTimeout(function() {
                  setRefresh(true)
                  }, 2000);} 
              
              
              
              } >
                <Picker.Item label={'Please select a value'} value={null} />
                { emptyLesson.map((item, key)=>(
                <Picker.Item label={item.clipName} value={{_id : item._id, clipName: item.clipName}} key={key} />)
                )}
            </Picker>}
          <Button color={'#841584'} title="Upload Lesson" onPress={uploadLesson} />
            {/* <Button color={'#841584'} title="Test" onPress={test} /> */}

            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                
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

export default AdminAddLessonScreen;