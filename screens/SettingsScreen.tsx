// screens/SettingsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { saveTheme } from "../store/themeSlice";
import { clearCredentials } from "../utils/storage";
import Layout from "./_Layout";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from '../theme/colors';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { styles } from "../styles/styles";


type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeColors = colors[theme];
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(FIRESTORE_DB, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  };


  const isDark = theme === "dark";

  const toggleTheme = () => {
    dispatch(saveTheme(isDark ? "light" : "dark"));
  };

  const handleLogout = async () => {
    await clearCredentials();
    navigation.replace("Login");
  };

  return (
    <Layout>
      <View style={[styles.setting_container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.setting_title, { color: themeColors.text }]}>Settings</Text>

        {/* Dark Theme Toggle in one line */}
        <View
          style={[
            styles.setting_toggleRow,
            { borderColor: themeColors.border, borderWidth: 1, borderRadius: 8, padding: 10 },
          ]}
        >
          <Text style={[styles.setting_toggleLabel, { color: themeColors.text }]}>Dark Theme</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.setting_button, { backgroundColor: themeColors.buttonBackground }]}
        >
          <Text style={[styles.setting_buttonText, { color: themeColors.buttonText }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default SettingsScreen;
