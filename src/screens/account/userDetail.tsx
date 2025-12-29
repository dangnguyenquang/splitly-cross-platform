import MaterialIcons from '@react-native-vector-icons/material-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { uploadUserImage } from '@/src/api/upload.user.api';
import { updateUser } from '@/src/api/user.api';
import CustomButton from '@/src/components/CustomButton';
import InputField from '@/src/components/InputField';
import { setUser } from '@/src/store/authSlice';
import { RootState } from '@/src/store/store';
import { PersonalInfo, RootStackParamList } from '@/src/types';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeader from '../../components/header/index';

const defaultAvatar = 'https://i.pravatar.cc/150';

type PersonalInfoRouteProp = RouteProp<
  RootStackParamList,
  'PersonalInfoDetail'
>;

export default function PersonalInfoScreen({ navigation }: any) {
  const route = useRoute<PersonalInfoRouteProp>();
  const dispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.login.currentUser?.token,
  );
  const user = route.params?.personalInfo;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<PersonalInfo>({
    userId: user?.userId.toString() || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    userImage: user?.userImage || '',
  });

  const handleChange = (key: keyof PersonalInfo, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePickAvatar = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', 'Failed to pick image');
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    // Immediately update UI
    setForm(prev => ({ ...prev, userImage: uri }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let uploadedImageUrl = form.userImage;

      // Only upload if new local image (file://)
      if (form.userImage && form.userImage.startsWith('file://')) {
        uploadedImageUrl = await uploadUserImage(form.userImage, token!);
      }

      // Update form with final uploaded URL
      const updatedForm = { ...form, userImage: uploadedImageUrl };

      await updateUser(updatedForm, token!);

      // Update Redux
      dispatch(
        setUser({
          ...user!,
          fullName: updatedForm.fullName,
          email: updatedForm.email,
          phone: updatedForm.phone,
          gender: updatedForm.gender,
          userImage: updatedForm.userImage,
        }),
      );

      Alert.alert('Success', 'Personal information updated');
    } catch (error) {
      Alert.alert('Error', 'Update failed');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title="Personal Info"
        leftIcon={{
          type: "icon",
          component: MaterialIcons,
          name: 'arrow-back',
          size: 24,
          color: '#070707',
        }}
        onLeftPress={() => navigation.goBack()}
        backgroundColor="#fff"
        titleColor="#070707"
        shadow
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePickAvatar}
            activeOpacity={0.8}
          >
            <FastImage
              style={styles.avatar}
              source={{ uri: form.userImage || defaultAvatar }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.cameraIcon}>
              <MaterialIcons name="camera-alt" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <InputField
            label="Full Name"
            value={form.fullName}
            onChangeText={v => handleChange('fullName', v)}
          />
          <InputField
            label="Email"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
          />
          <InputField
            label="Phone Number"
            value={form.phone}
            onChangeText={v => handleChange('phone', v)}
          />
          <InputField
            label="Gender"
            value={form.gender}
            onChangeText={v => handleChange('gender', v)}
          />

          {/* Save Button */}
          <View style={styles.saveWrapper}>
            <CustomButton
              title={loading ? 'Saving...' : 'Save'}
              onPress={handleSave}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------------------- STYLES ---------------------------- */
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120 / 2 - 18,
    backgroundColor: '#000',
    padding: 6,
    borderRadius: 18,
  },
  saveWrapper: {
    marginTop: 30,
    alignItems: 'center',
  },
});
