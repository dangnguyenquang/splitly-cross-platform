import { Group, GroupBasicInformation } from './group';
import { User } from './user';

export type RootStackParamList = {
  Slash: undefined;
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  OTP: { email: string; type: string };
  ResetPassword: undefined;
  NewPassword: { token: string };
  MainApp: {
    screen?: 'Home' | 'Group' | 'Camera' | 'Contact' | 'Account';
  };

  CreateGroup: undefined;
  AddExpense: { groupId: string; group?: Group };
  SelectParticipants: { groupData: GroupBasicInformation };
  GroupDetail: { groupId: string; group?: Group };
  GroupsScreen: undefined;
  PersonalInfoDetail: { personalInfo: User | null };

  History: undefined;
  Request: undefined;
  Notifications: undefined;
  HistoryDetailScreen: undefined;
  ReceiptScreen: undefined;
  PaymentDetail: {
    payment: any;
    group: any;
  };
};
