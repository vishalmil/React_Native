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
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>

        {/* Dark Theme Toggle in one line */}
        <View
          style={[
            styles.toggleRow,
            { borderColor: themeColors.border, borderWidth: 1, borderRadius: 8, padding: 10 },
          ]}
        >
          <Text style={[styles.toggleLabel, { color: themeColors.text }]}>Dark Theme</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.button, { backgroundColor: themeColors.buttonBackground }]}
        >
          <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "transparent",
  },
  toggleLabel: { fontSize: 16, fontWeight: "600" },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});