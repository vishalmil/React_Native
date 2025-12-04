// screens/SignupScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { validateEmail } from '../utils/validation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const auth = FIREBASE_AUTH;

  // Validate inputs
  useEffect(() => {
    setUsernameError(username.length < 3 ? 'Username must be at least 3 characters' : '');
    setPasswordError(password.length < 6 ? 'Password must be at least 6 characters' : '');
    // setEmailError(
    //   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : email ? 'Invalid email format' : ''
    // );
    setEmailError(
      validateEmail(email) ? '' : email ? 'Invalid email format' : ''
    );

    setIsValid(
      username.length >= 3 &&
      password.length >= 6 &&
      // /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      validateEmail(email).isValid
    );
  }, [username, password, email]);

  const Login = async () => {

    try {
      navigation.replace('Login');
    }
    catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  }

  const onSignup = async () => {
    if (!isValid) {
      Alert.alert('Validation', 'Please fix errors before signing up.');
      return;
    }

    setLoading(true);
    try {
      //await saveCredentials({ username, email, password, image: null, dob: null, gender: null });
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);

      const uid = response.user.uid;

      // Store user profile inside Firestore
      await setDoc(doc(FIRESTORE_DB, "users", uid), {
        email,
        username: email.split('@')[0],  // or use your username field
        image: null,
        dob: null,
        gender: null,
        createdAt: new Date().toISOString(),
      });


      Alert.alert('Success', 'Account created successfully');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.signup_container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        placeholder="Username"
        style={styles.signup_input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {usernameError ? <Text style={styles.signup_errorText}>{usernameError}</Text> : null}

      <TextInput
        placeholder="Password"
        style={styles.signup_input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {passwordError ? <Text style={styles.signup_errorText}>{passwordError}</Text> : null}

      <TextInput
        placeholder="Email"
        style={styles.signup_input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text style={styles.signup_errorText}>{emailError}</Text> : null}

      <View style={styles.signup_buttonContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Button title="Sign Up" onPress={onSignup} disabled={!isValid} />
        )}
        <Button title='Login' onPress={Login} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  signup_container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  signup_input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  signup_errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  signup_buttonContainer: {
    marginVertical: 15,
  },
});