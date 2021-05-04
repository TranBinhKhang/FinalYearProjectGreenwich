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
import Spinner from 'react-native-loading-spinner-overlay';


const homenetwork = 'http://192.168.43.218:4000/api/clips';

function AdminClipDetailScreen({route, navigation}) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user, setUser } = useContext(Auth);
    const [lessonData, setLessonData] = useState(null);
    const [file, setFile] = useState(null);
    // const [data, setData] = useState('null');
    const [clipName, setClipName] = useState(route.params.clipName);
    const [content, setContent] = useState(route.params.content);
    const [lessonId, setLessonId] = useState(route.params.lessonId);
    const [itemIndex, setItemIndex] = useState('0')
    const clipData = route.params;
    const [clipCurrentLesson, setClipCurrentLesson] = useState([]); //get the current lesson of the clip in the database
    const [lessonChanged, setLessonChanged] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [newClip, setNewClip] = useState({
      _id: route.params._id,
      clipName: clipName,
      content: content,
      data: route.params.data,
      lessonId: lessonId
    });

    


    
    const getPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('We need your permissions to upload video');
            }
          }
    }

    const test =  async () => {
        // console.log(clipData);
        // await setNewClip({ _id: clipData._id, clipName: clipName, content: content, lessonId: lessonId});
        console.log(clipData._id);
        
      // console.log(lessonId);
      // console.log(clipName);
      // console.log(content);
      // setNewClip({data: data, clipName: clipName, content: content, lessonId: lessonId})
      // console.log(newClip);
  }

  

    useEffect(() => {
        getPermission();
        axios
          .get("http://192.168.43.218:4000/api/lesson")
          .then(response => {setLessonData(response.data)});
      const clipInfo = {
        _id: clipData._id
      }
          axios
          .post("http://192.168.43.218:4000/api/clipcurrentlesson", clipInfo)
          .then(response => {setClipCurrentLesson(response.data)});
        
      }, []);

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true
        });
    
        console.log(result);

        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
        console.log(base64);
    
        if (!result.cancelled) {
          setSpinner(true);
          setFile(base64);
          setSpinner(true);
          let uploaddata = {
            file: 'data:video/mp4;base64,' + base64,
            upload_preset: "iaixh6ou",
            resource_type: 'video'
          }
          await axios.post('https://api.cloudinary.com/v1_1/daekmobzf/video/upload', uploaddata, {
            resource_type: 'video'
          })
          .then(res => {console.log(res.data.secure_url);
                        setNewClip({ _id: clipData._id, data: res.data.secure_url, clipName: clipName, content: content, lessonId: lessonId});
                      setSpinner(false)})
          .catch(err =>{
            console.log(err)
        });
        }
      };

      const uploadVideo = async () => {
        try {
        setNewClip({ _id: clipData._id, clipName: clipName, content: content, lessonId: lessonId})
        await axios.post('http://192.168.43.218:4000/api/updateclip', newClip);
        showSuccessAlert()
      }catch {console.log('ERROR')}
        
      };

      const deleteVideo = async () => {
        const deleteTarget = {
            _id: route.params._id
        }
        await axios.post('http://192.168.43.218:4000/api/deleteclip', deleteTarget);
        navigation.push('Admin Clip List');
      };

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
          { text: "Yes", onPress: () => deleteVideo() }
        ]
      );

    return (
        <SafeAreaView style={styles.outercontainer}>
        <Spinner
            visible={spinner}
            textContent={'Uploading. This will take a while...'}
            textStyle={{
              color: '#FFF'
            }}
            />
            <Video
                ref={video}
                style={styles.video}
                source={{
                uri: (newClip.data !== 'data' && newClip.data) ? newClip.data : 'https://res.cloudinary.com/daekmobzf/video/upload/v1618218015/yt1s.com_-_video_placeholder_v144P_sgs82l.mp4',
		          overrideFileExtensionAndroid: 'true',
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.buttoncontainer}>
            <TextInput
            defaultValue={clipData.clipName}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Clip name"
            borderWidth={1}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setClipName(text); setNewClip({ _id: clipData._id, clipName: text, content: content, lessonId: lessonId})}}
            />

            <TextInput
            defaultValue={clipData.content}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Content"
            multiline
            numberOfLines={3}
            borderWidth={1}
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setContent(text); setNewClip({ _id: clipData._id, clipName: clipName, content: text, lessonId: lessonId})}} 
            />
            
            {lessonData && <Picker
                selectedValue={lessonData}
    
                onValueChange={(itemValue, itemIndex) => {setLessonId(itemValue); setLessonChanged(true);
                setItemIndex(itemIndex - 1); setNewClip({ _id: clipData._id, clipName: clipName, content: content, lessonId: itemValue})}} >
                <Picker.Item label={'Please select a lesson'} value={null} />
                { lessonData.map((item, key)=>(
                <Picker.Item label={item.name} value={item._id} key={key} />)
                )}
        
            </Picker>}
            {lessonData && <Text style={{alignSelf: 'center', fontSize: 16}}>Current lesson: <Text style={{fontSize: 16, color: '#841584', fontWeight: 'bold'}}>{!lessonChanged ? clipCurrentLesson.name  : lessonData[itemIndex].name  }</Text></Text>}
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button color='#841584' title="Pick a video from device to update" onPress={pickImage} />
                
               

                  <View style={styles.buttoncontainer}>
                <View style={styles.buttons}>
                <View style={{width: '45%'}}>
                <Button color='#841584' title="Update video" onPress={uploadVideo} /></View>
                <View style={{width: '45%'}}><Button color='#841584' title="Delete video" onPress={showConfirmationDialog} /></View>
                </View>
                </View>

                {/* <Button color='#841584' title="Test" onPress={test} /> */}
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
        justifyContent: 'center',
        flex: 1,
    },
    video: {

        alignSelf: 'center',
        width: 320,
        height: 200,
      },
      buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
      buttoncontainer: {
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

export default AdminClipDetailScreen;