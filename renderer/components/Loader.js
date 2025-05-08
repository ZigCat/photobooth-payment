import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = () => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    }
  });

  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#3FA0E1" />
    </View>
  );
};

export default Loader;