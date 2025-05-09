import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native-web';
import plusIcon from '../assets/plus.svg';
import minusIcon from '../assets/minus.svg';

const Selector = ({title, value, setValue}) => {
    const styles = StyleSheet.create({
        title:{
            fontSize: 25,
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'center'
        },
        container:{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center'
        },
        buttons:{
            width: 400,
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        button:{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc'
        },
        buttonIn:{
            width: 40,
            height: 40,
            resizeMode: 'contain'
        },
        value:{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#333'
        }
    });

    const handleBack = () => {
        if(value > 1){
            setValue(value - 1);
        }
    }

    const handleNext = () => {
        if(value < 10){
            setValue(value + 1);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.buttons}>
                <View style={styles.button} onClick={handleBack}>
                    <Image source={minusIcon} style={styles.buttonIn}/>
                </View>
                <Text style={styles.value}>{value}</Text>
                <View style={styles.button} onClick={handleNext}>
                    <Image source={plusIcon} style={styles.buttonIn}/>
                </View>
            </View>
        </View>
    );
};

export default Selector;