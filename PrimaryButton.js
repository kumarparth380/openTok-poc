import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const PrimaryButton = props => {
  return (
    <TouchableOpacity onPress={props.onSubmit}>
      <View style={[styles.primaryBtn, props.btnStyle]}>
        <Text style={[styles.btnName, props.btnTexStyle]}>{props.btnName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
