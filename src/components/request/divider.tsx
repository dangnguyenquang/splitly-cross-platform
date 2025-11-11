import React from "react";
import { View, StyleSheet } from "react-native";

const Divider = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    height: 1,                      
    width: "90%",                  
    backgroundColor: "#ccc", 
    marginHorizontal:24
  },
});

export default Divider;
