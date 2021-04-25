import React from "react";
import { View, Text, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback, Button } from "react-native";
import { AntDesign, FontAwesome  } from '@expo/vector-icons'; 



function ListItemSmall({ title, subTitle, image, onPress, onPress2 }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.outercontainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.subtitle}>{subTitle}</Text>}
      </View>
      <View style={styles.arrow}>
          {onPress2 && <FontAwesome.Button name='trash' size={31} borderRadius={0} backgroundColor={'#841584'} onPress={onPress2} iconStyle={{marginRight: 0}} />}
        </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outercontainer: {
    width: "100%",
    height: 50,
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
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    flex: 0.2,
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

export default ListItemSmall;
