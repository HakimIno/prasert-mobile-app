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
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: color.white,
        padding: 15
    },
    image: {
        width: "100%",
        height: "60%",
        resizeMode: 'cover',
        borderRadius: 15,
        backgroundColor: color.zinc[50],
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 20
    },
    text: {
        fontSize: 18,
        fontFamily: 'SukhumvitSet-SemiBold',
        color: 'white',
        textAlign: 'center',
    },
});

export default ImageView;
