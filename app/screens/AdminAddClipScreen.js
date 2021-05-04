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

function AdminAddClipScreen({route}) {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const { user, setUser } = useContext(Auth);
    const [spinner, setSpinner] = useState(false);
    const [lessonData, setLessonData] = useState(null);
    const [file, setFile] = useState(null);
    // const [data, setData] = useState('null');
    const [clipName, setClipName] = useState(null);
    const [data, setData] = useState(null);
    const [content, setContent] = useState(null);
    const [lessonId, setLessonId] = useState('41224d776a326fb40f000001');
    const [itemIndex, setItemIndex] = useState('0')

    const [newClip, setNewClip] = useState({
      clipName: clipName,
      content: content,
      data: data,
      lessonId: lessonId //This value cannot be null, so this string is a placeholder to allow lessonId to be null in a manner of speaking. It is not a real objectId. It will not be matched by a real Id because objectId in Mongoose is generated based on time and machine, so no two machines at two different times will generate the same string. It also has 24 digit, so theoretically you have to try like 2.2300745e+43 times to get another match.

    });

    


    
    const getPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('We need your permissions to upload video');
            }
          }
    }

    const test =  () => {
      // console.log(lessonId);
      // console.log(clipName);
      // console.log(content);
      // setNewClip({data: data, clipName: clipName, content: content, lessonId: lessonId})
      // console.log(newClip);
  }

  const showSuccessAlert = () =>
        Alert.alert(
          "Note",
          "This clip has been successfully added",
        [
        {
          text: "Ok",
          style: "cancel",
        },
        ],
      );


    useEffect(() => {
        getPermission();
        axios
          .get("http://192.168.43.218:4000/api/lesson")
          .then(response => {setLessonData(response.data)});
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
                        setData(res.data.secure_url);
                        setNewClip({data: res.data.secure_url, clipName: clipName, content: content, lessonId: lessonId});
                        setSpinner(false);
                      })
          .catch(err =>{
            console.log(err)
        });
        }
      };

      const uploadVideo = async () => {

        try {
        await axios.post('http://192.168.43.218:4000/api/uploadclip', newClip); showSuccessAlert()}
        catch{
          console.log('Something went wrong')
        }
      };

      

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
                uri: data ? data : 'https://res.cloudinary.com/daekmobzf/video/upload/v1618218015/yt1s.com_-_video_placeholder_v144P_sgs82l.mp4',
		          overrideFileExtensionAndroid: 'true',
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.container}>
            <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Clip name"
            borderWidth={1}
            height={40}
            borderColor='#841584'
            onChangeText={text => {setClipName(text); setNewClip({ clipName: text,
              content: content,
              data: data,
              lessonId: lessonId})}}
            />

            <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Content"
            multiline
            numberOfLines={3}
            borderWidth={1}
            height={40}
            marginTop={10}
            borderColor='#7442c8'           
            onChangeText={text => {setContent(text); setNewClip({ clipName: clipName,
              content: text,
              data: data,
              lessonId: lessonId})}} 
            />
            {lessonData && <Picker
                selectedValue={lessonData} //For some reason, this is not functional. The picker won't
                                                          //display the name of selected item
                onValueChange={(itemValue, itemIndex) => {setLessonId(itemValue); setItemIndex(itemIndex - 1);
                  setNewClip({ clipName: clipName,
                    content: content,
                    data: data,
                    lessonId: itemValue})
                }} >
                <Picker.Item label={'Select a lesson to add this clip to'} value={null} />
                { lessonData.map((item, key)=>(
                <Picker.Item label={item.name} value={item._id} key={key} />)
                )}
                <Picker.Item label={'No lesson'} value={'41224d776a326fb40f000001'} />
        
            </Picker>}
            {/* As the result of selectedValue being nonfunctional, I have to display the name of the current selected item somewhere else */}
            {lessonData && <Text style={{alignSelf: 'center', fontSize: 16}}>Selected lesson: <Text style={{fontSize: 16, color: '#841584', fontWeight: 'bold'}}>
              {lessonId == '41224d776a326fb40f000001' ? 'None' : lessonData[itemIndex].name}</Text></Text>}
            
            
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{marginBottom: 5}}>
                <Button color={'#841584'} title="Pick a video from your device" onPress={pickImage} /></View>
                
                <Button color={'#841584'} title="Upload video" onPress={uploadVideo} />
                {/* <Button title="Test" onPress={test} /> */}
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

      container: {
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

export default AdminAddClipScreen;