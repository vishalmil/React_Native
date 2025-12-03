import { View, StyleSheet, TextInput, ActivityIndicator, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;  

  const signIn = async () => {
    setLoading(true);
    try{
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.replace('Home');
    }
    catch(error: any){
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
    finally{
      setLoading(false);
    }
  }

  const signUp = async () =>{
    try{
      navigation.replace('Signup');
    }
    catch(error: any){
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  }
  
  
  return (
    <View style={styles.container}>
       <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (<ActivityIndicator size='large' color="#0000ff"/>
      ):(
      <View style={styles.buttonContainer}>
        <Button title='Login' onPress={signIn }/>
         <View style={styles.signUpButton}>
        <Button title='Create Account' onPress={ signUp }/>
        </View>
      </View>
      )}
    </View>
      
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  signUpButton: {
    marginTop: 10,
  },
    resetText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});