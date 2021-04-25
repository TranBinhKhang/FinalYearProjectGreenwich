import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity } from "react-native";



function Answer({ answer, image, onPress, isCorrect }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={isCorrect ? styles.outercontainerright : styles.outercontainer}>
        <Text style={isCorrect ? {textAlign: 'center', color: 'white', fontWeight: 'bold'} : 
        {textAlign: 'center', color: 'black'} }>{answer}</Text>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outercontainer: {
    width: "90%",
    height: "15%",
    backgroundColor: 'white',
    overflow: "hidden",
    // justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 5,
    borderColor: '#841584',
    // borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 10
  },
  outercontainerright: {
    width: "90%",
    height: "15%",
    backgroundColor: '#00FF00',
    color: 'white',
    overflow: "hidden",
    // justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 5,
    borderColor: '#32CD32',
    // borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 10
  }
});

export default Answer;
