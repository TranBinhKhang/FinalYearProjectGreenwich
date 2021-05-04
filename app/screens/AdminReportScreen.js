import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, FlatList, StyleSheet, TextInput, Platform, View} from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

import Comment from '../components/Comment';
import SubComment from '../components/SubComment';

import jwtDecode from 'jwt-decode';
import * as SecureStore from "expo-secure-store";
import cache from '../utility/cache';
import securecache from '../utility/securecache';
import Auth from '../auth/auth';
import * as FileSystem from 'expo-file-system';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ReportComment from '../components/ReportComment';


const homenetwork = 'http://192.168.43.218:4000/api/clips';

function AdminReportScreen({route, navigation}) {
    const { user, setUser } = useContext(Auth);
    // const [lessonInfo, setLessonInfo] = useState(route.params);
    const [comment, setComment] = useState([]);
    const [change, setChange] = useState(0);

    const [showBox, setShowBox] = useState(false);

    const [commentNew, setCommentNew] = useState();

    const [commentReply, setCommentReply] = useState();

    // const [clipData, setClipData] = useState();
    // const lessoninfo = route.params;
    // const [isEmpty, setIsEmpty] = useState(false);

    // const newComment = {
    //     lessonId: lessonInfo._id,
    //     userName: user.userName,
    //     userId: user._id,
    //     comment: commentNew
    // }

    const handleDismiss = async (item) => {

        const dismissReport = {
            reportId: item._id,
            lessonId: item.lessonId,
            commentId: item.commentId
        }
        await axios.post('http://192.168.43.218:4000/api/dismissreport', dismissReport);
        fetchReport();
    }

    // const handleReportReply = async (item2) => {

    //     const replyReport = {
    //         lessonId: lessonInfo._id,
    //         userName: item2.userName,
    //         userId: item2.userId,
    //         commentId: item2._id,
    //         comment: item2.comment
    //     }
    //     await axios.post('http://192.168.43.218:4000/api/postreport', replyReport);
    //     await axios
    //     .post("http://192.168.43.218:4000/api/comment", lesson)
    //     .then(response => {setComment(response.data); comment.toString()});

    // }

    // const handleNewComment = async () => {
    //     await axios.post('http://192.168.43.218:4000/api/postcomment', newComment);
    //     await axios
    //     .post("http://192.168.43.218:4000/api/comment", lesson)
    //     .then(response => {setComment(response.data); comment.toString()});
    // }

    // const handleReplyComment = async (item) => {

    //     const replyComment = {
    //         lessonId: item.lessonId._id,
    //         commentId: item.commentId,
    //         userName: user.userName,
    //         userId: user._id,
    //         comment: commentReply
    //     }

    //     await axios.post('http://192.168.43.218:4000/api/replycomment', replyComment);
    //     await axios
    //     .post("http://192.168.43.218:4000/api/comment", lesson)
    //     .then(response => {setComment(response.data); comment.toString()});
    // }

    const handleDeleteComment = async (item) => {
        const mainDelete = {
            lessonId: item.lessonId,
            commentId: item.commentId,
        }

        await axios.post('http://192.168.43.218:4000/api/deletemaincomment', mainDelete);
        handleDismiss(item);
        fetchReport();
    }

    const handleDeleteReply = async (item, item2) => {
        const replyDelete = {
            lessonId: item.lessonId,
            commentId: item.parentId,
            replyId: item.commentId
        }

        await axios.post('http://192.168.43.218:4000/api/deletereply', replyDelete);
        handleDismiss(item);
        fetchReport();
    }


    const fetchReport = async () => {
       await axios
        .get("http://192.168.43.218:4000/api/report")
        .then(response => {setComment(response.data); comment.toString()});
    }

    useEffect(() => {
        fetchReport();
      }, []);

      const banAction = async (item) => {
          const user = {
              _id: item.userId._id
          }
          await axios.post('http://192.168.43.218:4000/api/ban', user);
          fetchReport();
      }

    return (
        <View style={styles.outercontainer}>

            <ScrollView style={{ flex: 1, height: '100%'}}>
            {comment && comment.map((item, key)=>( //map all answers from database
                    <ReportComment 
                        userName={item.userName} 
                        comment={item.comment}
                        key={key} 
                        onShowOptions={() => {item.showOptions = !item.showOptions; setChange(change + 1)}} //Hide or show advanced comment options, like delete and report
                        show={item.showOptions}
                        deleteShowConditions={ user._id == item.userId || user.isAdmin} //so that only the admin or the user who make the comment can delete it
                        postedAt={item.postedAt}
                        onPress={() => {item.showReply = !item.showReply; setChange(change + 1)}}
                        onPress2={() => {item.showChild = !item.showChild; setChange(change + 1)}}
                        onDelete={() => item.isReply ? handleDeleteReply(item) : handleDeleteComment(item)} //handleDeleteReply(item)
                        onDismiss={() => handleDismiss(item)}
                        isBanned={item.userId.isBanned}
                        onBan={() => banAction(item)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    outercontainer: {
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        flex: 1,
        height: '100%'
    },

    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
      },

    container: {
        width: '80%',
        backgroundColor: 'white'
    },
    comment: {
        justifyContent: 'center',
        flex: 1,
        width: '80%',
        backgroundColor: 'white'
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

export default AdminReportScreen;