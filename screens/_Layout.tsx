// components/Layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { colors } from "../theme/colors";
import Footer from "../components/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeColors = colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Header />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});