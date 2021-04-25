import React from 'react';
import { ImageBackground, View, StyleSheet, Image, Text, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';

function WelcomeScreen(props) {
    return (
        <ImageBackground
        style={styles.background}
        source={require("./background.png")}
        >
            <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require("./logo.png")}/>
            </View>
            <View style={styles.loginButton}>
            <View style={{marginBottom: 5}}>
            <Button title="Login" color={'#841584'} onPress={() => props.navigation.navigate('Login')} />
            </View>
            
            <Button title="Register" color={'#841584'} onPress={() => props.navigation.navigate('Register')} />
            </View>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    logoContainer: {
        position: "absolute",
        top: 80,
        alignItems: "center"
    },
    loginButton: {
        width: '50%',
        height: 70,
        justifyContent: "center",
        bottom: 20
    },
    logo:{
        width: 180,
        height: 180,
    },
    registerButton: {
        width: '50%',
        height: 70,
        justifyContent: "center",
        backgroundColor: 'teal',
    }

})

export default WelcomeScreen;