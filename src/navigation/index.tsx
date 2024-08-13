import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from '../screens/auth/loginscreen';
import { MyDrawer } from './drawer';
import { useAuth } from '../context/AuthContext';
import SignupScreen from '../screens/auth/signupscreen';

const Stack = createStackNavigator();

export default function AppStackNavigation() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user ? "Drawer" : "Login"}>
                {user ? (
                    <Stack.Screen name="Drawer" component={MyDrawer} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="SignUp" component={SignupScreen}
                            options={{
                                headerShown: true,
                                headerTitle: "ลงทะเบียน",
                                headerTitleStyle: {
                                    fontFamily: 'SukhumvitSet-SemiBold',
                                }
                            }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
