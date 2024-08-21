import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View, Linking, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../../../utils/supabase';
import color from '../../../constant/color';

const SignupScreen = () => {
    const { width, height } = useWindowDimensions(); // ใช้ useWindowDimensions เพื่อดึงขนาดหน้าจอ
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const signUp = async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password });
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { email, password, firstName, lastName, phone } = formData;
        try {
            const { data, error } = await signUp(email, password);

            if (error) {
                throw error;
            }

            const user = data?.user;

            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    id: user?.id,
                    email,
                    firstname: firstName,
                    lastname: lastName,
                    phone,
                    role: "user"
                }]);

            if (insertError) {
                throw insertError;
            }

            Alert.alert(
                'Registration Successful',
                'Please check your email for confirmation.',
                [
                    {
                        text: 'Open Gmail',
                        onPress: () => Linking.openURL('googlegmail://co'),
                    },
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ]
            );

            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phone: '',
            });

        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label: string, name: string, placeholder: string, secureTextEntry = false, keyboardType: 'default' | 'email-address' = 'default') => (
        <View style={{ marginBottom: height * 0.02 }}>
            <Text style={[styles.label, { fontSize: width * 0.04 }]}>{label}:</Text>
            <TextInput
                style={[styles.input, { padding: height * 0.02 }]}
                placeholder={placeholder}
                placeholderTextColor={'#a1a1aa'}
                value={formData[name]}
                onChangeText={(value) => handleChange(name, value)}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ margin: width * 0.05 }}>
                        <View style={styles.formContainer}>
                            {renderInput('ชื่อ', 'firstName', 'First Name')}
                            {renderInput('นามสกุล', 'lastName', 'Last Name')}
                            {renderInput('อีเมล', 'email', 'Email', false, 'email-address')}
                            {renderInput('เบอร์โทรศัพท์', 'phone', 'Phone Number')}
                            {renderInput('รหัสผ่าน', 'password', 'Password', true)}

                            <Pressable style={[styles.btnContainer, { height: height * 0.07 }]} onPress={handleSignUp} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={color.white} />
                                ) : (
                                    <Text style={[styles.btnText, { fontSize: width * 0.045 }]}>ลงทะเบียน</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.slate[50]
    },
    formContainer: {
        width: "100%",
        gap: 3,
    },
    label: {
        color: color.black,
        fontFamily: 'SukhumvitSet-SemiBold',
        marginLeft: 10,
    },
    input: {
        textAlignVertical: 'center',
        backgroundColor: color.white,
        borderRadius: 20,
        fontFamily: 'SukhumvitSet-SemiBold',
    },
    btnContainer: {
        borderWidth: 2,
        borderColor: color.blue[500],
        backgroundColor: color.blue[500],
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 10,
    },
    btnText: {
        color: color.white,
        fontFamily: 'SukhumvitSet-Bold',
    },
});
