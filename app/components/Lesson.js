import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback } from "react-native";



function Lesson({ title, image, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.outercontainer}>
    <Image 
      source={require("../screens/logo.png")} 
      style={styles.image}
    />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outercontainer: {
    width: "45%",
    height: 120,
    marginBottom: 10,
    backgroundColor: 'white',
    overflow: "hidden",
    // justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 10,
    borderColor: '#841584',
    // borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 20
  },
  container: {
    padding: 20,
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    marginBottom: 7,
  },
});

export default Lesson;
