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

function AdminLessonDetailScreen({route, navigation}) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user, setUser } = useContext(Auth);
    const [lessonData, setLessonData] = useState(null);
    const [emptylesson, setEmptyLesson] = useState(null);
    const [file, setFile] = useState(null);
    // const [data, setData] = useState('null');
    // const [lessonId, setLessonId] = useState(route.params._id);
    const [name, setName] = useState(route.params.name);
    const [content, setContent] = useState(route.params.content);
    const [image, setImage] = useState(null);
    const [lesson, setLesson] = useState(null);
    const LessonData = route.params;

    const [spinner, setSpinner] = useState(false); //used to set the loading spinner

    const [updatedLesson, setUpdatedLesson] = useState({
      _id: LessonData._id,
      name: name,
      content: content,
    });


  const fetchLesson = {
    _id: LessonData._id
  }

    useEffect(() => {
      axios
        .post("http://192.168.1.142:4000/api/fetchlessonclip", fetchLesson)
        .then(response => {setLessonData(response.data)});
      axios
        .get("http://192.168.1.142:4000/api/nolessonlist")
        .then(response => {setEmptyLesson(response.data)});
    }, []);


    // const [newMovie, setNewMovie] = useState({
    //   _id: route.params._id,
    //   name: name,
    //   content: content,
    //   image: image,
    //   clips: null
    // });


    


    


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
            // setUpdatedLesson({ _id: movieData._id, name: name, content: content, image: res.data.secure_url}); 
            setImage(res.data.secure_url);
            const imagedata={
              _id: LessonData._id,
              image: res.data.secure_url
            }
            axios.post('http://192.168.1.142:4000/api/updatemoviepicture', imagedata);
            setSpinner(false);
        }).catch(err =>{
console.log(err)
});
        }
      };


      const updateLesson = async () => {
        setUpdatedLesson({ _id: LessonData._id, name: name, content: content})
        await axios.post('http://192.168.1.142:4000/api/updatelesson', updatedLesson);
        showSuccessAlert();
      };

      const deleteLesson = async () => {
        const deleteTarget = {
            _id: LessonData._id
        }
        await axios.post('http://192.168.1.142:4000/api/deletelesson', deleteTarget);
        navigation.push('Admin Lesson List');
      };

      const addLesson = async (itemValue) => {
        const newLesson = {
            _id: itemValue, //_id is the id of the clip we need to associate with this lesson
            lessonId: LessonData._id //this is the id of the current lesson.
        }
        await axios.post('http://192.168.1.142:4000/api/addcliplesson', newLesson);
        await axios
        .post("http://192.168.1.142:4000/api/fetchlessonclip", fetchLesson)
        .then(response => {setLessonData(response.data)});
      };

      const removeLesson = async (item) => {
        
        const removeLesson = {
            _id: item._id //this is the id of the clip that will have the reference to this lesson removed in the database
        }
        await axios.post('http://192.168.1.142:4000/api/removecliplesson', removeLesson);
        await axios
        .post("http://192.168.1.142:4000/api/fetchlessonclip", fetchLesson)
        .then(response => {setLessonData(response.data)});
      };

      const showSuccessAlert = () =>
        Alert.alert(
          "Note",
          "This lesson has been successfully updated",
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
            textContent={'Uploading and updating...'}
            textStyle={{
              color: '#FFF'
            }}
            />
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                }}>
            </View>
            <View style={styles.container}>

            <TextInput
            defaultValue={LessonData.name}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Clip name"
            borderWidth={1}
            marginTop={10}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setName(text); setUpdatedLesson({ _id: LessonData._id, name: text, content: content})}}
            />

            <TextInput
            defaultValue={LessonData.content}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Content"
            multiline
            numberOfLines={3}
            borderWidth={1}
            height={90}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setContent(text); setUpdatedLesson({ _id: LessonData._id, name: name, content: text})}} 
            />


          <View style={styles.infoupdate}>
          <View style={{width: '100%'}}>
          <Button title="Update info" color={'#841584'} onPress={updateLesson} /></View>
          </View>
          {/* <Text style={{fontSize: 18}}>Attached clips</Text> */}
          <View style={{ height: '30%', borderWidth: 1, marginTop: '3%' }}>
            {lessonData && <FlatList
              data={lessonData}
              persistentScrollbar={true}
              keyExtractor={(clip) => clip._id.toString()}
              renderItem={({ item }) => (
              <ListItemSmall
                title={item.clipName}
                // subTitle={item.lessonId}
                onPress={() => navigation.navigate('Admin Clip Detail', item)}
                onPress2={() => {removeLesson(item)}}
              />
            )}
            />}
            </View>
            
            {emptylesson && <Picker
                mode={'dropdown'}
                selectedValue={emptylesson}
                onValueChange={(itemValue) => {setLesson(itemValue); addLesson(itemValue)} } >
                <Picker.Item label={'Please select a value'} value={null} />
                { emptylesson.map((item, key)=>(
                <Picker.Item label={item.clipName} value={{_id : item._id, clipName: item.clipName}} key={key} />)
                )}
            </Picker>}
            {/* <Button color={'#841584'} title="Test" onPress={test} /> */}
            {/* <Button title="Test Management" onPress={navigation.navigate('Admin Lesson Test', item)} /> */}
            <Button color={'#841584'} title="Delete movie" onPress={deleteLesson} />

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
      justifyContent: 'space-between',
      marginTop: 5
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

export default AdminLessonDetailScreen;