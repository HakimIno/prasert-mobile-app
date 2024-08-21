import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext'; // assuming useAuth is from your context
import FolderScreen from '../screens/home/folders';
import TypeCarsScreen from '../screens/home/type_cars';
import HomeScreen from '../screens/home/homescreen';
import LoginScreen from '../screens/auth/loginscreen';
import SignupScreen from '../screens/auth/signupscreen';
import { ActivityIndicator, Text, View } from 'react-native';
import color from '../constant/color';
import { StatusBar } from 'expo-status-bar';
import ImageView from '../screens/home/ImageView/ImageView';
import PDFView from '../screens/home/pdfView';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, isLoading } = useAuth(); // assuming useAuth provides user state

    if (isLoading) {
        // Show a loading screen while the user state is being fetched
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.zinc[50],
                gap: 20
            }}>
                <StatusBar style='auto' />
                <ActivityIndicator color={color.blue[600]} size="large" />
                <Text style={{
                    fontFamily: 'SukhumvitSet-SemiBold',
                    fontSize: 14,
                }}>กำลังโหลด...</Text>
            </View>
        );
    }

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
                        <Stack.Screen name="ImageView" component={ImageView} />
                        <Stack.Screen name="PDFView" component={PDFView} />
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
                                    fontSize: 18
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
