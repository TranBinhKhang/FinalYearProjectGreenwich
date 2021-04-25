import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Button } from "react-native";



function ReportComment({ userName, comment, onPress, postedAt, onPress2, onDelete, isBanned, show, isCorrect, onShowOptions, onDismiss, onBan }) {
  return (
    <View style={styles.flaggedcontainer}>
      <View style={{
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignContent: 'center', alignItems: 'center'
      }}>
        <Text style={{fontWeight: "bold", fontSize: 16, color: 'red'}}>{userName}</Text>
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
        

      </View>

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
        <View style={{marginRight: '4%'}}>
         <Button color={'red'} title='Delete' onPress={onDelete}/></View>
         <View style={{marginRight: '4%'}}>
         <Button color={'red'} title='Dismiss Comment' onPress={onDismiss}/></View>
         <Button color={'red'} title={isBanned ? 'Unban' : 'Ban'} onPress={onBan}/>

      </View>
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
    width: "99%",
    backgroundColor: '#F0F8FF',
    overflow: "hidden",
    // justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 5,
    borderColor: ('red'),
    // borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10
  },
});

export default ReportComment;
