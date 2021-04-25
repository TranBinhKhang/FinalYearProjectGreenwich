import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Text, Image, SafeAreaView, FlatList, StyleSheet, TextInput, Platform, View, Alert} from 'react-native';
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


const homenetwork = 'http://192.168.1.142:4000/api/clips';

function LessonScreen({route, navigation}) {
    const { user, setUser } = useContext(Auth);
    const [lessonInfo, setLessonInfo] = useState(route.params);
    const [comment, setComment] = useState([]);
    const [change, setChange] = useState(0);

    const [showBox, setShowBox] = useState(false);

    const [commentNew, setCommentNew] = useState();

    const [commentReply, setCommentReply] = useState();

    // const [clipData, setClipData] = useState();
    // const lessoninfo = route.params;
    // const [isEmpty, setIsEmpty] = useState(false);

    const newComment = {
        lessonId: lessonInfo._id,
        userName: user.userName,
        userId: user._id,
        comment: commentNew
    }

    const handleReport = async (item) => {

        const commentReport = {
            lessonId: lessonInfo._id,
            userName: item.userName,
            userId: item.userId,
            commentId: item._id,
            comment: item.comment,
            isReply: false, //comments and replies to comments are stored separately, but their reports are sent to the same table. This key value pair is used to distinguish between comments and replies in the database
            parentId: null, //this is necessary to delete replies in report. But it is not necessary here
        }
        await axios.post('http://192.168.1.142:4000/api/postreport', commentReport);
        await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});

    }

    const handleReportReply = async (item, item2) => {

        const replyReport = {
            lessonId: lessonInfo._id,
            userName: item2.userName,
            userId: item2.userId,
            commentId: item2._id,
            parentId: item._id,
            comment: item2.comment,
            isReply: true,
        }
        await axios.post('http://192.168.1.142:4000/api/postreport', replyReport);
        await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});

    }

    const handleNewComment = async () => {
        await axios.post('http://192.168.1.142:4000/api/postcomment', newComment);
        await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});
    }

    const handleReplyComment = async (item) => {

        const replyComment = {
            lessonId: lessonInfo._id,
            commentId: item._id,
            userName: user.userName,
            userId: user._id,
            comment: commentReply
        }

        await axios.post('http://192.168.1.142:4000/api/replycomment', replyComment);
        await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});
    }

    const handleDeleteComment = async (item) => {
        const mainDelete = {
            lessonId: lessonInfo._id,
            commentId: item._id,
        }

        await axios.post('http://192.168.1.142:4000/api/deletemaincomment', mainDelete);
        await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});
    }

    const handleDeleteReply = async (item, item2) => {
        const replyDelete = {
            lessonId: lessonInfo._id,
            commentId: item._id,
            replyId: item2._id
        }

        await axios.post('http://192.168.1.142:4000/api/deletereply', replyDelete);
        await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});
    }

    const lesson = {
        _id: lessonInfo._id
    }

    const fetchComment = async () => {
       await axios
        .post("http://192.168.1.142:4000/api/comment", lesson)
        .then(response => {setComment(response.data); comment.toString()});
    }

    useEffect(() => {
        fetchComment();
      }, []);

    return (
        <View style={styles.outercontainer}>

            <ScrollView style={{ flex: 1, height: '100%'}}>
            {comment && comment.map((item)=>( //map all answers from database
                <React.Fragment key={item._id}>
                <Comment 
                userName={item.userName} 
                comment={item.comment}
                onShowOptions={() => {item.showOptions = !item.showOptions; setChange(change + 1)}} //Hide or show advanced comment options, like delete and report
                show={item.showOptions}
                deleteShowConditions={ user._id == item.userId || user.isAdmin} //so that only the admin or the user who make the comment can delete it
                postedAt={item.postedAt}
                replyCount={item.replyCount}
                showReplyText={item.showChild ? `Show replies (${item.replyCount}) ↑` : `Show replies (${item.replyCount}) ↓` }
                onPress={() => {item.showReply = !item.showReply; setChange(change + 1)}}
                onPress2={() => {item.showChild = !item.showChild; setChange(change + 1)}}
                onDelete={() => handleDeleteComment(item)}
                onReport={() => handleReport(item)}
                isFlagged={item.flagged && user.isAdmin}
                />

                {item.showReply && <React.Fragment>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Enter your comments, feedback or new movie requests here. Offtopic comment will be deleted without notice. Offensive or abusive commenters will be permanently banned"
                    multiline
                    style={{backgroundColor: 'white'}}
                    numberOfLines={3}
                    borderWidth={1}
                    borderColor='#7442c8'           
                    onChangeText={(text) => setCommentReply(text)} />
                <Button title="Post" onPress={() => {handleReplyComment(item)}} color={'#841584'}  />
                </React.Fragment>}

                {item.showChild && item.childComment.map((item2)=> (
                        <SubComment 
                        userName={item2.userName} 
                        comment={item2.comment}
                        key={item2._id}
                        onShowOptions={() => {item2.showOptions = !item2.showOptions; setChange(change + 1)}} //Hide or show advanced comment options, like delete and report
                        show={item2.showOptions}
                        deleteShowConditions={ user._id == item2.userId || user.isAdmin} //so that only the admin or the user who make the comment can delete it
                        postedAt={item2.postedAt}
                        onPress={() => {item2.showReply = !item2.showReply; setChange(change + 1)}}
                        onPress2={() => {item2.showChild = !item2.showChild; setChange(change + 1)}}
                        onDelete={() => handleDeleteReply(item, item2)}
                        onReport={() => handleReportReply(item, item2)}
                        isFlagged={item2.flagged && user.isAdmin}
                        />
                ))}
                </React.Fragment>
                
                )
                )}
            </ScrollView>

            <View style={{width: '98%', justifyContent: 'flex-end', alignSelf: 'center', position: 'absolute', bottom: 0}}>
            
            
            <View style={{backgroundColor: '#841584', height: 50, width: 50, borderRadius: 50, alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center',  marginBottom: 10}}>
            <TouchableWithoutFeedback onPress={() => setShowBox(!showBox)}>
            <Text style={{fontSize: 30, color: 'white'}}>{!showBox ? '+' : '-'}</Text></TouchableWithoutFeedback>
            </View>


            {showBox &&  <>
            <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your comments, feedback or new movie requests here. Offtopic comment will be deleted without notice. Offensive or abusive commenters will be permanently banned"
            multiline
            style={{backgroundColor: 'white'}}
            numberOfLines={3}
            borderWidth={1}
            borderColor='#7442c8'           
            onChangeText={(text) => setCommentNew(text)} 
            />
            <Button title="Post" onPress={() => {handleNewComment(); setShowBox(false)}} color={'#841584'}  />
            </>
            }
            
            </View>
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

export default LessonScreen;