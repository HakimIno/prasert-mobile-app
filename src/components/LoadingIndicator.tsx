import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import color from '../constant/color';

const LoadingIndicator = ({ message = 'กำลังโหลด...', size = 30 }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color.blue[600]} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 40,
        gap: 5,
    },
    message: {
        fontSize: 16,
        fontFamily: 'SukhumvitSet-SemiBold', // คุณสามารถเปลี่ยนฟอนต์ได้ตามที่ต้องการ
        color: color.blue[600], // คุณสามารถเปลี่ยนสีข้อความได้ตามที่ต้องการ
    },
});

export default LoadingIndicator;
