import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Button } from "react-native";



function SubComment({ userName, comment, onPress, postedAt, onPress2, isFlagged, deleteShowConditions, onDelete, onReport, show, isCorrect, onShowOptions }) {
  return (
    <View style={isFlagged ? styles.flaggedcontainer : styles.outercontainer}>
      <View style={{
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignContent: 'center', alignItems: 'center'
      }}>
        <Text style={isFlagged ? {fontWeight: "bold", fontSize: 16, color: 'red'} : {fontWeight: "bold", fontSize: 16, color: '#841584'}}>{userName}</Text>
        <Text style={{color: 'black', marginLeft: '3%', alignContent: 'center', alignItems: 'center'}}>{postedAt}</Text>
      </View>
      <View style={{
          alignSelf: 'flex-start', marginTop: 5
      }}>
        <Text>{comment}</Text></View>
      <View style={{
          alignSelf: 'flex-start',
          flex: 1,
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'space-between',
          // alignContent: 'space-between',
          marginTop: 10
      }}>
        <View style={{borderWidth: 1, height: '90%', width: '10%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <TouchableWithoutFeedback onPress={onShowOptions}><Text style={{color: '#841584'}}>•••</Text></TouchableWithoutFeedback></View>
        

      </View>

      {show && <View style={{
          alignSelf: 'flex-start',
          flex: 1,
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'space-between',
          // alignContent: 'space-between',
          marginTop: 10
      }}>
        {deleteShowConditions && <View style={{marginRight: '4%'}}>
         <Button color="#841584" title='Delete' onPress={onDelete}/></View>}
        <Button color={isFlagged ? 'red' :"#841584"} title='Report Comment' onPress={onReport}/>

      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  outercontainer: {
    width: "95%",
    backgroundColor: '#F0F8FF',
    overflow: "hidden",
    // justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'flex-end',
    marginRight: '1%',
    padding: 5,
    borderColor: ('#841584'),
    // borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10
  },
  flaggedcontainer: {
    width: "95%",
    backgroundColor: '#F0F8FF',
    overflow: "hidden",
    // justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'flex-end',
    marginRight: '1%',
    padding: 5,
    borderColor: ('red'),
    // borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10
  },
});

export default SubComment;
