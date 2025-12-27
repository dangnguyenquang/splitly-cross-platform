export interface Contact {
  id: number;
  name: string;
  email: string;
  avatar: string;
  isFavorite?: boolean;
  role?: ConnectionRole;
  accepted?: boolean;
}

export type GroupBasicInformation = {
  groupId: number;
  groupName: string;
  description: string;
  groupImage: string;
  currency: string;
  category: string;
};
export interface Expense {
  paymentId: number;
  expenseType: string;
  title: string;
  paidBy: string;
  amount: string;
  dateTime: Date;
}
export type Group = GroupBasicInformation & {
  participants?: Contact[];
};
export interface GroupDetailInformation extends GroupBasicInformation {
  id: number;
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
export interface GroupDetailTopTabsProps {
  groupId: string;
  group?: Group;
}

export type ExpenseType =
  | 'General'
  | 'Games'
  | 'Movies'
  | 'Music'
  | 'Groceries'
  | 'Dining';

export interface ExpenseOption {
  label: ExpenseType;
}

//group api handle
export interface CreateGroupRequest {
  groupName: string;
  description: string;
  category: string;
  currency: string;
  coverImage?: string;
  emailList: string[];
}

export type ConnectionRole = 'REQUESTER' | 'RECEIVER';

export interface Connection {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  role: ConnectionRole;
  accepted: boolean;
}

export interface PaymentResponse {
  status: number;
  message: string;
  data: Payment[];
}

export interface Payment {
  paymentId: number;
  title: string;
  estimatedAmount: number;
  amount: number;
  usedFundAmount: number;
  status: string;
  paymentRequestNote: string;
  items: PaymentItem[];
  consensusPayments: ConsensusPayment[];
  user: {
    userId: number;
    fullName: string;
  };
  tag: {
    tagId: number;
    tagName: string;
    deleted: boolean;
  };
  containUser: boolean;
}

export interface PaymentItem {
  itemId: number;
  itemName: string;
  amount: number;
  quantity: number;
  priceQuotation: number;
}

export interface ConsensusPayment {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  processAccepted: boolean;
  successAccepted: boolean;
}

export interface Category {
  tagId: number; // ⬅ number
  tagName: string;
}
