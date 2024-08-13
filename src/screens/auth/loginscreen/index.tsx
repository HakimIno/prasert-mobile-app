import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import color from '../../../constant/color';
import { useAuth } from '../../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = ({ navigation }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignIn = async () => {
        setLoading(true); // เริ่มการโหลด
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        } finally {
            setLoading(false); // จบการโหลด
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={[styles.container, { marginHorizontal: 20, flex: 1, justifyContent: 'center', alignItems: 'center', gap: 36 }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require("../../../../assets/logo.jpg")}
                        style={{ width: 120, height: 120, borderRadius: 120, marginBottom: 20, }}
                    />

                    <Text style={{ fontFamily: 'SukhumvitSet-Bold', fontSize: 20 }}>ประเสริฐเจริญยนต์</Text>
                </View>

                <View style={{ width: "100%", gap: 3 }}>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        autoComplete="email"
                        placeholderTextColor={'#a1a1aa'}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        secureTextEntry
                        placeholderTextColor={'#a1a1aa'}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable
                        style={styles.btnContainer}
                        onPress={handleSignIn}
                        disabled={loading} // ปิดการใช้งานปุ่มเมื่อกำลังโหลด
                    >
                        {loading ? (
                            <ActivityIndicator color={color.white} />
                        ) : (
                            <Text style={[styles.textInfoSubTitle, { color: color.white, fontFamily: 'SukhumvitSet-Bold' }]}>เข้าสู่ระบบ</Text>
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
        </View >
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
        padding: 15,
        textAlignVertical: 'center',
        backgroundColor: color.white,
        borderRadius: 20,
        fontFamily: 'SukhumvitSet-SemiBold',
    },
    btnContainer: {
        borderWidth: 2,
        borderColor: color.blue[500],
        backgroundColor: color.blue[500],
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 10
    },
})
