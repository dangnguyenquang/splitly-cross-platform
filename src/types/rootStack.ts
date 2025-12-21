import { Group, GroupBasicInformation } from './group';
import { User } from './user';

export type RootStackParamList = {
  Slash: undefined;
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  OTP: { email: string, type: string };
  ResetPassword: undefined;
  NewPassword: { token: string };
  MainApp: undefined;

  CreateGroup: undefined;
  AddExpense: { groupId: string; group?: Group };
  SelectParticipants: { groupData: GroupBasicInformation };
  GroupDetail: { groupId: string; group?: Group };
  GroupsScreen: undefined;
  PersonalInfoDetail: { personalInfo: User|null };

  History: undefined;
  Request: undefined;
  Notifications: undefined;
  HistoryDetailScreen: undefined;
  ReceiptScreen: undefined;
};
