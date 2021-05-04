import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, StyleSheet, FlatList, TextInput, Platform, View, Alert} from 'react-native';
import jwtDecode from 'jwt-decode';
import * as SecureStore from "expo-secure-store";
import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';
import Lesson from '../components/Lesson';
import Answer from '../components/Answer';
import { TouchableHighlight } from 'react-native-gesture-handler';


function TestScreen({route, navigation}) {
    const { user } = useContext(Auth);
    const [testData, setTestData] = useState();
    const [questionNumber, setQuestionNumber] = useState();
    const [index, setIndex] = useState(0);
    const [correct, setCorrect] = useState(false);
    const [lessonInfo, setLessonInfo] = useState(route.params);

    const [correctAnswer, setCorrectAnswer] = useState(false);

    const completeLesson = {
      userId: user._id,
      lessonId: lessonInfo._id,
      name: lessonInfo.name
    }

    const checkAnswer = (item) => {
      if (item.isCorrect) {setCorrect(true); setCorrectAnswer(item)}
      else {
        if (!correct) showWrongAlert(); //if user has already selected a correct answer, pressing 
                                        //a wrong answer won't throw an incorrect message. This is to prevent misclick
      }
    }

    const showWrongAlert = () =>
    Alert.alert(
      "Incorrect answer",
      "Please try again",
    [
    {
      text: "Ok",
      style: "cancel",
      onPress: () => navigation.goBack()
    },
    ],
  );

    const lesson = {
        _id: lessonInfo._id
    }

    useEffect(() => {
        axios
          .post("http://192.168.43.218:4000/api/lessontest", lesson)
          .then(response => {setTestData(response.data); setQuestionNumber(response.data.length)});
      }, []);

      const test = () => {
        console.log(correctAnswer);
    }

    return (
        <React.Fragment>
        <SafeAreaView style={styles.flexcontainer}>
        {testData && <Text style={{marginBottom: '30%',  textAlign: 'center', padding: 10}}><Text style={{color: '#841584', fontWeight: 'bold'}}>Question {index + 1} of {questionNumber}</Text>: {testData[index].question}</Text> }
        <View style={{width: '95%', height: '50%', alignItems: 'center'}}>

                {testData && testData[index].answers.map((item, key)=>( //map all answers from database
                <Answer 
                answer={item.text} 
                onPress={() => {checkAnswer(item)}}
                key={key}
                isCorrect={correctAnswer ? item.isCorrect : false} // It's hard to change a single component in a bunch of 
                //dynamic components, so this is the easiest way to implement color change when correct answer selected
                //basically just tell the component to make every true answer green, but hide it at the start of the screen
                //until user set correctAnswer to true by selecting the correct answer
                />)
                )}
            
        </View>
        </SafeAreaView>
        <View style={styles.navigate}>
        <View style={{width: '45%'}}>
          <Button title="Previous question" disabled={index == 0} color={'#841584'} onPress={()=> {setIndex(index - 1)}} /></View>
          <View style={{width: '45%'}}><Button 
          color={'#841584'}
          title={index == questionNumber - 1 ? "Finish" : "Next question"}
          disabled={!correct} 
          onPress={()=> {
          if (index == questionNumber - 1) {navigation.navigate('Lesson Completed', completeLesson)} //if this is last question, go to congrat page
          else setIndex(index + 1); setCorrect(false); setCorrectAnswer(false); // if not, just move to next question
          
          }} /></View>
          </View>
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
        borderColor: 'red',
        borderWidth: 1,
        
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
    navigate: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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

export default TestScreen;