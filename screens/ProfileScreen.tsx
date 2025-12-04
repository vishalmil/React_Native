// screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Layout from './_Layout';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { colors } from '../theme/colors';
import { validateEmail } from '../utils/validation';
import { getCredentials, saveCredentials, UserCreds } from '../utils/storage';

import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { styles } from '../styles/styles';

const ProfileScreen: React.FC = () => {
  const theme = useSelector((s: RootState) => s.theme.theme);
  const themeColors = colors[theme];

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);
  const [secureText, setSecureText] = useState(true);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [loading, setLoading] = useState(false);

  // Load profile from Firestore (primary) — fallback to local cache if needed
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const uid = FIREBASE_AUTH.currentUser?.uid;
        if (!uid) {
          // Try local cache if not authenticated (rare)
          const cached = await getCredentials();
          if (cached) applyProfileData(cached);
          setLoading(false);
          return;
        }

        const userRef = doc(FIRESTORE_DB, 'users', uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          applyProfileData({
            username: data.name ?? '',
            email: data.email ?? '',
            password: data.password ?? '',
            image: null,
            dob: data.dob ?? null,
            gender: data.gender ?? 'Male',
          });
          setOriginalData({
            name: data.name ?? '',
            email: data.email ?? '',
            password: data.password ?? '',
            imageUrl: null,
            dob: data.dob ?? null,
            gender: data.gender ?? 'Male',
          });
        } else {
          // If no document exists, try local cache
          const cached = await getCredentials();
          if (cached) applyProfileData(cached);
        }
      } catch (err) {
        console.log('Profile load error:', err);
        const cached = await getCredentials();
        if (cached) applyProfileData(cached);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const applyProfileData = (data: any) => {
    setUsername(data.username ?? data.name ?? '');
    setEmail(data.email ?? '');
    setPassword(data.password ?? '');
    setImage(null);
    setDob(data.dob ? new Date(data.dob) : null);
    setGender((data.gender as any) ?? 'Male');
  };

  // Save profile to Firestore (and optionally cache locally)
  const handleUpdate = async () => {
    // basic validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Username, email and password are required.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Validation', 'Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;
      if (!uid) {
        Alert.alert('Not authenticated', 'Please login again.');
        setLoading(false);
        return;
      }

      const payload = {
        name: username,
        email,
        password, // consider not storing plain password in production; here kept for parity with your app
        imageUrl: null,
        dob: dob ? dob.toISOString() : null,
        gender,
        updatedAt: new Date().toISOString(),
      };

      // Ensure document exists (setDoc will create / overwrite; updateDoc requires existence)
      // We use setDoc with merge to avoid removing other fields
      await setDoc(doc(FIRESTORE_DB, 'users', uid), payload, { merge: true });

      // update local cache as convenience (optional)
      const localCache: UserCreds = {
        username,
        email,
        password,
        image: undefined,
        dob: dob ? dob.toISOString() : undefined,
        gender,
      };
      await saveCredentials(localCache);

      setOriginalData({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        imageUrl: null,
        dob: payload.dob,
        gender: payload.gender,
      });

      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err) {
      console.log('Profile update error:', err);
      Alert.alert('Error', 'Failed to update profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event: any, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selected) setDob(selected);
  };

  const isChanged = () => {
    if (!originalData) return true; // no original -> allow save
    return (
      username !== (originalData.name ?? originalData.username ?? '') ||
      email !== (originalData.email ?? '') ||
      password !== (originalData.password ?? '') ||
      gender !== (originalData.gender ?? 'Male') ||
      (dob ? dob.toISOString() : null) !== (originalData.dob ?? null) ||
      (image ?? null) !== (originalData.imageUrl ?? originalData.image ?? null)
    );
  };

  if (loading) {
    return (
      <Layout>
        <View style={[styles.profile_center, { backgroundColor: themeColors.background }]}>
          <ActivityIndicator size="large" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={[styles.profile_container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.profile_heading, { color: themeColors.text }]}>My Profile</Text>

        <Text style={[styles.profile_hint, { color: themeColors.placeholder }]}>
          Tap to choose from Gallery, Long press to take Photo
        </Text>

        {/* Username */}
        <View style={styles.profile_inputWrapper}>
          <Text style={{ color: themeColors.text }}>
            Username
          </Text>
          <TextInput
            style={[styles.profile_input, { color: themeColors.text, borderColor: themeColors.border }]}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View style={styles.profile_inputWrapper}>
          <Text style={{ color: themeColors.text }}>
            Email
          </Text>
          <TextInput
            style={[styles.profile_input, { color: themeColors.text, borderColor: themeColors.border }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.profile_inputWrapper}>
          <Text style={{ color: themeColors.text }}>
            Password
          </Text>
          <TextInput
            style={[styles.profile_input, { color: themeColors.text, borderColor: themeColors.border }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
          />

        </View>

        {/* DOB */}
        <View style={styles.profile_inputWrapper}>
          <Text style={{ color: themeColors.text }}>
            Date of Birth
          </Text>
          <TouchableOpacity style={[styles.profile_input, { borderColor: themeColors.border }]} onPress={() => setShowPicker(true)}>
            <Text style={{ color: dob ? themeColors.text : themeColors.placeholder }}>
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={dob ?? new Date(2000, 0, 1)}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChangeDate}
            />
          )}
        </View>

        {/* Gender */}
        <View style={styles.profile_inputWrapper}>
          <Text style={{ color: themeColors.text }}>
            Gender
          </Text>
          <View style={[styles.profile_pickerContainer, { borderColor: themeColors.border }]}>
            <Picker selectedValue={gender} onValueChange={(v) => setGender(v as any)} style={{ color: themeColors.text }}>
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Update button */}
        {isChanged() && (
          <TouchableOpacity onPress={handleUpdate} style={[styles.profile_updateButton, { backgroundColor: themeColors.buttonBackground }]}>
            <Text style={[styles.profile_updateButtonText, { color: themeColors.buttonText }]}>Update Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
};

export default ProfileScreen;