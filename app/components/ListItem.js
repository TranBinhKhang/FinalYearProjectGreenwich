import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback } from "react-native";



function ListItem({ title, subTitle, image, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.outercontainer}>
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
    height: 70,
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
    width: 50,
    height: 50,
    borderRadius: 50
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

export default ListItem;
