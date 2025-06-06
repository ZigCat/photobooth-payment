import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native-web';

const StartButton = ({ onPress }) => {
    const styles = StyleSheet.create({
        button: {
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            width: 80,
            height: 80,
            resizeMode: 'contain',
            tintColor: '#212121',
        },
        label:{
            color: '#f0f0f0',
            fontWeight: 'bold',
            fontSize: 30,
            marginBottom: 10,
            fontFamily: 'Arial',
        }
    });
    return(
        <View style={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.label}>Нажми для фото</Text>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Image
                    source={require('../assets/instagram.svg')} style={styles.icon}/>
            </TouchableOpacity>
        </View>
    );
}

export default StartButton;