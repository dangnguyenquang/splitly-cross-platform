import React from "react";
import { Text, View, StyleSheet} from "react-native";
import { colors } from "../../Constant/theme";

const SectionDivider = ({ title }: { title: string}) => {
  return (
    <View style={styles.SectionDivider}>
      <Text style={styles.SectionHeaderText}>{title}</Text>
      <View style={styles.line}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  SectionDivider:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginRight:24
  },
  SectionHeaderText:{
    fontSize:12,
    color:colors.secondary,
    paddingLeft:24,
    paddingRight:24,
    paddingBottom:10
  }
});
export default SectionDivider;