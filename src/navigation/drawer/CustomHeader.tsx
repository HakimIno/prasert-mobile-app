import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import color from '../../constant/color';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFiles } from '../../context/FilesComtext';

const CustomHeader = ({ navigation }) => {
    const { top } = useSafeAreaInsets();
    const [isMenuVisible, setMenuVisible] = useState(false);
    const { user, signOut } = useAuth(); // ใช้ข้อมูลจาก AuthContext
    const buttonRef = useRef<View>(null); // สร้าง ref สำหรับปุ่ม 'b'

    const { searchQuery, setSearchQuery } = useFiles()

    const handleLogout = async () => {
        await signOut();
        setMenuVisible(false);
    };

    const showMenu = () => {
        setMenuVisible(true);
    };

    return (
        <View style={[styles.header]}>
            <View style={[{ marginTop: Platform.OS === "ios" ? top - 5 : top + 5 }, styles.subHeader]}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)} // จับค่าที่พิมพ์แล้วเก็บใน searchQuery
                />
                <TouchableOpacity
                    //@ts-ignore
                    ref={buttonRef}
                    style={[styles.icon, { backgroundColor: color.blue[600] }]}
                    onPress={showMenu}
                >
                    <Text style={{ color: "white" }}>
                        {user?.email?.charAt(0).toLocaleUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isMenuVisible}
                animationType='none'
                onRequestClose={() => setMenuVisible(false)}
                statusBarTranslucent
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={[styles.menuContainer, { top: "10%", right: "10%" }]}>
                        <View style={[styles.menuItem, { flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
                            <Ionicons name="person" size={20} color={color.gray[800]} />
                            <Text numberOfLines={1} style={{ fontFamily: 'SukhumvitSet-Bold' }}>{user?.email}</Text>
                        </View>
                        <TouchableOpacity style={[styles.menuItem, { borderTopWidth: 0.2, borderColor: color.gray[300] }]} onPress={handleLogout}>
                            <Text style={[styles.menuText, { color: color.rose[600], fontWeight: '600' }]}>ออกจากระบบ</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        paddingBottom: 10
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 100
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 7,
        justifyContent: 'space-between',
        marginHorizontal: 20,
        backgroundColor: color.blue[50],
        borderRadius: 100
    },
    searchInput: {
        height: 40,
        paddingHorizontal: 10,
        marginRight: 10,
        width: "70%",
        fontFamily: 'SukhumvitSet-Bold'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        width: "60%"
    },
    menuItem: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '100%',
    },
    menuText: {
        fontSize: 15,
        color: 'black',
        fontFamily: 'SukhumvitSet-Bold'
    },
});

export default CustomHeader;
