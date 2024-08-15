import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FlashList } from '@shopify/flash-list'
import color from '../../../constant/color'
import { useFetchBranchs } from '../../../hooks/useFetchBranchs'
import CustomHeader from '../../../navigation/CustomHeader'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useFiles } from '../../../context/FilesComtext'
import { useFocusEffect } from '@react-navigation/native'

const FolderScreen = ({ navigation }) => {
    const folders = useFetchBranchs();
    const { filteredFiles, loading, searchQuery, setSearchQuery, fetchFilesWithIcons } = useFiles({ branch: null, type_cars: null });

    useFocusEffect(
        React.useCallback(() => {
            setSearchQuery('');
            fetchFilesWithIcons();
            return () => { };
        }, [setSearchQuery])
    );

    const filteredFolders = useMemo(() => {
        if (!searchQuery) return folders;

        return folders.filter(folder =>
            filteredFiles.some(file => file.branch_id === folder.id)
        );
    }, [folders, filteredFiles, searchQuery]);

    const handlePress = (item: any) => {
        navigation.navigate("TypeCars", { branch: item });
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
                                {/* @ts-ignore */}
                                <Image source={{ uri: "https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png" }} style={styles.listItemIcon} />
                                <View style={styles.listItemTextContainer}>
                                    <Text style={styles.listItemTitle} numberOfLines={1}>
                                        {item.branch_name}
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={color.blue[950]} />
                        </TouchableOpacity>
                    )}
                    estimatedItemSize={200}
                    data={filteredFolders}
                />
            </View>

        </View>
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
        width: 30,
        height: 30,
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
})