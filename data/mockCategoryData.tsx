import {
  Film,
  Gamepad2,
  Music,
  ShoppingCart,
  Utensils,
} from 'lucide-react-native';

export const categoryList = [
  {
    id: '1',
    name: 'General',
    icon: <Film size={18} color="#fff" />,
    color: '#6C7A89',
    group: 'General',
  },
  {
    id: '2',
    name: 'Games',
    icon: <Gamepad2 size={18} color="#fff" />,
    color: '#FF7043',
    group: 'Entertainment',
  },
  {
    id: '3',
    name: 'Movies',
    icon: <Film size={18} color="#fff" />,
    color: '#FF7043',
    group: 'Entertainment',
  },
  {
    id: '4',
    name: 'Music',
    icon: <Music size={18} color="#fff" />,
    color: '#FF7043',
    group: 'Entertainment',
  },
  {
    id: '5',
    name: 'Groceries',
    icon: <ShoppingCart size={18} color="#fff" />,
    color: '#4CAF50',
    group: 'Food and Drink',
  },
  {
    id: '6',
    name: 'Dining Out',
    icon: <Utensils size={18} color="#fff" />,
    color: '#4CAF50',
    group: 'Food and Drink',
  },
];
