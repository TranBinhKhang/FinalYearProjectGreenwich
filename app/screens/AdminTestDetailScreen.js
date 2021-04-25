import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, FlatList, StyleSheet, TextInput, Platform, View, Alert} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
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

function AdminTestDetailScreen({route}) {
    // const [data, setData] = useState('null');
    // const [lessonId, setLessonId] = useState(route.params._id);

    const [testData, setTestData] = useState(null);

    const [index, setIndex] = useState(0);
    const LessonData = route.params;

    const [spinner, setSpinner] = useState(false); //used to set the loading spinner

    const [refresh, setRefresh] = useState(false); //to refresh the render

    const [correctCount, setCorrectCount] = useState(0); //There are many questions in an arrays, and each question has its own array that contains answer. This is to keep track of the number of correct answer in those array of answers. Very important, whenever a new question is created, it has 0 

    const [questionNumber, setQuestionNumber] = useState(1);


    const [currentPage, setCurrentPage] = useState(1);


  const fetchTest = {
    _id: LessonData._id
  }

  const getTest = async () => {
    axios
    .post("http://192.168.1.142:4000/api/lessontest", fetchTest)
    .then(response => {setTestData(response.data);
      setQuestionNumber(response.data.length);

      //The code below is used to get the total number of correct answer in a question
      //It merges all of the answers in a question together, and then count the number of correct answer in all of them.
      var merged = []; 
      for (var i = 0; i < response.data[index].answers.length; i++) {
          merged = merged.concat(response.data[index].answers[i].isCorrect);
      }
      //The above way of merging data creates duplication. The below code eliminates all duplicates.
      var duplicate = [merged[0]];
      for (var i=1; i< merged.length; i++) {
         if (merged[i]!=merged[i-1]) duplicate.push(merged[i]);}

      var trueCount = 0;
      for (var i = 0; i < merged.length; i++) {
          if (merged[i] === true) trueCount++;
      }
      setCorrectCount(trueCount)
});
  }

    useEffect(() => {
      getTest();
    }, []);

    const updateTest = async () => {
      const updatelesson = {
        _id: LessonData._id,
        tests: testData
      }

      axios.post("http://192.168.1.142:4000/api/updatetest", updatelesson).then(() => console.log('saved'));
      showSuccessAlert()
    }

    const removeQuestion = async () => {
      if (index > 0) {
      
      testData.splice(index, 1);
      setCurrentPage(currentPage - 1);
      setQuestionNumber(questionNumber - 1);
      setIndex(index - 1);
      totalCorrectMinus();
    }
    if (index === 0) {
      console.log('Reset');
      testData[0] = {
         "question": "Test question. If you see this something is wrong", 
              "answers": [
                      {"text": "ok1", "isCorrect": false},
                      {"text": "ok2", "isCorrect": false},
                      {"text": "ok3", "isCorrect": false},
                      {"text": "ok4", "isCorrect": false}
                      ]
      };
      setRefresh(true);
      setTimeout(function() {
        setRefresh(false);
      }, 50);

     }
    }


    
    const totalCorrectPlus = () => { //This function is used to check whether of not a question already has one answer set to being the correct answer. This is important because there can only be one correct answer in every question.
      //There is two version of this function, totalCorrectPlus and Minus. Plus is used to check the correct answer count of the next question in the array, while minus does the opposite
      
      var merged = []; // merge all the clips arrays in watchedMovie into one arrays
      for (var i = 0; i < testData[index + 1].answers.length; i++) {
          merged = merged.concat(testData[index + 1].answers[i].isCorrect);
      }
  
      var duplicate = [merged[0]]; //remove all the duplicate because concat somehow causes duplicates
      for (var i=1; i< merged.length; i++) {
         if (merged[i]!=merged[i-1]) duplicate.push(merged[i]);}

      var trueCount = 0;
      for (var i = 0; i < merged.length; i++) {
          if (merged[i] === true) trueCount++;
      }
      setCorrectCount(trueCount)

      }

      const totalCorrectMinus = () => { 
        var merged = []; 
        for (var i = 0; i < testData[index - 1].answers.length; i++) {
            merged = merged.concat(testData[index - 1].answers[i].isCorrect);
        }
    
        var duplicate = [merged[0]]; //remove all the duplicate because concat somehow causes duplicates
        for (var i=1; i< merged.length; i++) {
           if (merged[i]!=merged[i-1]) duplicate.push(merged[i]);}
  
        var trueCount = 0;
        for (var i = 0; i < merged.length; i++) {
            if (merged[i] === true) trueCount++;
        }
        setCorrectCount(trueCount)
  
        }
    


    const test = () => {
        console.log(testData)
    } 

    const showSuccessAlert = () =>
        Alert.alert(
          "Note",
          "This test has been successfully saved",
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
      <View style={styles.container}>
      <View style={styles.questiontitle}>
      <Text style={{fontWeight: "bold", color: "purple"}}>{'Question ' + currentPage + ' of ' + questionNumber }</Text>
      </View>
      <View style={{height: '13%'}}>
      {testData && <TextInput
      defaultValue={testData[index].question}
      autoCapitalize="none"
      style={{ flex: 1}}
      autoCorrect={false}
      placeholder="Clip name"
      borderWidth={1}
      marginTop={-10}
      height={40}
      borderColor='#841584'
      onChangeText={text => {testData[index].question = text}}
      />}</View>

      
      {testData && testData[index].answers.map((item, key)=>(

          <View key={key}>
               <TextInput
               defaultValue={item.text}
               autoCapitalize="none"
               autoCorrect={false}
               placeholder="Content"
               multiline
               numberOfLines={3}
               borderWidth={1}
               height={40}
               marginTop={10}
               borderColor='#7442c8'           
               onChangeText={text => {testData[index].answers.forEach((e, i) => {
                if(e.text === item.text) {
                  testData[index].answers[i].text = text;
                }
            })}} 
               />
            <View style={{        flexDirection: 'row',
              justifyContent: 'flex-start', alignItems:'center'}}>
              <CheckBox
               disabled={!(item.isCorrect) && correctCount == 1}
               value={item.isCorrect}
               onValueChange={() => {

                if (!item.isCorrect) setCorrectCount(correctCount + 1);
                else setCorrectCount(correctCount - 1);

                item.isCorrect = !item.isCorrect;
                console.log(item.isCorrect);
                setRefresh(true); //setRefresh is used to reset the render. It's not necessary anymore due to the setCorrectCount function above, but I'll leave it here for fun. Doesn't hurt to do it.
                setTimeout(function() {
                  setRefresh(false);
                }, 50);
                testData[index].answers.forEach((e, i) => {
                if(e.text === item.text) {
                  testData[index].answers[i].isCorrect = item.isCorrect;
                }
                });
               
              
              }}

              /><Text>Set as the correct answer</Text></View>

               </View>

               
               
               )
                )}


      <Button color={'#841584'} title="Save change" onPress={updateTest} />
      <View style={{marginTop: 5}}><Button color={'#841584'} title="Delete question" onPress={removeQuestion} /></View>
      <View style={styles.navigate}>
          <View style={{width: '45%'}}>
          <Button color={'#841584'} title="Previous question" disabled={index == 0} onPress={()=> {
            setIndex(index - 1);
            totalCorrectMinus();
            setCurrentPage(currentPage - 1);      
            }} /></View>
          <View style={{width: '45%'}}><Button color={'#841584'} title={(index == questionNumber - 1) ? 'Create new question' : 
          'Next\nquestion'} onPress={()=> {
            
            if (index == questionNumber - 1) {testData.push({              
              "question": "Test question. If you see this something is wrong", 
              "answers": [
                      {"text": "ok1", "isCorrect": false},
                      {"text": "ok2", "isCorrect": false},
                      {"text": "ok3", "isCorrect": false},
                      {"text": "ok4", "isCorrect": false}
                      ]
              });
              setIndex(index + 1);
              setCorrectCount(0);
              setQuestionNumber(questionNumber + 1);
              setCurrentPage(currentPage + 1);
            }
            else setIndex(index + 1);
            totalCorrectPlus();
            setCurrentPage(currentPage + 1);
            }} /></View>
          </View>

      </View>


  </SafeAreaView>

    );
}

const styles = StyleSheet.create({

    outercontainer: {
      backgroundColor: 'white',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexShrink: 0,
      flexWrap: 'wrap',
      padding: -10,
      marginTop: 5
    },

    questiontitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
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
    navigate: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 5
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

export default AdminTestDetailScreen;