// src/data/mockData.ts
import { Contact, Group, CategoryOption } from '@/src/types';

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Lucian Nguyen',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'locvuive@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=45',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'carol@example.com',
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
    title: 'Trip to France',
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


export const mockGroups2: Group[] = [
  // {
  //   id: 'g1',
  //   title: 'Weekend Getaways',
  //   description: 'Plan weekend trips with friends.',
  //   coverImage: 'https://example.com/images/weekend.jpg',
  //   currency: 'USD',
  //   category: 'Travel',
  //   participants: [
  //     {
  //       id: 'c1',
  //       name: 'Alice Johnson',
  //       email: 'alice@example.com',
  //       avatar: 'https://example.com/avatars/alice.jpg',
  //       isFavorite: true,
  //     },
  //     {
  //       id: 'c2',
  //       name: 'Bob Smith',
  //       email: 'bob@example.com',
  //       avatar: 'https://example.com/avatars/bob.jpg',
  //     },
  //   ],
  // },
  // {
  //   id: 'g2',
  //   title: 'Family Expenses',
  //   description: 'Track monthly family expenses together.',
  //   coverImage: 'https://example.com/images/family.jpg',
  //   currency: 'EUR',
  //   category: 'Finance',
  //   participants: [
  //     {
  //       id: 'c3',
  //       name: 'Charlie Brown',
  //       email: 'charlie@example.com',
  //       avatar: 'https://example.com/avatars/charlie.jpg',
  //       isFavorite: false,
  //     },
  //     {
  //       id: 'c4',
  //       name: 'Dana White',
  //       email: 'dana@example.com',
  //       avatar: 'https://example.com/avatars/dana.jpg',
  //     },
  //   ],
  // },
  // {
  //   id: 'g3',
  //   title: 'Book Club',
  //   description: 'Monthly book discussion group.',
  //   currency: 'GBP',
  //   category: 'Education',
  //   participants: [
  //     {
  //       id: 'c5',
  //       name: 'Eve Adams',
  //       email: 'eve@example.com',
  //       avatar: 'https://example.com/avatars/eve.jpg',
  //     },
  //     {
  //       id: 'c6',
  //       name: 'Frank Miller',
  //       email: 'frank@example.com',
  //       avatar: 'https://example.com/avatars/frank.jpg',
  //       isFavorite: true,
  //     },
  //   ],
  // },
  // {
  //   id: 'g4',
  //   title: 'Startup Team',
  //   description: 'Collaboration for our new startup projects.',
  //   coverImage: 'https://example.com/images/startup.jpg',
  //   currency: 'USD',
  //   category: 'Business',
  //   participants: [
  //     {
  //       id: 'c7',
  //       name: 'Grace Hopper',
  //       email: 'grace@example.com',
  //       avatar: 'https://example.com/avatars/grace.jpg',
  //     },
  //     {
  //       id: 'c8',
  //       name: 'Henry Ford',
  //       email: 'henry@example.com',
  //       avatar: 'https://example.com/avatars/henry.jpg',
  //     },
  //   ],
  // },
];
