import { categories } from '@/data/mockData';

export const categoryColorMap: Record<string, string> = {
  Trip: '#FF6B6B',
  Family: '#4ECDC4',
  Couple: '#556270',
  Event: '#FFD93D',
  Project: '#6A4C93',
  Other: '#C7F464',
};

export const categoryIconMap: Record<string, string> = categories.reduce(
  (acc, cur) => {
    acc[cur.label] = cur.icon;
    return acc;
  },
  {} as Record<string, string>,
);
