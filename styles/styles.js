import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  login_container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  login_input: {
    borderWidth: 1,
    borderColor: '#2c2c2cff',
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

  //HomeScreen
  home_container: {
    padding: 20,
    flex: 1,
  },
  home_offlineText: {
    color: 'red',
    marginBottom: 10,
  },
  home_title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  home_scrollContent: {
    paddingVertical: 10,
  },
  home_loader: {
    marginTop: 20,
  },

  //profile
  floatingLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 14,
    color: '#888',
  },

  labelFloat: {
    top: -10,
    fontSize: 12,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  input: {
    fontSize: 16,
    paddingVertical: 10,
  },

  profile_center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  profile_container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  profile_heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  profile_avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },

  profile_hint: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },

  profile_inputWrapper: {
    width: "100%",
    marginBottom: 18,
    position: "relative",
  },

  profile_floatingLabel: {
    position: "absolute",
    left: 10,
    top: 14,
    fontSize: 14,
    paddingHorizontal: 4,
    zIndex: 1,
  },

  profile_labelFloat: {
    top: -10,
    fontSize: 12,
    backgroundColor: "transparent",
  },

  profile_input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingTop: 18,
    fontSize: 16,
    width: "100%",
  },

  profile_passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingRight: 25,
    width: "100%",
  },

  profile_pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },

  profile_updateButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  profile_updateButtonText: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },

  //search
  search_container: { padding: 20, flexGrow: 1 },
  search_title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  search_searchRow: { flexDirection: 'row', alignItems: 'center' },
  search_input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, marginRight: 10 },
  search_button: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },

  //setting
  setting_container: {
    flex: 1,
    padding: 20,
  },
  setting_title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  setting_toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "transparent",
  },
  setting_toggleLabel: { fontSize: 16, fontWeight: "600" },
  setting_button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  setting_buttonText: { fontSize: 16, fontWeight: "600" },

  //signup
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

  //splash
  splash_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splash_logoWrap: {
    width: 160,
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // subtle shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    // elevation for Android
    elevation: 6,
    backgroundColor: 'transparent',
  },
  splash_logo: {
    width: 140,
    height: 140,
  },
  splash_appName: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  splash_footerText: {
    marginTop: 18,
    fontSize: 12,
    color: '#888',
  },

  //layour
  layout_container: {
    flex: 1,
  },
  layout_content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});