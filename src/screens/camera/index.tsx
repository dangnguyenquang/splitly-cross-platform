import { postBillOcr } from '@/src/api/invoice.api';
import ErrorModal from '@/src/components/modal/ErrorModal';
import LoadingOverlay from '@/src/components/modal/LoadingOverlay';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import CustomHeader from '../../components/header/index';
import { Navigation } from '@/src/types';

interface QRScannerScreenProps {
  // Callback khi scan được QR code
  onQRScanned?: (data: string) => void;
  // Callback khi chụp bill
  onBillCaptured?: (photo: PhotoFile) => void;
}

export default function QRScannerScreen({
  onQRScanned,
  onBillCaptured,
}: Readonly<QRScannerScreenProps>) {
  const [hasScanned, setHasScanned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [scanMode, setScanMode] = useState<'qr' | 'bill'>('qr'); // Toggle giữa QR và Bill mode
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation<Navigation>();
  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsActive(true);
      setHasScanned(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsActive(false);
    });

    return unsubscribe;
  }, [navigation]);

  const checkPermission = async () => {
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to scan QR codes. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      // Chỉ scan QR khi đang ở QR mode
      if (!hasScanned && codes.length > 0 && scanMode === 'qr') {
        setHasScanned(true);
        const value = codes[0].value;
        handleQRCodeScanned(value);
      }
    },
  });

  const handleQRCodeScanned = (data: string | undefined) => {
    if (!data) return;

    console.log('QR Code scanned:', data);

    // Callback nếu có
    if (onQRScanned) {
      onQRScanned(data);
      navigation.goBack();
      return;
    }

    // Default behavior
    Alert.alert('QR Code Scanned', data, [
      {
        text: 'OK',
        onPress: () => {
          setHasScanned(false);
        },
      },
    ]);
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      // Chụp ảnh
      const photo = await cameraRef.current.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });

      console.log('Photo captured:', photo.path);

      if (scanMode === 'qr') {
        // Xử lý QR từ ảnh
        await processImageForQR(photo);
      } else {
        // Xử lý Bill - nhảy tới modal create payment
        await processBillImage(photo);
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const processImageForQR = async (photo: PhotoFile) => {
    // TODO: Implement QR detection từ ảnh
    // Có thể dùng: @react-native-ml-kit/barcode-scanning
    Alert.alert(
      'QR Detection',
      'QR code detection from captured image (to be implemented)',
      [{ text: 'OK', onPress: () => setHasScanned(false) }],
    );
  };

  const processBillImage = async (photo: PhotoFile) => {
    // Callback nếu có
    if (onBillCaptured) {
      onBillCaptured(photo);
      // Navigate hoặc show modal
      return;
    }

    try {
      setIsLoading(true);
      const res = await postBillOcr(photo);
      console.log(res.data);
      if (res.status === 200) {
        navigation.navigate('QuickPayment', {
          bill: res.data,
          billImageUrl: photo.path, 
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('Failed to process bill images.');
        console.log('Err msg: ', error.message);
        console.log('Err response: ', error.response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      const imageUriAsset = result.assets[0];
      console.log('Image selected:', imageUriAsset);

      // Xử lý ảnh từ gallery
      if (scanMode === 'qr') {
        // Detect QR từ ảnh gallery
        Alert.alert('Gallery', 'QR detection from gallery (to be implemented)');
      } else {
        // Xử lý như bill image
        try {
          setIsLoading(true);
          const res = await postBillOcr(imageUriAsset);
          console.log('Bill:', res.data);
          if (res.status === 200) {
            navigation.navigate('QuickPayment', {
              bill: res.data,
              billImageUrl: imageUriAsset.uri,
            });
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setError('Failed to process bill images.');
            console.log('Err msg: ', error.message);
            console.log('Err response: ', error.response);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const toggleMode = () => {
    setScanMode(prev => (prev === 'qr' ? 'bill' : 'qr'));
    setHasScanned(false);
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title="Scan QR Code"
          onLeftPress={() => navigation.goBack()}
          backgroundColor="#1a1d29"
          titleColor="#fff"
        />
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera" size={64} color="#888" />
          <Text style={styles.permissionText}>Camera permission required</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={checkPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title="Scan QR Code"
          onLeftPress={() => navigation.goBack()}
          backgroundColor="#1a1d29"
          titleColor="#fff"
        />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>No camera device found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={scanMode === 'qr' ? codeScanner : undefined}
        photo={true}
      />

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Title and Instructions */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {scanMode === 'qr' ? 'Scan QR Code' : 'Capture Bill'}
        </Text>
        <Text style={styles.instructions}>
          {scanMode === 'qr'
            ? 'Point the camera at the QR Code to scan.'
            : 'Point the camera at the bill and tap capture.'}
        </Text>
      </View>

      {/* QR Frame - chỉ hiện khi QR mode */}
      {scanMode === 'qr' && (
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      )}

      {/* Bill Frame - hiện khi Bill mode */}
      {scanMode === 'bill' && (
        <View style={styles.frameContainer}>
          <View style={styles.billFrame}>
            <MaterialIcons
              name="receipt-long"
              size={80}
              color="rgba(253, 176, 34, 0.5)"
            />
          </View>
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        <SafeAreaView edges={['bottom']} style={styles.controlsContainer}>
          <TouchableOpacity style={styles.sideButton}>
            <View style={styles.sideButtonCircle}>
              {/* Mode Toggle */}
              <TouchableOpacity
                //style={styles.modeToggle}
                onPress={toggleMode}
              >
                <MaterialIcons
                  name={scanMode === 'qr' ? 'qr-code' : 'receipt'}
                  size={24}
                  color="#FDB022"
                />
                {/* <Text style={styles.modeText}>
              {scanMode === 'qr' ? 'QR Mode' : 'Bill Mode'}
            </Text> */}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing && styles.captureButtonDisabled,
            ]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideButton} onPress={handleGallery}>
            <View style={styles.sideButtonCircle}>
              <MaterialIcons name="image" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <LoadingOverlay
        visible={isLoading}
        title="Processing bill"
        messageLine1="Analyzing image"
        messageLine2="Please wait..."
        iconName="receipt-long"
      />

      <ErrorModal
        visible={!!error}
        message={error ?? ''}
        cancelText="Cancel"
        confirmText="Try again"
        onCancel={() => {
          setError(null);
          navigation.goBack();
        }}
        onConfirm={() => setError(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1d29',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#FDB022',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  modeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  titleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructions: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  billFrame: {
    width: 300,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(253, 176, 34, 0.5)',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FDB022',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 40,
  },
  sideButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButtonActive: {
    backgroundColor: '#FDB022',
  },
  modeLabelText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDB022',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});
