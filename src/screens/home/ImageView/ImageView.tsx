// ImageView.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import color from '../../../constant/color';

const ImageView = ({ route }) => {
    const { item } = route.params;

    return (
        <View style={styles.container}>
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        padding: 5
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: 'contain',
        borderRadius: 15,
        backgroundColor: color.white,
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingVertical: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 5,

    },
    text: {
        fontSize: 16,
        fontFamily: 'SukhumvitSet-Bold',
        color: '#1a1a1a',
        textAlign: 'left',
    },
});

export default ImageView;
