import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import color from '../../../constant/color';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const ImageView = ({ route, navigation }) => {
    const { items, initialIndex } = route.params; // 'items' is an array of image objects and initialIndex is the index to start from
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image
                source={{
                    uri: item?.storage_provider === "cloudinary" ?
                        `https://res.cloudinary.com/dkm0oeset/image/upload/${item?.file_id}.${item?.filename.split('.').pop()}` :
                        item.icon?.icon_url
                }}
                style={styles.image}
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
        <View style={styles.container}>
            <StatusBar style='light' />
            <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', top: "6%", left: "5%", padding: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 100, zIndex: 100 }}>
                <Ionicons name="close" size={30} color="white" />
            </Pressable>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.file_id}-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={initialIndex} // Start from the clicked image
                style={styles.flatList}
                getItemLayout={(data, index) => (
                    { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
                )} // Improve performance
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                overScrollMode="never"
            />
            <View style={styles.positionIndicator}>
                <Text style={styles.positionText}>
                    {currentIndex + 1} / {items.length}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.99)', // Set background to black
    },
    flatList: {
        flex: 1,
    },
    imageContainer: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    image: {
        width: Dimensions.get('window').width * 0.9, // Scale the image down slightly
        height: Dimensions.get('window').height * 0.6, // Set the height relative to the screen
        resizeMode: 'contain',
        borderRadius: 15,
    },
    textContainer: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 15,
        borderRadius: 100,
        marginTop: 10,
        position: 'absolute',
        bottom: 60, // Move above the position indicator
    },
    text: {
        fontFamily: 'SukhumvitSet-SemiBold',
        color: '#fff',
        textAlign: 'center',
    },
    positionIndicator: {
        position: 'absolute',
        top: "6%",
        right: "5%",
        paddingHorizontal: 10,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Set background to black
    },
    positionText: {
        color: '#fff',
        fontFamily: 'SukhumvitSet-SemiBold',
    },
});

export default ImageView;
