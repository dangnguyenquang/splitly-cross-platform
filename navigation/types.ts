import { GroupBasicInformation } from "../types";

export type RootStackParamList = {
  Onboard: undefined;
  GetStartedScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainApp: undefined;
//   GroupDetail: { groupId: string };
  CreateGroup: undefined;
  SelectParticipants: { groupData: GroupBasicInformation };
  GroupsScreen: undefined
};