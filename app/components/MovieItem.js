import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback } from "react-native";



function MovieItem({ title, subTitle, image, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.outercontainer}>
    <Image 
    source={{ uri: image}} 
    style={styles.image}
    />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.subtitle}>{subTitle}</Text>}
      </View>
      <View style={styles.arrow}>
          <Text>{'>'}</Text>
        </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outercontainer: {
    width: "100%",
    height: 100,
    // marginBottom: 5,
    backgroundColor: 'white',
    overflow: "hidden",
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-between',
    flex: 1,
    // padding: 2,
    borderColor: '#841584',
    // borderStyle: 'solid',
    borderWidth: 1,
    // borderRadius: 20
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
  },
  arrow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    marginRight: 15,
  },
  image: {
    marginLeft: 5,
    width: 95,
    height: 95,
    borderRadius: 0,
    resizeMode: 'cover'
  },
  title: {
    marginBottom: 7,
    fontWeight: 'bold',
    color: '#841584'
  },
  subtitle: {
    marginBottom: 7,
  },
});

export default MovieItem;
