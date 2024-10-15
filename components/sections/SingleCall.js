// components/CallScreen.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, Pressable, ImageBackground, } from 'react-native';
import NormalText from '../ui/NormalText';
import MediumText from '../ui/MediumText';
import AwesomeIcon from '../ui/AwesomeIcon';
import { faMicrophoneSlash, faVideoCamera, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { css } from '../../assets/styles';

const SingleCall = () => {
    const handleVideoButtonPress = () => {
        Alert.alert('Video Call', 'Video call not configured for your device');
    };

    return (
        <ImageBackground
            style={[css.safeAreaView]}
            source={require("../../assets/images/back.png")}
        >
            <View style={styles.container}>
                <MediumText styleProp={styles.headerText}>Hello, Patrick</MediumText>
                <NormalText styleProp={{ color: "#000" }}>Doc Auka has been notified, kindly wait for them to join.</NormalText>
                <View style={styles.middleContainer}>
                    <ActivityIndicator size="large" color="#0e204d" />
                    <NormalText styleProp={styles.waitingText}>Waiting for doctor to join call</NormalText>
                </View>
                <View style={styles.buttonsContainer}>
                    <Pressable style={styles.button}>
                        {/* <FontAwesome name="microphone-slash" size={24} color="#FFFFFF" /> */}
                        <AwesomeIcon iconName={faMicrophoneSlash} iconSize={24} iconColor={"#fff"} />
                        <NormalText styleProp={styles.buttonText}>Mute</NormalText>
                    </Pressable>
                    <Pressable style={styles.button}>
                        {/* <FontAwesome name="volume-up" size={24} color="#FFFFFF" /> */}
                        <AwesomeIcon iconName={faVolumeUp} iconSize={24} iconColor={"#fff"} />
                        <NormalText styleProp={styles.buttonText}>Loud Speaker</NormalText>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleVideoButtonPress}>
                        {/* <FontAwesome name="video-camera" size={24} color="#FFFFFF" /> */}
                        <AwesomeIcon iconName={faVideoCamera} iconSize={24} iconColor={"#fff"} />
                        <NormalText styleProp={styles.buttonText}>Video</NormalText>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 24,
        color: '#000',
        marginBottom: 20,
        marginTop: 50
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waitingText: {
        fontSize: 16,
        color: '#0e204d',
        marginTop: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        padding: 10,
        borderRadius: 30,
        width: 80,
    },
    buttonText: {
        color: '#FFFFFF',
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
    },
});

export default SingleCall;
