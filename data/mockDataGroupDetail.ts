import { GroupDetailInformation, Contact, Expense } from '@/types';

// Participants
const participants: Contact[] = [
  {
    id: 'u1',
    name: 'Alice',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/100?img=1',
    isFavorite: true,
  },
  {
    id: 'u2',
    name: 'Bob',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/100?img=2',
  },
  {
    id: 'u3',
    name: 'Charlie',
    email: 'charlie@example.com',
    avatar: 'https://i.pravatar.cc/100?img=3',
    isFavorite: false,
  },
];

// Expenses
const expenses: Expense[] = [
  {
    id: '1',
    expenseType: 'Trip',
    title: 'Lunch',
    paidBy: 'Alice',
    amount: '2500000',
    dateTime: new Date('2025-11-11'),
  },
  {
    id: '2',
    expenseType: 'Project',
    title: 'Taxi',
    paidBy: 'Bob',
    amount: '40000000',
    dateTime: new Date('2025-11-12'),
  },
  {
    id: '3',
    expenseType: 'Couple',
    title: 'Hotel',
    paidBy: 'Charlie',
    amount: '100000',
    dateTime: new Date('2025-11-10'),
  },
  {
    id: '4',
    expenseType: 'Event',
    title: 'Museum tickets',
    paidBy: 'Alice',
    amount: '300000',
    dateTime: new Date('2025-11-11'),
  },
  {
    id: '5',
    expenseType: 'Trip',
    title: 'Lunch',
    paidBy: 'Alice',
    amount: '2500000',
    dateTime: new Date('2025-11-11'),
  },
  {
    id: '6',
    expenseType: 'Project',
    title: 'Taxi',
    paidBy: 'Bob',
    amount: '400000',
    dateTime: new Date('2025-11-12'),
  },
  {
    id: '7',
    expenseType: 'Couple',
    title: 'Hotel',
    paidBy: 'Charlie',
    amount: '1500000',
    dateTime: new Date('2025-11-10'),
  },
  {
    id: '8',
    expenseType: 'Event',
    title: 'Museum tickets',
    paidBy: 'Alice',
    amount: '30000000',
    dateTime: new Date('2025-11-11'),
  },
];

// GroupDetail
export const mockGroupDetail: GroupDetailInformation = {
  id: 'g1',
  title: 'Weekend Trip',
  description: 'A fun weekend trip to the mountains with friends',
  coverImage: 'https://picsum.photos/400/200',
  currency: 'VND',
  category: 'Trip',
  participants,
  expenses,
};
