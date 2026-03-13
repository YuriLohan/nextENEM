import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ContentsScreen from '../screens/ContentsScreen';
import QuestionsScreen from '../screens/QuestionsScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Courses: undefined;
  Home: undefined;
  Contents: undefined;
  Questions: { subject_id: number; subject_name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Contents" component={ContentsScreen} />
        <Stack.Screen name="Questions" component={QuestionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}