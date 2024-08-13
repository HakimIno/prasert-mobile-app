import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import color from '../../../constant/color';
import { FlashList } from '@shopify/flash-list';
import { useFetchIcons } from '../../../hooks/useFetchIcons';
import { useFetchFiles } from '../../../hooks/useFetchFile';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../../context/AuthContext';

const HomeScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState("ทั้งหมด");
    const { session } = useAuth();

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedItem, setSelectedItem] = useState(null);
    const [fileId, setFileId] = useState("")
    const [fileName, setfileName] = useState("")

    const dataIcon = useFetchIcons();
    const { files, loading } = useFetchFiles();

    const dataWithAllTab = [{ abbreviation: "ทั้งหมด", icon_url: "https://cdn-icons-png.freepik.com/512/9061/9061169.png" }, ...dataIcon];

    // ฟังก์ชันกรองข้อมูล
    const filteredFiles = selectedFilter === "ทั้งหมด"
        ? files
        : files.filter((folder: { filename: string; }) => folder.filename.endsWith(`.${selectedFilter}`))


    const handleOpenMenu = (item, event) => {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;

        // สมมติว่าความกว้างของเมนูประมาณ 150 หน่วย
        const menuWidth = 150;
        const offset = 10; // ขยับเข้ามาทางซ้าย 10 หน่วย
        let leftPosition = pageX - offset; // เลื่อนเข้ามาทางซ้ายเล็กน้อย

        // ถ้าเมนูหลุดออกไปทางขวาของหน้าจอ ให้เลื่อนเมนูกลับเข้ามา
        if (leftPosition + menuWidth > screenWidth) {
            leftPosition = screenWidth - menuWidth - 50; // หักลบ 10 หน่วยสำหรับระยะห่างจากขอบจอ
        }

        setMenuPosition({ top: pageY, left: leftPosition });
        setSelectedItem(item);
        setMenuVisible(true);
    };

    const handleViewDetails = () => {
        setMenuVisible(false);
        // Logic สำหรับดูรายละเอียด
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true); // เริ่มแสดง loading
        const accessToken = session?.access_token;
        const refreshToken = session?.refresh_token;

        if (accessToken && refreshToken) {
            const uri = await downloadFile(fileId, accessToken, refreshToken, fileName);
            if (uri) {
                openFile(uri);
            }
        } else {
            console.log('Tokens are not available');
        }
        setIsLoading(false); // หยุดแสดง loading
    };


    const downloadFile = async (fileIdx: string, accessToken: string, refreshToken: string, file_name: string) => {
        try {
            const apiEndpoint = `https://prasert-upload-to-dive.prasertjarernyonte.workers.dev/download?fileId=${fileIdx}`;
            const fileUri = FileSystem.documentDirectory + file_name;

            const response = await FileSystem.downloadAsync(apiEndpoint, fileUri, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken,
                },
            });

            if (!response.uri) {
                throw new Error(`Failed to download file: ${response.status}`);
            }

            Alert.alert('Download complete', `File saved to: ${response.uri}`);
            return response.uri;
        } catch (error) {
            Alert.alert('Download failed', error.message);
        }
    };

    const openFile = async (fileUri: string) => {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert('Error', 'Sharing is not available on this device');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" backgroundColor='white' />
            <View style={{ flex: 1, marginHorizontal: 8 }}>
                <View style={styles.tabContainer}>
                    <FlatList
                        data={dataWithAllTab}
                        horizontal
                        overScrollMode="never"
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item?.abbreviation}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    item?.abbreviation === selectedFilter && styles.selectedTab
                                ]}
                                onPress={() => setSelectedFilter(item?.abbreviation)}
                            >
                                <Image source={{ uri: item?.icon_url }} style={styles.tabIcon} />
                                <Text style={[
                                    styles.tabText,
                                    item?.abbreviation === selectedFilter && styles.selectedTabText
                                ]}>
                                    {item?.abbreviation}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <FlashList
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View style={styles.listItemContent}>
                                {/* @ts-ignore */}
                                <Image source={{ uri: item?.icon?.icon_url }} style={styles.listItemIcon} />
                                <View style={styles.listItemTextContainer}>
                                    <Text style={styles.listItemTitle} numberOfLines={1}>
                                        {item.filename}
                                    </Text>
                                    <View style={styles.listItemSubtextContainer}>
                                        <Ionicons name="people" size={16} color={color.zinc[400]} />
                                        <Text style={styles.listItemSubtext} numberOfLines={1}>
                                            {item.owner} • {dayjs(item.creationdate).format("DD/MM/YYYY")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity

                                onPress={(event) => {
                                    //@ts-ignore
                                    setFileId(item?.file_id)
                                    setfileName(item?.filename)
                                    handleOpenMenu(item, event)
                                }}
                                style={styles.listItemAction}>
                                <Ionicons name="ellipsis-vertical" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    )}
                    estimatedItemSize={50}
                    data={filteredFiles} // ใช้ข้อมูลที่ถูกกรองแล้ว
                />
            </View>

            <Modal
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
                statusBarTranslucent
            >
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={[styles.menuContainer, { top: menuPosition.top, left: menuPosition.left }]}>
                    <TouchableOpacity onPress={handleDownload} style={[styles.menuItem]}>
                        {isLoading ? (
                            <>
                                <ActivityIndicator size={"small"} color={color.blue[600]} />
                                <Text style={styles.menuText}>{"กำลังโหลด..."}</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="download" size={26} color={color.gray[800]} />
                                <Text style={styles.menuText}>{"ดาวน์โหลด"}</Text>
                            </>
                        )}

                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    tab: {
        padding: 5,
        paddingHorizontal: 15,
        marginEnd: 15,
        borderRadius: 13,
        backgroundColor: color.zinc[100],
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: color.blue[100],
        borderWidth: 1.5,
        borderColor: color.blue[600]
    },
    tabIcon: {
        width: 24,
        height: 24,
    },
    tabText: {
        color: color.gray[600],
        fontFamily: 'SukhumvitSet-Bold'
    },
    selectedTabText: {
        color: color.blue[600],
        fontFamily: 'SukhumvitSet-Bold'
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 0.3,
        borderColor: color.zinc[200]
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    listItemIcon: {
        width: 30,
        height: 30,
    },
    listItemTextContainer: {
        width: "78%"
    },
    listItemTitle: {
        fontFamily: 'SukhumvitSet-Bold',
        fontSize: 16,
    },
    listItemSubtextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    listItemSubtext: {
        color: color.zinc[400],
        fontFamily: 'SukhumvitSet-Medium',
        fontSize: 12,
    },
    listItemAction: {
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 13,
        padding: 10,
        elevation: 5,
        zIndex: 10,
    },
    menuItem: {
        paddingVertical: 5,
        alignItems: 'center',
        flexDirection: 'row',
        width: 150,
        gap: 15,
    },
    menuText: {
        fontFamily: 'SukhumvitSet-Bold',
    },
});
