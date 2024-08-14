import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { FlashList } from '@shopify/flash-list'
import color from '../../../constant/color'
import { useFetchTypeCar } from '../../../hooks/useFetchTypeCar'
import CustomHeader from '../../../navigation/CustomHeader'
import { AntDesign, Ionicons } from '@expo/vector-icons'

const TypeCarsScreen = ({ navigation, route }) => {
    const folders = useFetchTypeCar()

    const { branch } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar style="auto" backgroundColor='white' />
            <CustomHeader />
            <View style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={[styles.button, styles.firstButton, { gap: 2 }]}>
                    <AntDesign name="home" size={18} color={color.blue[600]} />
                    <Text style={styles.buttonText}>หน้าแรก</Text>
                </Pressable>
                <Ionicons name="chevron-forward" size={16} color={color.blue[600]} />
                <Pressable
                    onPress={() => { }}
                    style={[styles.button, { backgroundColor: color.blue[600] }]}>
                    <Text style={[styles.buttonText, { color: color.white }]}>{branch?.branch_name}</Text>
                </Pressable>
            </View>
            <View style={{ flex: 1, marginHorizontal: 8 }}>
                <FlashList
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("Home", { branch, type_cars: item })}>
                            <View style={styles.listItemContent}>
                                {/* @ts-ignore */}
                                <Image source={{ uri: "https://gpamonnosfwdoxjvyrcw.supabase.co/storage/v1/object/public/media/FIleIcon/folder.png" }} style={styles.listItemIcon} />
                                <View style={styles.listItemTextContainer}>
                                    <Text style={styles.listItemTitle} numberOfLines={1}>
                                        {item?.car_type_name}
                                    </Text>
                                </View>
                            </View>

                            <Ionicons name="chevron-forward" size={16} color={color.blue[950]} />
                        </TouchableOpacity>
                    )}
                    estimatedItemSize={200}
                    data={folders}
                />
            </View>

        </View>
    )
}

export default TypeCarsScreen

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
})