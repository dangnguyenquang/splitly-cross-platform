import { response } from '../service/axios';

export const uploadUserImage = async (imageUri: string, token: string) => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: `user-${imageUri.split('/').pop()}`,
    type: 'image/png',
  } as any);

  const res = await response.post(`/users/upload-avatar/users`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 15000,
  });

  return res.data;
};
