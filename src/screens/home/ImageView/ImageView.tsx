import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, Platform, Pressable, SafeAreaView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CLOUDINARY_URL } from '../../../utils/cloudinary';

const ImageView = ({ route, navigation }) => {
    const { items, initialIndex } = route.params;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const { width, height } = useWindowDimensions(); // ดึงขนาดหน้าจอปัจจุบัน

    const renderItem = ({ item }) => (
        <View style={[styles.imageContainer, { width }]}>
            <Image
                source={{
                    uri: item?.storage_provider === "cloudinary" ?
                        `${CLOUDINARY_URL}${item?.file_id}.${item?.filename.split('.').pop()}` :
                        item.icon?.icon_url
                }}
                style={[styles.image, { width: width * 0.9, height: height * 0.6 }]} // ปรับขนาดตามหน้าจอ
            />
            <View style={styles.textContainer}>
                <Text style={styles.text} numberOfLines={1}>{item.filename}</Text>
            </View>
        </View>
    );

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='light' />
            <Pressable
                onPress={() => navigation.goBack()}
                style={[styles.closeButton, { top: height * 0.06, left: width * 0.06 }]}
            >
                <Ionicons name="close" size={30} color="white" />
            </Pressable>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.file_id}-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={initialIndex}
                style={styles.flatList}
                getItemLayout={(data, index) => (
                    { length: width, offset: width * index, index }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                overScrollMode="never"
            />
            <View style={[styles.positionIndicator, { top: Platform.OS === "ios" ? height * 0.07 : height * 0.06, right: Platform.OS === "ios" ? width * 0.07 : width * 0.06 }]}>
                <Text style={styles.positionText}>
                    {currentIndex + 1} / {items.length}
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.99)',
    },
    flatList: {
        flex: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    image: {
        resizeMode: 'contain',
        borderRadius: 15,
    },
    textContainer: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 15,
        borderRadius: 100,
        marginTop: 10,
        position: 'absolute',
        bottom: 60,
    },
    text: {
        fontFamily: 'SukhumvitSet-SemiBold',
        color: '#fff',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 100,
        zIndex: 100,
    },
    positionIndicator: {
        position: 'absolute',
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    positionText: {
        color: '#fff',
        fontFamily: 'SukhumvitSet-SemiBold',
    },
});

export default ImageView;
