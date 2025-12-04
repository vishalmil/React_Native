// screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, Platform, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getCredentials } from '../utils/storage';
import { styles } from '../styles/styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // animated values
  const scale = useRef(new Animated.Value(0.75)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // animate: scale up & fade in, then small bounce loop, total ~2.2s
    const inAnim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]);

    const pulse = Animated.sequence([
      Animated.timing(scale, { toValue: 1.05, duration: 350, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      Animated.timing(scale, { toValue: 1.0, duration: 300, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
    ]);

    // run entry animation, then a pulse once, then check auth and navigate
    Animated.sequence([inAnim, pulse]).start(() => {
      proceedAfterAnimation();
    });

    // fallback timeout in case auth check is slow or animation didn't complete
    const fallback = setTimeout(() => proceedAfterAnimation(), 3000);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proceedAfterAnimation = async () => {
    try {
      const creds = await getCredentials();
      if (creds && (creds.username || creds.email)) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        return;
      }

      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      // on error, go to Login
      console.error('Splash auth check error:', err);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  // logo asset fallback: local first, remote fallback
  let logoSource;
  try {
    logoSource = require('../assets/Mybook.png');
  } catch {
    logoSource = { uri: 'https://img.icons8.com/fluency/240/000000/book.png' };
  }

  return (
    <View style={styles.splash_container}>
      <Animated.View style={[styles.splash_logoWrap, { opacity, transform: [{ scale }] }]}>
        <Image source={logoSource} style={styles.splash_logo} resizeMode="contain" />
      </Animated.View>

      {/* subtitle + loader */}
      <Text style={styles.splash_appName}>My Books</Text>
      <ActivityIndicator size="small" color="#888" style={{ marginTop: 12 }} />
    </View>
  );
};

export default SplashScreen;