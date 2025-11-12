// export const categoryColorMap: Record<string, string> = {
//   Trip: '#FF6B6B',
//   Family: '#4ECDC4',
//   Couple: '#556270',
//   Event: '#FFD93D',
//   Project: '#6A4C93',
//   Other: '#C7F464',
// };

// export const categoryIconMap: Record<string, string> = categories.reduce(
//   (acc, cur) => {
//     acc[cur.label] = cur.icon;
//     return acc;
//   },
//   {} as Record<string, string>,
// );
import {
  Film,
  Gamepad2,
  Music,
  ShoppingCart,
  Utensils,
} from 'lucide-react-native';
import { categories, expenseCategory } from '@/data/mockData';
import { JSX } from 'react';

// Updated categoryColorMap
export const categoryColorMap: Record<string, string> = {
  Games: '#FF6B6B',
  Movies: '#FF6B6B',
  Music: '#FF6B6B',

  General: '#556270',

  Groceries: '#4CAF50',
  Dining: '#4CAF50',
};

// Updated categoryIconMap
export const categoryIconMap: Record<string, JSX.Element> =
  expenseCategory.reduce(
    (acc, cur) => {
      switch (cur.label) {
        case 'General':
          acc[cur.label] = <Film size={18} color="#fff" />;
          break;
        case 'Games':
          acc[cur.label] = <Gamepad2 size={18} color="#fff" />;
          break;
        case 'Movies':
          acc[cur.label] = <Film size={18} color="#fff" />;
          break;
        case 'Music':
          acc[cur.label] = <Music size={18} color="#fff" />;
          break;
        case 'Groceries':
          acc[cur.label] = <ShoppingCart size={18} color="#fff" />;
          break;
        case 'Dining':
          acc[cur.label] = <ShoppingCart size={18} color="#fff" />;
          break;
        default:
          acc[cur.label] = <Utensils size={18} color="#fff" />;
          break;
      }
      return acc;
    },
    {} as Record<string, JSX.Element>,
  );
