import {StyleSheet, SafeAreaView, Platform} from 'react-native';
import React from 'react';

const SafeAreaViewComponent = ({children}) => {
  return <SafeAreaView style={[styles.container]}>{children}</SafeAreaView>;
};

export default SafeAreaViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: Platform.OS == 'android' ? 0 : 20,
  },
});
