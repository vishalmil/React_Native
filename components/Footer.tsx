// components/Footer.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { colors } from "../theme/colors";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeColors = colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.footer }]}>
      {["Home", "Search"].map((route) => (
        <TouchableOpacity key={route} onPress={() => navigation.navigate(route as keyof RootStackParamList)}>
          <Text style={[styles.link, { color: themeColors.text }]}>{route}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    marginBottom: 15,
  },
  link: {
    fontSize: 14,
    fontWeight: "bold",
  },
});