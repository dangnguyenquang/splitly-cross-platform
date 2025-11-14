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
}

export type Group = GroupBasicInformation & {
  participants?: Contact[];
}

export type CategoryType = 'Trip' | 'Family' | 'Couple' | 'Event' | 'Project' | 'Other';

export interface CategoryOption {
  label: CategoryType;
  icon: string;
}