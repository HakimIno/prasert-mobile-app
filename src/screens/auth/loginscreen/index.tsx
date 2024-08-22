import { ActivityIndicator, Alert, Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import color from '../../../constant/color';
import { useAuth } from '../../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import useResponsiveStyles from '../../../hooks/useResponsiveStyles';

const LoginScreen = ({ navigation }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true); // เริ่มการโหลด
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setLoading(false); // จบการโหลด
        }
    };


    const {
        inputWidth,
        space,
        imageWidth,
        imageHeight,
        fontSize,
        size,
        padding,
        fontSizeBtn,
        heightBtn,
    } = useResponsiveStyles()

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={[styles.container, { marginHorizontal: space, flex: 1, justifyContent: 'center', alignItems: 'center', gap: space }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require("../../../../assets/logo.jpg")}
                        style={{ width: imageWidth, height: imageHeight, borderRadius: imageWidth, marginBottom: space, }}
                    />

                    <Text style={{ fontFamily: 'SukhumvitSet-Bold', fontSize: fontSize }}>ประเสริฐเจริญยนต์</Text>
                </View>

                <View style={{ width: "100%", gap: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.input, { width: inputWidth, height: heightBtn, fontSize: fontSize, paddingHorizontal: 20 }]}
                        placeholder='Email'
                        autoComplete="email"
                        placeholderTextColor={'#a1a1aa'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={[styles.input, { width: inputWidth, height: heightBtn, fontSize: fontSize, paddingHorizontal: 20 }]}
                        placeholder='Password'
                        secureTextEntry
                        placeholderTextColor={'#a1a1aa'}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable
                        style={[styles.btnContainer, { width: inputWidth, height: heightBtn }]}
                        onPress={handleSignIn}
                        disabled={loading} // ปิดการใช้งานปุ่มเมื่อกำลังโหลด
                    >
                        {loading ? (
                            <ActivityIndicator color={color.white} size={24} />
                        ) : (
                            <Text style={[styles.textInfoSubTitle, { fontSize: fontSizeBtn * size, color: color.white, fontFamily: 'SukhumvitSet-Bold' }]}>เข้าสู่ระบบ</Text>
                        )}
                    </Pressable>

                    <View style={{ flexDirection: 'row', gap: 3, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={[styles.textInfoSubTitle, { color: color.black, fontFamily: 'SukhumvitSet-Medium' }]}>หากยังไม่มีบัญชีโปรด</Text>
                        <Pressable onPress={() => navigation.navigate("SignUp")}>
                            <Text style={[styles.textInfoSubTitle, { color: color.blue[600], fontFamily: 'SukhumvitSet-Bold', textDecorationLine: 'underline' }]}>
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
        lineHeight: 20 * 1.5
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
})
