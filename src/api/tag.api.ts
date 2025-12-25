import { response } from '../service/axios';

export interface Tag {
  tagId: number;
  tagName: string;
  deleted: boolean;
}

export const getTags = async (token: string): Promise<Tag[]> => {
  try {
    const res = await response.get('/tag', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? [];
  } catch (err) {
    console.error('Error fetching tags:', err);
    return [];
  }
};
