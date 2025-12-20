import { View, Text } from 'react-native';
import OtpInputs from '@/src/components/auth/OtpInput';
import CustomButton from '@/src/components/CustomButton';
import { Countdown } from '@/src/components/auth/CountDown';
import { useState, useCallback, useEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { resendOTP, verifyOTP, verifyResetPassword } from '@/src/api/auth.api';
import axios from 'axios';
import LoadingModal from '@/src/components/LoadingModal';

type OTPRoute = RouteProp<RootStackParamList, 'OTP'>;

function hideEmail(email: string, keepStart = 2, keepEnd = 1) {
  if (!email || !email.includes('@')) return email;

  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  if (local.length <= keepStart + keepEnd) return email;

  const masked =
    local.slice(0, keepStart) +
    '*'.repeat(local.length - keepStart - keepEnd) +
    local.slice(-keepEnd);

  return `${masked}@${domain}`;
}

export default function OTPSreen() {
  const INITIAL = 180;
  const [canResend, setCanResend] = useState(false);
  const [seed, setSeed] = useState(0);

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<OTPRoute>();

  useEffect(() => {
    // user sửa OTP thì xoá lỗi
    if (otpError) setOtpError(undefined);
  }, [otp]);

  const handleResend = useCallback(async () => {
    try {
      await resendOTP(params.email);
      setCanResend(false);
      setSeed(s => s + 1);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
        setOtpError(error.response?.data.message);
      }
    }
  }, []);

  const handleVerify = async () => {
    if (!params?.email) {
      setOtpError('Missing email for OTP verification.');
      return;
    }
    if (otp.length !== 6) {
      setOtpError('Please enter the 6-digit code.');
      return;
    }

    try {
      setIsLoading(true);
      setSubmitting(true);
      setOtpError(undefined);
      console.log('start');
      if (params.type === 'reset') {
        await verifyResetPassword(otp, params.email, navigation);
      } else {
        await verifyOTP(otp, params.email, navigation);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log(params.email);
        setOtpError(e.response?.data.message);
      }
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <View className="w-screen h-full p-10">
      <View className="flex-row gap-10 items-center mt-10">
        <Text className="text-3xl font-semibold">OTP code verification</Text>
      </View>

      <Text className="text-lg font-normal my-10">
        We have sent an OTP code to email {hideEmail(params.email, 3, 1)}. Enter
        the code below to verify.
      </Text>

      <OtpInputs
        length={6}
        value={otp}
        onChangeCode={setOtp}
        errorMessage={otpError}
        onComplete={() => {
          // optional: auto-verify khi đủ 6 số
          // handleVerify();
        }}
      />

      <View className="items-center">
        <Text className="text-xl">Didn’t receive email?</Text>

        {canResend ? (
          <CustomButton title="Resend" onPress={handleResend} />
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
        <CustomButton
          title={submitting ? 'Verifying...' : 'Verify'}
          onPress={handleVerify}
          // nếu CustomButton có prop disabled thì bật:
          // disabled={submitting || otp.length !== 6}
        />
      </View>
      {isLoading && (
        <LoadingModal
          isLoading={isLoading}
          title="Verify Successful!"
          messageLine1="You will be directed to the"
          messageLine2={`${params.type === 'reset' ? 'New Password' : 'Sign In'} Screen.`}
          iconName="user"
        />
      )}
    </View>
  );
}
