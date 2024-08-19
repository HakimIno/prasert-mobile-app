import { ActivityIndicator, Alert, Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FlashList } from '@shopify/flash-list'
import color from '../../../constant/color'
import { useFetchBranchs } from '../../../hooks/useFetchBranchs'
import CustomHeader from '../../../navigation/CustomHeader'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useFiles } from '../../../context/FilesComtext'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../../context/AuthContext'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs'

type FolderType = {
    type: 'folder';
    id: number;
    branch_name: string;
};

type FileType = {
    type: 'file';
    branchs: any;
    type_cars: any;
    branch_id: number;
    id: number;
    filename: string;
    creationdate: string;
    owner: string;
    storage_provider: string;
    file_id: string;
    icon: { id: number; icon_url: string; }[]; // ปรับเป็นอาร์เรย์ของอ็อบเจ็กต์
};


type CombinedDataType = FolderType | FileType;

const FolderScreen = ({ navigation }) => {
    const folders = useFetchBranchs();
    const { filteredFiles, loading, searchQuery, setSearchQuery, fetchFilesWithIcons } = useFiles({ branch: null, type_cars: null });

    useFocusEffect(
        React.useCallback(() => {
            fetchFilesWithIcons();
            return () => { };
        }, [])
    );

    const [fileId, setFileId] = useState("")
    const [fileName, setfileName] = useState("")
    const [storageProvider, setStorageProvider] = useState("")
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const { session } = useAuth();

    const combinedData: CombinedDataType[] = useMemo(() => {
        if (searchQuery) {
            return filteredFiles.map(file => ({ ...file, type: 'file' }));
        } else {
            return folders.map(folder => ({ ...folder, type: 'folder' }));
        }
    }, [folders, filteredFiles, searchQuery]);

    const handlePress = (item: any) => {
        if (item.type === 'folder') {
            navigation.navigate("TypeCars", { branch: item });
        } else if (item.type === 'file') {
            if (item?.storage_provider === "cloudinary") {
                navigation.navigate('ImageView', { item });
            }
        }
    };

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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" backgroundColor='white' />
            <CustomHeader isShow searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                    onPress={() => { }}
                    style={[styles.button, styles.firstButton, { gap: 2 }]}>
                    <AntDesign name="home" size={18} color={color.white} />
                    <Text style={styles.buttonText}>หน้าแรก</Text>
                </Pressable>
            </View>
            <View style={{ flex: 1, marginHorizontal: 8 }}>
                <FlashList
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.listItem} onPress={() => handlePress(item)}>
                            <View style={styles.listItemContent}>

                                {item.type === 'folder' ? (
                                    <Image source={{ uri: "https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png" }} style={styles.listItemIcon} />
                                ) : (

                                    <Image

                                        source={{
                                            uri: item?.storage_provider === "cloudinary" ?
                                                `https://res.cloudinary.com/dkm0oeset/image/upload/${item?.file_id}.${item?.filename.split('.').pop()}` :
                                                // @ts-ignore
                                                item.icon.icon_url
                                        }}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            resizeMode: 'cover',
                                            borderWidth: 0.5,
                                            borderColor: color.gray[300],
                                            borderRadius: 5
                                        }} />
                                )}


                                {item.type === "folder" ? (
                                    <View style={styles.listItemTextContainer}>
                                        <Text style={styles.listItemTitle} numberOfLines={1}>
                                            {item.branch_name}
                                        </Text>
                                    </View>) : (<View style={styles.listItemTextContainer}>
                                        <Text style={styles.listItemTitle} numberOfLines={1}>
                                            {item.filename}
                                        </Text>
                                        <View style={styles.listItemSubtextContainer}>
                                            <Ionicons name="people" size={16} color={color.zinc[400]} />
                                            <Text style={styles.listItemSubtext} numberOfLines={1}>
                                                {item.owner} • {dayjs(item.creationdate).format("DD/MM/YYYY")}
                                            </Text>
                                        </View>
                                    </View>)}
                            </View>

                            {item.type === "folder" ? (<Ionicons name="chevron-forward" size={16} color={color.blue[950]} />) : (
                                <TouchableOpacity
                                    onPress={
                                        (event) => {
                                            //@ts-ignore
                                            setFileId(item?.file_id)
                                            setfileName(item?.filename)
                                            setStorageProvider(item?.storage_provider)
                                            handleOpenMenu(item, event)
                                        }}
                                    style={styles.listItemAction}>
                                    <Ionicons name="ellipsis-vertical" size={20} color="black" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    )}
                    estimatedItemSize={200}
                    data={combinedData}
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
        </View >
    )
}

export default FolderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 0.3,
        borderColor: color.zinc[200]
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    listItemTextContainer: {
        width: "78%"
    },
    listItemTitle: {
        fontFamily: 'SukhumvitSet-SemiBold',
        fontSize: 16,
    },
    listItemIcon: {
        width: 40,
        height: 40,

    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        paddingHorizontal: 10,
        backgroundColor: color.blue[600],
        borderRadius: 20,
        marginRight: 10,
    },
    firstButton: {
        marginRight: 0,
    },
    buttonText: {
        color: color.white,
        fontFamily: 'SukhumvitSet-SemiBold',
        marginLeft: 0,
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
    listItemAction: {
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
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
})
