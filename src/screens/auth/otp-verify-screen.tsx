// screen
import { View, Text } from 'react-native';
import OtpInputs from '../../components/auth/otp-input';
import CustomButton from '../../components/CustomButton';
import { Countdown } from '../../components/auth/count-down';
import { useState, useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { verifyOTP } from '../../api/auth.api';
type OTPRoute = RouteProp<RootStackParamList, 'OTP'>;
export default function OTPSreen() {
  const INITIAL = 30;
  const [canResend, setCanResend] = useState(false);
  const [seed, setSeed] = useState(0);
  const [otp, setOtp] = useState('');
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { params } = useRoute<OTPRoute>();
  
  const handleResend = useCallback(() => {
    setCanResend(false);
    setSeed(s => s + 1);
  }, []);

  const handleVerify = async () => {
    try {
      if (params) {
        const res = verifyOTP(otp, params.email, navigation);
        console.log('res: ', res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="w-screen h-full p-10">
      <View className="flex-row gap-10 items-center mt-10">
        <Text className="text-3xl font-semibold">OTP code verification</Text>
      </View>

      <Text className="text-lg font-normal my-10">
        We have sent an OTP code to email {params?.email}. Enter the code below
        to verify.
      </Text>

      <OtpInputs length={6} value={otp} onChangeCode={setOtp} />

      <View className="items-center">
        <Text className="text-xl">Didn’t receive email?</Text>

        {canResend ? (
          <View className="w-screen items-center">
            <CustomButton title="Resend" onPress={handleResend} />
          </View>
        ) : (
          <Text className="text-xl">
            You can resend code in{' '}
            <Countdown
              key={seed}
              seconds={INITIAL}
              onComplete={() => setCanResend(true)}
            />
          </Text>
        )}
      </View>

      <View className="flex-1 justify-end w-screen">
        <CustomButton title="Verify" onPress={handleVerify} />
      </View>
    </View>
  );
}
