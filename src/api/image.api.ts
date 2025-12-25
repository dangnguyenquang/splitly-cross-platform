import { response } from '../service/axios';

export const uploadGroupImage = async (
  imageUri: string,
  token: string,
  groupId: string,
) => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: `group-${groupId}.jpg`,
    type: 'image/jpeg',
  } as any);

  const res = await response.post(
    `/groups/upload-avatar/groups/${groupId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 15000,
    },
  );

  return res.data;
};
