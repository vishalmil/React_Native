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
import * as ImagePicker from 'expo-image-picker';
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
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

      // upload image if changed and is a local uri (starts with file:// or http(s) but not already a storage url)
      // let imageUrl = originalData?.imageUrl ?? null;
      // const isLocalUri = image && !(image?.startsWith('https://firebasestorage.googleapis.com') || image?.startsWith('http'));
      // const changedImage = image !== (originalData?.imageUrl ?? originalData?.image ?? null);

      // if (image && changedImage && isLocalUri) {
      //   imageUrl = await uploadImageToFirebase(image, uid);
      // } else if (changedImage && image && !isLocalUri) {
      //   // user pasted/used an http url — accept as is
      //   imageUrl = image;
      // }

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
        <View style={[styles.center, { backgroundColor: themeColors.background }]}>
          <ActivityIndicator size="large" />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.heading, { color: themeColors.text }]}>My Profile</Text>

        {/* <TouchableOpacity onPress={pickImage} onLongPress={takePhoto}>
          <Image
            source={image ? { uri: image } : require('../assets/avatars/avatar_Male.png')}
            style={styles.avatar}
          />
        </TouchableOpacity> */}
        <Text style={[styles.hint, { color: themeColors.placeholder }]}>
          Tap to choose from Gallery, Long press to take Photo
        </Text>

        {/* Username */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.floatingLabel, (username ? styles.labelFloat : {}), { color: themeColors.placeholder }]}>
            Username
          </Text>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={themeColors.placeholder}
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.floatingLabel, (email ? styles.labelFloat : {}), { color: themeColors.placeholder }]}>
            Email
          </Text>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={themeColors.placeholder}
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.floatingLabel, (password ? styles.labelFloat : {}), { color: themeColors.placeholder }]}>
            Password
          </Text>
          <View style={[styles.passwordContainer, { borderColor: themeColors.border }]}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, color: themeColors.text }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              placeholder="Password"
              placeholderTextColor={themeColors.placeholder}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={{ padding: 8 }}>
              <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color={themeColors.placeholder} />
            </TouchableOpacity>
          </View>
        </View>

        {/* DOB */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.floatingLabel, (dob ? styles.labelFloat : {}), { color: themeColors.placeholder }]}>
            Date of Birth
          </Text>
          <TouchableOpacity style={[styles.input, { borderColor: themeColors.border }]} onPress={() => setShowPicker(true)}>
            <Text style={{ color: dob ? themeColors.text : themeColors.placeholder }}>
              {dob ? dob.toDateString() : 'Select Date of Birth'}
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
        <View style={styles.inputWrapper}>
          <Text style={[styles.floatingLabel, (gender ? styles.labelFloat : {}), { color: themeColors.placeholder }]}>
            Gender
          </Text>
          <View style={[styles.pickerContainer, { borderColor: themeColors.border }]}>
            <Picker selectedValue={gender} onValueChange={(v) => setGender(v as any)} style={{ color: themeColors.text }}>
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Update button */}
        {isChanged() && (
          <TouchableOpacity onPress={handleUpdate} style={[styles.updateButton, { backgroundColor: themeColors.buttonBackground }]}>
            <Text style={[styles.updateButtonText, { color: themeColors.buttonText }]}>Update Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, backgroundColor: '#ddd' },
  hint: { fontSize: 12, marginBottom: 20, textAlign: 'center' },

  inputWrapper: { width: '100%', marginBottom: 18, position: 'relative' },
  floatingLabel: {
    position: 'absolute',
    left: 10,
    top: 14,
    fontSize: 14,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  labelFloat: {
    top: -10,
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingTop: 18,
    fontSize: 16,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingRight: 8,
    paddingLeft: 6,
    width: '100%',
  },
  pickerContainer: { borderWidth: 1, borderRadius: 8, overflow: 'hidden', width: '100%' },
  updateButton: { marginTop: 10, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  updateButtonText: { fontWeight: '600', fontSize: 16, textAlign: 'center' },
});


























// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { getCredentials, saveCredentials, UserCreds } from '../utils/storage';
// import Layout from './_Layout';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { Ionicons } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { colors } from '../theme/colors';
// import { validateEmail } from '../utils/validation';

// const ProfileScreen: React.FC = () => {
//   const theme = useSelector((state: RootState) => state.theme.theme);
//   const themeColors = colors[theme];

//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [image, setImage] = useState<string | null>(null);
//   const [dob, setDob] = useState<Date | null>(null);
//   const [showPicker, setShowPicker] = useState(false);
//   const [originalData, setOriginalData] = useState<any>(null);
//   const [secureText, setSecureText] = useState(true);
//   const [gender, setGender] = useState('Male');

//   useEffect(() => {
//     const loadUser = async () => {
//       const storedCreds = await getCredentials();
//       if (storedCreds) {
//         setUsername(storedCreds.username);
//         setEmail(storedCreds.email);
//         setPassword(storedCreds.password);
//         setImage((storedCreds as any).image ?? null);
//         setDob((storedCreds as any).dob ? new Date((storedCreds as any).dob) : new Date);
//         setGender((storedCreds as any).gender ?? 'Male');
//         setOriginalData(storedCreds);
//       }
//     };
//     loadUser();
//   }, []);

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert('Permission required', 'We need gallery access to select an image.');
//       return;
//     }

//      if(!validateEmail(email)){
//       Alert.alert('Invalid Email', 'Please enter valid email');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });
//     if (!result.canceled) setImage(result.assets[0].uri);
//   };

//   const takePhoto = async () => {
//     const permission = await ImagePicker.requestCameraPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert('Permission required', 'We need camera access to take a photo.');
//       return;
//     }
//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });
//     if (!result.canceled) setImage(result.assets[0].uri);
//   };

//   const handleUpdate = async () => {
//     if (!username.trim() || !email.trim() || !password.trim() || !dob || !gender) {
//       Alert.alert('Validation Error', 'All fields are required!');
//       return;
//     }

//   const updatedCreds: UserCreds & { image?: string } = {
//      username, email, password, image: image ?? undefined, dob: dob.toISOString(), gender,
//     };
//     await saveCredentials(updatedCreds);
//     Alert.alert('Success', 'Profile updated successfully!');
//   };

//   const onChangeDate = (event: any, selectedDate?: Date) => {
//     setShowPicker(Platform.OS === 'ios');
//     if (selectedDate) setDob(selectedDate);
//   };

//   const isChanged = () => {
//     if (!originalData) return false;
//     return (
//       username !== originalData.username ||
//       email !== originalData.email ||
//       password !== originalData.password ||
//       image !== (originalData.image ?? null) ||
//       (dob ? dob.toISOString() : null) !== (originalData.dob ?? null) ||
//       gender !== originalData.gender
//     );
//   };

//   return (
//     <Layout>
//       <View style={[styles.container, { backgroundColor: themeColors.background }]}>
//         <Text style={[styles.heading, { color: themeColors.text }]}>My Profile</Text>

//         {/* Avatar */}
//         <TouchableOpacity onPress={pickImage} onLongPress={takePhoto}>
//           <Image source={image ? { uri: image } : require('../assets/avatars/avatar_Male.png')} style={styles.avatar} />
//         </TouchableOpacity>
//         <Text style={[styles.hint, { color: themeColors.placeholder }]}> Tap to choose from Gallery, Long press to take Photo </Text>

//         {/* Floating Inputs */}
//         {/** Username */}
//         <View style={styles.inputWrapper}>
//           <Text style={[ styles.floatingLabel, { color: themeColors.placeholder }, username ? { top: -10, fontSize: 12, backgroundColor: themeColors.background } : {}, ]}>Username</Text>
//           <TextInput style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]} placeholder="Username" placeholderTextColor={themeColors.placeholder} value={username} onChangeText={setUsername} />
//         </View>

//         {/** Email */}
//         <View style={styles.inputWrapper}>
//           <Text style={[ styles.floatingLabel, { color: themeColors.placeholder }, email ? { top: -10, fontSize: 12, backgroundColor: themeColors.background } : {}, ]}>Email</Text>
//           <TextInput style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]} placeholder="Email" placeholderTextColor={themeColors.placeholder} keyboardType="email-address" value={email} onChangeText={setEmail} />
//         </View>

//         {/** Password */}
//         <View style={styles.inputWrapper}>
//           <Text style={[ styles.floatingLabel, { color: themeColors.placeholder }, password ? { top: -10, fontSize: 12, backgroundColor: themeColors.background } : {}, ]}>Password</Text>
//           <View style={[styles.passwordContainer, { borderColor: themeColors.border }]}>
//             <TextInput style={[styles.input, { flex: 1, marginBottom: 0, color: themeColors.text }]} placeholder="Password" placeholderTextColor={themeColors.placeholder} secureTextEntry={secureText} value={password} onChangeText={setPassword} />
//             <TouchableOpacity onPress={() => setSecureText(!secureText)}>
//               <Ionicons name={secureText ? 'eye-off' : 'eye'} size={24} color={themeColors.placeholder} style={{ marginLeft: 10 }} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/** Date of Birth */}
//         <View style={styles.inputWrapper}>
//           <Text style={[ styles.floatingLabel, { color: themeColors.placeholder }, dob ? { top: -10, fontSize: 12, backgroundColor: themeColors.background } : {}, ]}>Date of Birth</Text>
//           <TouchableOpacity style={[styles.input, { borderColor: themeColors.border }]} onPress={() => setShowPicker(true)}>
//             <Text style={{ color: dob ? themeColors.text : themeColors.placeholder }}> {dob ? dob.toDateString() : 'Select Date of Birth'} </Text>
//           </TouchableOpacity>
//           {showPicker && (
//             <DateTimePicker
//               value={dob || new Date(2000, 0, 1)}
//               mode="date"
//               display="default"
//               maximumDate={new Date()}
//               onChange={onChangeDate}
//             />
//           )}
//         </View>

//         {/** Gender */}
//         <View style={styles.inputWrapper}>
//           <Text style={[ styles.floatingLabel, { color: themeColors.placeholder }, gender ? { top: -10, fontSize: 12, backgroundColor: themeColors.background } : {}, ]}>Gender</Text>
//           <View style={[styles.pickerContainer, { borderColor: themeColors.border }]}>
//             <Picker selectedValue={gender} onValueChange={setGender} style={{ color: themeColors.text }} >
//               <Picker.Item label="Male" value="Male" />
//               <Picker.Item label="Female" value="Female" />
//               <Picker.Item label="Other" value="Other" />
//             </Picker>
//           </View>
//         </View>

//         {isChanged() && (
//           <TouchableOpacity style={[styles.updateButton, { backgroundColor: themeColors.buttonBackground }]}>
//             <Text style={[styles.updateButtonText, { color: themeColors.buttonText }]} onPress={handleUpdate}> Update Profile </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </Layout>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, alignItems: 'center' },
//   heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, backgroundColor: '#ddd' },
//   hint: { fontSize: 12, marginBottom: 20 },

//   inputWrapper: { width: '100%', marginBottom: 15, position: 'relative' },
//   floatingLabel: { position: 'absolute', left: 10, top: 12, fontSize: 14, backgroundColor: '#fff', paddingHorizontal: 4, zIndex: 1, },
//   input: { borderWidth: 1, borderRadius: 8, padding: 12, paddingTop: 18, fontSize: 16, },
//   passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', borderWidth: 1, borderRadius: 8, paddingRight: 10 },
//   pickerContainer: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
//   updateButton: { marginTop: 10, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
//   updateButtonText: { fontWeight: '600', fontSize: 16, textAlign: 'center' },
// });