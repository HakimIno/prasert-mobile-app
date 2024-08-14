import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext'; // assuming useAuth is from your context
import FolderScreen from '../screens/home/folders';
import TypeCarsScreen from '../screens/home/type_cars';
import HomeScreen from '../screens/home/homescreen';
import LoginScreen from '../screens/auth/loginscreen';
import SignupScreen from '../screens/auth/signupscreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user } = useAuth(); // assuming useAuth provides user state

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? "Folder" : "Login"}
                screenOptions={{
                    headerShown: false, // Default to hide header
                    ...TransitionPresets.SlideFromRightIOS, // Slide animation for iOS and Android
                }}
            >
                {user ? (
                    <>
                        <Stack.Screen name="Folder" component={FolderScreen} />
                        <Stack.Screen name="TypeCars" component={TypeCarsScreen} />
                        <Stack.Screen name="Home" component={HomeScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen
                            name="SignUp"
                            component={SignupScreen}
                            options={{
                                headerShown: true,
                                headerTitle: "ลงทะเบียน",
                                headerTitleStyle: {
                                    fontFamily: 'SukhumvitSet-SemiBold',
                                }
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
