import { Contact, Group } from '@/src/types';

export interface PersonOption {
  label: string;
  value: string;
  avatar?: string;
  email?: string;
}

export default function constructPeopleOptions(group?: Group): PersonOption[] {
  if (!group?.participants) return [];
  return group.participants.map((p: Contact) => ({
    label: p.name,
    value: p.id,
    avatar: p.avatar,
    email: p.email,
  }));
}
