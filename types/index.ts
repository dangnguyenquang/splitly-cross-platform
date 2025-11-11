// src/types/index.ts

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isFavorite?: boolean;
}

export type GroupBasicInformation = {
  id?: string;
  title: string;
  description: string;
  coverImage?: string;
  currency: string;
  category: string;
};

export type Group = GroupBasicInformation & {
  id: string;
  participants?: Contact[];
};
export interface Expense {
  id: string;
  expenseType: string;
  title: string;
  paidBy: string;
  amount: string;
  dateTime: Date;
}

export interface GroupDetailInformation extends GroupBasicInformation {
  id: string;
  participants?: Contact[];
  expenses?: Expense[];
}
export type CategoryType =
  | 'Trip'
  | 'Family'
  | 'Couple'
  | 'Event'
  | 'Project'
  | 'Other';

export interface CategoryOption {
  label: CategoryType;
  icon: string;
}
