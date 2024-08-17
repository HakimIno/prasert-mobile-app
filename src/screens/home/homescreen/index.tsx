import React, { useCallback, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, Alert, ActivityIndicator, Pressable, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import color from '../../../constant/color';
import { FlashList } from '@shopify/flash-list';
import { useFetchIcons } from '../../../hooks/useFetchIcons';
import dayjs from 'dayjs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../../context/AuthContext';
import { useFiles } from '../../../context/FilesComtext';
import CustomHeader from '../../../navigation/CustomHeader';
import LoadingIndicator from '../../../components/LoadingIndicator';
import Breadcrumb from '../../../components/BreadcrumbButtonÏ';

const HomeScreen = ({ navigation, route }) => {
    const { branch, type_cars } = route.params;

    if (!branch || !type_cars) {
        console.error("Branch or Type Cars is missing in route params");
        return null; // หรือนำไปแสดงหน้า error หรือข้อความแจ้งเตือน
    }

    const [selectedFilter, setSelectedFilter] = useState(0);
    const { filteredFiles: files, loading, searchQuery, setSearchQuery, fetchFilesWithIcons } = useFiles({ branch, type_cars });
    const filteredFiles = selectedFilter === 0
        ? files
        : files.filter((folder: any) => folder.icon.id === selectedFilter);


    const { session } = useAuth();

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [fileId, setFileId] = useState("")
    const [fileName, setfileName] = useState("")
    const [storageProvider, setStorageProvider] = useState("")

    const dataIcon = useFetchIcons();

    const dataWithAllTab = [{ id: 0, abbreviation: "ทั้งหมด", icon_url: "https://cdn-icons-png.freepik.com/512/9061/9061169.png" }, ...dataIcon];

    // ฟังก์ชันกรองข้อมูล


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
        setMenuVisible(true);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true); // เริ่มแสดง loading
        const accessToken = session?.access_token;
        const refreshToken = session?.refresh_token;

        if (accessToken && refreshToken) {
            const uri = await downloadFile(fileId, accessToken, refreshToken, fileName, storageProvider);
            if (uri) {
                openFile(uri);
            }
        } else {
            console.log('Tokens are not available');
        }
        setIsLoading(false); // หยุดแสดง loading
    };


    const downloadFile = async (
        fileIdx: string,
        accessToken: string,
        refreshToken: string,
        file_name: string,
        storageProvider: string
    ) => {
        try {
            let apiEndpoint: string;
            if (storageProvider === 'cloudinary') {
                apiEndpoint = `https://res.cloudinary.com/dkm0oeset/image/upload/${fileIdx}`;
            } else if (storageProvider === 'google_drive') {
                apiEndpoint = `https://prasert-upload-to-dive.prasertjarernyonte.workers.dev/download?fileId=${fileIdx}`;
            } else {
                throw new Error('Unsupported storage provider');
            }

            const fileUri = FileSystem.documentDirectory + file_name;

            const response = await FileSystem.downloadAsync(apiEndpoint, fileUri, {
                headers: storageProvider === 'google_drive' ? {
                    Authorization: `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken,
                } : undefined,
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

    const breadcrumbItems = [
        {
            label: 'หน้าแรก',
            onPress: () => navigation.goBack(), // นำทางกลับไปยังหน้าก่อนหน้า
            icon: <AntDesign name="home" size={18} color={color.blue[600]} />,
        },
        {
            label: branch?.branch_name,
            onPress: () => navigation.goBack(), // นำทางไปยังหน้าสาขา
        },
        {
            label: type_cars?.car_type_name,
            onPress: () => { }, // ถ้าหน้านี้เป็นหน้าปัจจุบัน อาจจะไม่ต้องทำอะไร
            style: { backgroundColor: color.blue[600] },
            textStyle: { color: color.white },
        },
    ];


    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFilesWithIcons(branch?.id, type_cars?.id).then(() => setRefreshing(false));
    }, [fetchFilesWithIcons, branch, type_cars]);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" backgroundColor='white' />
            <CustomHeader isShow searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <View style={{ height: 40 }}>
                <Breadcrumb items={breadcrumbItems} />
            </View>
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
                                    item?.id === selectedFilter && styles.selectedTab
                                ]}
                                onPress={() => setSelectedFilter(item?.id)}
                            >
                                <Image source={{ uri: item?.icon_url }} style={styles.tabIcon} />
                                <Text style={[
                                    styles.tabText,
                                    item?.id === selectedFilter && styles.selectedTabText
                                ]}>
                                    {item?.abbreviation.toLocaleUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {loading ? (
                    <LoadingIndicator message="กำลังโหลด..." />
                ) : (
                    <>
                        {filteredFiles.length > 0 ? (
                            <FlashList
                                showsVerticalScrollIndicator={false}
                                overScrollMode="never"
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View

                                        style={styles.listItem}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item?.storage_provider === "cloudinary") {
                                                    navigation.navigate('ImageView', { item })
                                                }
                                            }}
                                            style={styles.listItemContent}>
                                            {/* @ts-ignore */}
                                            {item?.storage_provider === "cloudinary" ? (
                                                <Image source={{ uri: `https://res.cloudinary.com/dkm0oeset/image/upload/${item?.file_id}.png` }} style={{ width: 50, height: 50, resizeMode: 'cover', borderWidth: 0.5, borderColor: color.gray[300], borderRadius: 5 }} />
                                            ) : (
                                                // @ts-ignore 
                                                <Image source={{ uri: item.icon.icon_url }} style={styles.listItemIcon} />
                                            )}

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
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={(event) => {
                                                //@ts-ignore
                                                setFileId(item?.file_id)
                                                setfileName(item?.filename)
                                                setStorageProvider(item?.storage_provider)
                                                handleOpenMenu(item, event)
                                            }}
                                            style={styles.listItemAction}>
                                            <Ionicons name="ellipsis-vertical" size={20} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                estimatedItemSize={200}
                                data={filteredFiles}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={[color.blue[500]]} // เปลี่ยนสีของวงกลมที่หมุนเมื่อรีเฟรช
                                    />
                                }
                            />
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                                <View style={{ gap: 5 }}>
                                    <Image
                                        source={{ uri: "https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/forbidden.png" }}
                                        style={{ width: 60, height: 60, marginLeft: 8 }} />
                                    <Text style={[styles.menuText, { color: color.gray[800] }]}>ไม่พบไฟล์</Text>
                                </View>
                                <View />
                            </View>
                        )}
                    </>
                )}
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
                                <ActivityIndicator size={24} color={color.blue[600]} />
                                <Text style={styles.menuText}>{"กำลังโหลด..."}</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="download-outline" size={24} color={color.gray[950]} />
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
        padding: 3,
        paddingHorizontal: 15,
        marginEnd: 10,
        borderRadius: 100,
        backgroundColor: color.zinc[100],
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: color.blue[50],
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
        paddingHorizontal: 10,
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
        width: "70%"
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
        width: 140,
        gap: 15,
    },
    menuText: {
        fontFamily: 'SukhumvitSet-SemiBold',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        paddingHorizontal: 10,
        backgroundColor: color.blue[50],
        borderRadius: 20,
        marginRight: 10,
    },
    firstButton: {
        marginRight: 0,
    },
    buttonText: {
        color: color.blue[600],
        fontFamily: 'SukhumvitSet-SemiBold',
        marginLeft: 0,
    },
});
