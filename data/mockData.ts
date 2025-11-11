// src/data/mockData.ts
import { Contact, Group, CategoryOption } from '../types';

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Lucian Nguyen',
    email: 'alexia.hershey@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=45',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.w@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david.park@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=51',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.a@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    title: 'Trip to France',
    description: 'Holiday with old school friends',
    currency: 'USD',
    category: 'Trip',
    participants: mockContacts.slice(0, 6),
  },
  {
    id: '2',
    title: 'Trip to America',
    description: 'Holiday with old school friends',
    currency: 'USD',
    category: 'Trip',
    participants: mockContacts.slice(0, 6),
  },
];

export const categories: CategoryOption[] = [
  { label: 'Trip', icon: '✈️' },
  { label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { label: 'Couple', icon: '👫' },
  { label: 'Event', icon: '📅' },
  { label: 'Project', icon: '📦' },
  { label: 'Other', icon: '🧩' },
];
