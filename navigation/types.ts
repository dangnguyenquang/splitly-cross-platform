import { Group, GroupBasicInformation } from '../types';

export type RootStackParamList = {
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainApp: undefined;
  CreateGroup: undefined;
  AddExpense: { groupId: string; group?: Group };
  SelectParticipants: { groupData: GroupBasicInformation };
  GroupDetail: { groupId: string; group?: Group };
  GroupsScreen: undefined;

  History: undefined;
  Request: undefined;
  Notifications: undefined;
  HistoryDetailScreen: undefined;
  ReceiptScreen: undefined;
};
