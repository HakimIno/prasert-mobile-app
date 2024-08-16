import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import color from '../constant/color';

const BreadcrumbButton = ({ onPress, children, icon, style, textStyle }) => (
    <Pressable onPress={onPress} style={[styles.button, style]}>
        {icon && icon}
        <Text style={[styles.buttonText, textStyle]} numberOfLines={1}>
            {children}
        </Text>
    </Pressable>
);

export default function Breadcrumb({ items, navigation }) {
    return (
        <ScrollView
            style={styles.scrollView}
            horizontal
            contentContainerStyle={styles.scrollViewContent}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <BreadcrumbButton
                        onPress={item.onPress}
                        icon={item.icon}
                        style={item.style}
                        textStyle={item.textStyle}
                    >
                        {item.label}
                    </BreadcrumbButton>
                    {index < items.length - 1 && (
                        <Ionicons name="chevron-forward" size={16} color={color.blue[600]} />
                    )}
                </React.Fragment>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
    },
    scrollViewContent: {
        flexDirection: 'row',
        alignItems: 'center',
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
