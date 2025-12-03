// App.tsx
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import store, { AppDispatch } from "./store/store";
import { loadTheme } from "./store/themeSlice";

import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { RootStackParamList } from "./types/navigation";
import SearchScreen from "./screens/SearchScreen";
import SplashScreen from "./screens/SplashScreen";

const Drawer = createNativeStackNavigator<RootStackParamList>();

// Wrapper to preload settings
const AppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Splash" component={SplashScreen} />
        <Drawer.Screen name="Signup" component={SignupScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Search" component={SearchScreen}/>

      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}