import { GroupBasicInformation } from "./group";

export type RootStackParamList = {
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  OTP: { email: string };
  MainApp: undefined;
  //   GroupDetail: { groupId: string };
  CreateGroup: undefined;
  SelectParticipants: { groupData: GroupBasicInformation };
  GroupsScreen: undefined;

  History: undefined;
  Request: undefined;
  Notifications: undefined;
  HistoryDetailScreen: undefined;
  ReceiptScreen: undefined;
};
