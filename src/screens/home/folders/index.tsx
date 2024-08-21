import { ActivityIndicator, Dimensions, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useMemo, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import color from '../../../constant/color';
import CustomHeader from '../../../navigation/CustomHeader';
import { useCombinedData } from '../../../hooks/useCombinedData';
import { useDownloadFile } from '../../../hooks/useDownloadFile';
import { CLOUDINARY_URL } from '../../../utils/cloudinary';

const FolderScreen = ({ navigation }) => {
    const [fileId, setFileId] = useState("");
    const [fileName, setfileName] = useState("");
    const [storageProvider, setStorageProvider] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const { combinedData, isFileType, searchQuery, setSearchQuery, fetchFilesWithIcons } = useCombinedData();
    const { downloadFile, openFile } = useDownloadFile();

    useFocusEffect(
        useCallback(() => {
            fetchFilesWithIcons();
        }, [])
    );

    const nonPdfFiles = useMemo(() => combinedData.filter(isFileType).filter(item => !item.filename.toLowerCase().endsWith('.pdf')), [combinedData]);

    const handlePress = useCallback((item: any) => {
        if (item.type === 'folder') {
            const navigationTarget = item.type_in === "branch"
                ? "TypeCars"
                : 'Home';

            navigation.navigate(navigationTarget, item.type_in === "branch"
                ? { branch: item }
                : { branch: null, type_cars: { id: item?.id, car_type_name: item?.car_type_name } });
        } else if (isFileType(item)) {
            handleFileNavigation(item);
        }
    }, [navigation, nonPdfFiles]);

    const handleFileNavigation = (item) => {
        if (item.storage_provider === "cloudinary" && !item?.filename.toLowerCase().endsWith('.pdf')) {
            const nonPdfIndex = nonPdfFiles.findIndex(file => file.file_id === item.file_id);
            navigation.navigate('ImageView', { items: nonPdfFiles, initialIndex: nonPdfIndex });
        } else if (item?.filename.toLowerCase().endsWith('.pdf')) {
            navigation.navigate('PDFView', { fileId: item.file_id, storageProvider: item?.storage_provider, fileName: item?.filename });
        }
    };

    const handleOpenMenu = useCallback((item, event) => {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;
        const menuWidth = 150;
        const offset = 10;

        let leftPosition = pageX - offset;
        if (leftPosition + menuWidth > screenWidth) {
            leftPosition = screenWidth - menuWidth - 50;
        }

        setMenuPosition({ top: pageY, left: leftPosition });
        setMenuVisible(true);
        setFileId(item?.file_id);
        setfileName(item?.filename);
        setStorageProvider(item?.storage_provider);
    }, []);

    const handleDownload = useCallback(async () => {
        setIsLoading(true);
        const uri = await downloadFile(fileId, fileName, storageProvider);
        if (uri) {
            openFile(uri);
        }
        setIsLoading(false);
    }, [fileId, fileName, storageProvider, downloadFile, openFile]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" backgroundColor='white' />
            <CustomHeader isShow searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <View style={styles.actionContainer}>
                <Pressable onPress={() => { }} style={[styles.button, styles.firstButton]}>
                    <MaterialCommunityIcons name="folder-home" size={18} color={color.white} />
                    <Text style={styles.buttonText}>หน้าแรก</Text>
                </Pressable>
            </View>
            <View style={styles.listContainer}>
                <FlashList
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <FileListItem
                            item={item}
                            handleOpenMenu={handleOpenMenu}
                            handlePress={handlePress}
                        />
                    )}
                    estimatedItemSize={200}
                    data={combinedData}
                />
            </View>

            <FileOptionsMenu
                menuVisible={menuVisible}
                menuPosition={menuPosition}
                handleDownload={handleDownload}
                isLoading={isLoading}
                onClose={() => setMenuVisible(false)}
            />
        </SafeAreaView>
    );
};

const FileListItem = ({ item, handlePress, handleOpenMenu }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => handlePress(item)}>
        <View style={styles.listItemContent}>
            <Image
                source={{ uri: getFileIconUri(item) }}
                style={{
                    width: 40,
                    height: 40,
                }}
            />
            <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle} numberOfLines={1}>
                    {item.type === 'folder' ? item.folderName : item.filename}
                </Text>
                {item.type !== 'folder' && (
                    <View style={styles.listItemSubtextContainer}>
                        <Ionicons name="people" size={16} color={color.zinc[400]} />
                        <Text style={styles.listItemSubtext} numberOfLines={1}>
                            {item.owner} • {dayjs(item.creationdate).format("DD/MM/YYYY")}
                        </Text>
                    </View>
                )}
            </View>
        </View>
        {item.type !== 'folder' && (
            <TouchableOpacity onPress={(event) => handleOpenMenu(item, event)} style={styles.listItemAction}>
                <Ionicons name="ellipsis-vertical" size={20} color="black" />
            </TouchableOpacity>
        )}
    </TouchableOpacity>
);

const FileOptionsMenu = ({ menuVisible, menuPosition, handleDownload, isLoading, onClose }) => (
    <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={onClose}
        statusBarTranslucent
    >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.menuContainer, { top: menuPosition.top, left: menuPosition.left }]}>
            <TouchableOpacity onPress={handleDownload} style={styles.menuItem}>
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
);

const getFileIconUri = (item) => {
    return item.type === 'folder'
        ? "https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png"
        : item.storage_provider === "cloudinary"
            ? `${CLOUDINARY_URL}${item.file_id}.${item.filename.split('.').pop()}`
            : item.icon.icon_url;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    actionContainer: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        paddingHorizontal: 10,
        backgroundColor: color.blue[600],
        borderRadius: 20,
        marginRight: 10,
        gap: 2,
    },
    firstButton: {
        marginRight: 0,
    },
    buttonText: {
        color: color.white,
        fontFamily: 'SukhumvitSet-SemiBold',
    },
    listContainer: {
        flex: 1,
        marginHorizontal: 8,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 0.3,
        borderColor: color.zinc[200],
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    listItemTextContainer: {
        width: "78%",
    },
    listItemTitle: {
        fontFamily: 'SukhumvitSet-SemiBold',
        fontSize: 16,
    },
    listItemIcon: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderWidth: 0.5,
        borderColor: color.gray[300],
        borderRadius: 5,
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
});

export default FolderScreen;

