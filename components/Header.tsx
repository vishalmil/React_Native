// components/Header.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { getCredentials } from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { colors } from "../theme/colors";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeColors = colors[theme];

  useEffect(() => {
    const loadUser = async () => {
      const creds = await getCredentials();
      if (creds?.username) setUsername(creds.username);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("credentials");
    setMenuVisible(false);
    navigation.replace("Login");
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.header }]}>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Welcome {username ? username : "Guest"}  ☰ 
        </Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={[styles.menu, { backgroundColor: themeColors.background }]}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Text style={[styles.menuItem, { color: themeColors.text }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Text style={[styles.menuItem, { color: themeColors.text }]}>
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.menuItem, { color: "red" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 15,
    alignItems: "flex-end",
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menu: {
    marginTop: 80,
    marginRight: 20,
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    width: 150,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
});