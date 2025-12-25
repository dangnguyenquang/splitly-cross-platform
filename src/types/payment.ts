interface Category {
  tagId: string;
  tagName: string;
  icon: string;
}

export const STATIC_CATEGORIES: Category[] = [
  { tagId: 'food', tagName: 'Food', icon: '🍔' },
  { tagId: 'travel', tagName: 'Travel', icon: '🚌' },
  { tagId: 'shopping', tagName: 'Shopping', icon: '🛒' },
  { tagId: 'other', tagName: 'Other', icon: '💸' },
];
