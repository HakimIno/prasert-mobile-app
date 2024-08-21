import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import color from '../../../constant/color';
import { useAuth } from '../../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions(); // ใช้ useWindowDimensions
    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignIn = async () => {
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={[styles.container, { marginHorizontal: width * 0.05, flex: 1, justifyContent: 'center', alignItems: 'center', gap: height * 0.05 }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require("../../../../assets/logo.jpg")}
                        style={{ width: width * 0.3, height: width * 0.3, borderRadius: width * 0.3, marginBottom: height * 0.02 }}
                    />

                    <Text style={{ fontFamily: 'SukhumvitSet-Bold', fontSize: width * 0.05 }}>ประเสริฐเจริญยนต์</Text>
                </View>

                <View style={{ width: "100%", gap: height * 0.005 }}>
                    <TextInput
                        style={[styles.input, { padding: height * 0.02 }]}
                        placeholder='Email'
                        autoComplete="email"
                        placeholderTextColor={'#a1a1aa'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={[styles.input, { padding: height * 0.02 }]}
                        placeholder='Password'
                        secureTextEntry
                        placeholderTextColor={'#a1a1aa'}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable
                        style={[styles.btnContainer, { height: height * 0.07 }]}
                        onPress={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={color.white} />
                        ) : (
                            <Text style={[styles.textInfoSubTitle, { color: color.white, fontFamily: 'SukhumvitSet-Bold', fontSize: width * 0.045 }]}>เข้าสู่ระบบ</Text>
                        )}
                    </Pressable>

                    <View style={{ flexDirection: 'row', gap: height * 0.01, justifyContent: 'center', alignItems: 'center', marginTop: height * 0.03 }}>
                        <Text style={[styles.textInfoSubTitle, { color: color.black, fontFamily: 'SukhumvitSet-Medium', fontSize: width * 0.04 }]}>หากยังไม่มีบัญชีโปรด</Text>
                        <Pressable onPress={() => navigation.navigate("SignUp")}>
                            <Text style={[styles.textInfoSubTitle, { color: color.blue[600], fontFamily: 'SukhumvitSet-Bold', textDecorationLine: 'underline', fontSize: width * 0.04 }]}>
                                ลงทะเบียน
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.slate[100]
    },
    textInfoSubTitle: {
        lineHeight: 20 * 1.5 // สามารถใช้ useWindowDimensions เพื่อปรับขนาดตามหน้าจอได้
    },
    input: {
        marginBottom: 20,
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
        marginTop: 10
    },
});
