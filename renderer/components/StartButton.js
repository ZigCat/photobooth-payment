import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native-web';

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
    });
    return(
        <View style={{width: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Image
                    source={require('../assets/instagram.svg')} style={styles.icon}/>
            </TouchableOpacity>
        </View>
    );
}

export default StartButton;