import { PhotoFile } from "react-native-vision-camera";
import { Asset } from "react-native-image-picker";
import axios from "axios";
import { response } from "@/src/service/axios";

export const postBillOcr = async (imageInput: PhotoFile | Asset) => {
  try {
    const formData = new FormData();

    let fileConfig = {
      uri: '',
      name: 'bill-image.jpg',
      type: 'image/jpeg'
    };

    if ('path' in imageInput) {
      // react-native-vision-camera
      fileConfig.uri = `file://${imageInput.path}`;
      fileConfig.name = imageInput.path.split('/').pop() || 'camera-photo.jpg';
    } else {
      // Asset: uri, fileName, type
      fileConfig.uri = imageInput.uri || '';
      fileConfig.name = imageInput.fileName || 'gallery-photo.jpg';
      fileConfig.type = imageInput.type || 'image/jpeg';
    }

    if (!fileConfig.uri) throw new Error("Không tìm thấy đường dẫn ảnh");

    formData.append('images', {
      uri: fileConfig.uri,
      name: fileConfig.name,
      type: fileConfig.type,
    } as any);

    const res = await response.post('/bills/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, 
    });

    return res;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("OCR Error Details:", err.response?.data);
      throw err;
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
};