import { View, Text, ScrollView } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { colors } from '../../Constant/theme';
import InputAuth from '../../components/auth/custom-input-auth';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import FooterContent from '../../components/auth/custom-footer-content';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useForm, Controller } from 'react-hook-form';
import { userRegister } from '../../api/auth.api';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
export interface RegisterForm {
  userName: string;
  email: string;
  password: string;
  confirm?: string;
  phoneNumber: string;
  gender?: string;
}
export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirm: '',
      phoneNumber: '',
    },
  });
  const password = watch('password');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const onSubmit = async (data: RegisterForm) => {
    const { confirm, ...register } = data;
    const registerForm = { ...register, gender: 'male' };
    console.log('Form: ', registerForm);
    try {
      const res = await userRegister(dispatch, registerForm, navigation);
      console.log(res);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return (
          err.response?.data || err.message, err.response?.status || 'No status'
        );
      } else {
        return err;
      }
    }
  };
  return (
    <SafeAreaView>
      <ScrollView className="w-screen h-screen-safe px-10">
        <View className="flex-row gap-10 items-center mt-10">
          <Text className="text-3xl font-semibold ">Create an account!</Text>
          <View className="">
            <FontAwesome6
              name="hand-middle-finger"
              size={32}
              iconStyle="solid"
              color={colors.primary}
            />
          </View>
        </View>
        <Text className="text-lg font-normal my-6">
          Please enter email and password to sign up
        </Text>
        <View className="">
          <Controller
            control={control}
            name="userName"
            rules={{
              required: 'Please enter your username',
              maxLength: { value: 100, message: 'Maximum 100 letters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<FontAwesome name="user-o" size={32} />}
                placeholder="Please enter username"
                value={value}
                onChangeText={onChange}
                label="Username"
              />
            )}
          />
          {errors.userName && (
            <Text className="text-red-600">This is required</Text>
          )}
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              maxLength: { value: 100, message: 'Maximum 100 letters' },
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: 'Email is invalid',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="email-outline" size={32} />}
                placeholder="Please enter email"
                value={value}
                onChangeText={onChange}
                label="Email"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-600">{errors.email.message}</Text>
          )}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Please enter your password',
              minLength: { value: 8, message: 'At least 8 letters' },
              validate: {
                hasLetterAndNumber: v =>
                  (/[A-Za-z]/.test(v) && /\d/.test(v)) ||
                  'Password must have number and letter',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="lock-outline" size={32} />}
                placeholder="Please enter password"
                value={value}
                onChangeText={onChange}
                label="Password"
                secure={true}
                hiddenIcon={true}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-600">{errors.password.message}</Text>
          )}
          <Controller
            control={control}
            name="confirm"
            rules={{
              required: 'Please enter your password confirmation',
              validate: {
                matchedPassword: v =>
                  v === password || 'Your confirmation is not correct',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="lock-outline" size={32} />}
                placeholder="Please confirm password"
                value={value!}
                onChangeText={onChange}
                label="Confirm password"
                secure={true}
                hiddenIcon={true}
              />
            )}
          />
          {errors.confirm && (
            <Text className="text-red-600">{errors.confirm.message}</Text>
          )}
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: 'Please enter your phone number',
              minLength: { value: 10, message: 'At least 10 letters' },
              validate: {
                hasNumber: v =>
                  (/\d/.test(v)) ||
                  'Password must have only number',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputAuth
                icon={<MaterialDesignIcons name="phone" size={32} />}
                placeholder="Please enter your phone"
                value={value}
                onChangeText={onChange}
                label="Phone"
              />
            )}
          />
          {errors.phoneNumber && (
            <Text className="text-red-600">This is required</Text>
          )}
        </View>
        <View className="">
          <FooterContent
            text="I agree with Splitly"
            boldText="Term & Policy"
            linkTo="OTP"
          />
        </View>
        <View>
          <FooterContent
            text="Already have an account?"
            boldText="Sign in"
            linkTo="SignIn"
          />
        </View>
        <View className="w-screen flex-1 justify-end py-10">
          <CustomButton title="Sign up" onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
