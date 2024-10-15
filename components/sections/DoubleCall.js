// components/JoinedCallScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AwesomeIcon from '../ui/AwesomeIcon';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faMicrophoneSlash, faPhone } from '@fortawesome/free-solid-svg-icons';
import NormalText from '../ui/NormalText';
import MediumText from '../ui/MediumText';
import { css } from '../../assets/styles';

const DoubleCall = () => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev === 59) {
                    setMinutes((min) => min + 1);
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[css.safeAreaView, styles.container]}>
            <NormalText styleProp={styles.textStyle}>Hello Daktari Audio Call for session: SESS-XBN5C between Patrick Ayub (running on Emulator Device: Android Pixel 7 C:\Users\new user\Desktop\HelloDaktari\node_modules\metro\src\node-haste\DependencyGraph.js:277:43) and Doc Auka (Running on TECNO Spark) </NormalText>
            <NormalText styleProp={styles.timerText}>
                {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
            </NormalText>
            <View style={styles.profilesContainer}>
                <View>
                    <Image
                        source={{ uri: 'https://hellodaktari.org/uploads/images/avatar1.png' }}
                        style={styles.profilePicture}
                    />
                    <MediumText styleProp={{ textAlign: "center", color: "#fff" }}>Patrick Ayub</MediumText>
                </View>

                <View>
                    <Image
                        source={{ uri: 'https://hellodaktari.org/uploads/images/auka.png' }}
                        style={styles.profilePicture}
                    />
                    <MediumText styleProp={{ textAlign: "center", color: "#fff" }}>Doc Auka</MediumText>
                </View>


            </View>
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button}>
                    <AwesomeIcon iconName={faMicrophoneSlash} iconSize={24} iconColor={"#fff"} />
                    <NormalText styleProp={styles.buttonText}>Mute</NormalText>
                </Pressable>
                <Pressable style={[styles.button, styles.endCallButton]}>
                    <AwesomeIcon iconName={faPhone} iconSize={24} iconColor={"#fff"} />
                    <NormalText styleProp={styles.buttonText}>End Call</NormalText>
                </Pressable>
                <Pressable style={styles.button}>
                    <AwesomeIcon iconName={faComment} iconSize={24} iconColor={"#fff"} />
                    <NormalText styleProp={styles.buttonText}>Send Message</NormalText>
                </Pressable>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#075E54',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    profilesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 40,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 30,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        padding: 10,
        borderRadius: 30,
        width: 80,
    },
    endCallButton: {
        backgroundColor: '#d9534f',
    },
    buttonText: {
        color: '#FFFFFF',
        marginTop: 5,
        fontSize: 8,
    },
    textStyle: {
        textAlign: "center",
        color: '#FFFFFF',
    }
});

export default DoubleCall;
