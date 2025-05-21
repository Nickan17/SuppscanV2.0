import { NavigatorScreenParams } from '@react-navigation/native';

type RootStackParamList = {
  index: undefined;
  search: undefined;
  'test-ai': undefined;
  // Add other routes here as needed
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
