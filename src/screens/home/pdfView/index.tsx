import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Alert, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../../context/AuthContext';
import color from '../../../constant/color';
import { useFocusEffect } from '@react-navigation/native';
import { usePDF } from '../../../context/PDFContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GOOGLE_CLOUD_DOWNLOAD_URL } from '../../../utils/cloudinary';

const PDFView = ({ navigation, route }) => {
    const { fileId, fileName, storageProvider } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const { session } = useAuth();
    const { pdfData, loadPdf } = usePDF();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            // Cleanup function to prevent memory leaks
            isMounted.current = false;
        };
    }, []);

    const handleDownload = async () => {
        setIsLoading(true);
        const accessToken = session?.access_token;
        const refreshToken = session?.refresh_token;

        if (accessToken && refreshToken) {
            try {
                await loadPdf(fileId, "po.pdf", storageProvider, accessToken, refreshToken, downloadFile);
            } catch (error) {
                if (isMounted.current) {
                    console.error("Download failed", error);
                }
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        } else {
            console.log('Tokens are not available');
            setIsLoading(false);
        }
    };

    const downloadFile = async (
        fileIdx: string,
        accessToken: string,
        refreshToken: string,
        file_name: string,
        storageProvider: string
    ) => {
        try {
            if (storageProvider !== 'google_drive') {
                Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปิดดูได้ อาจมีข้อผิดพลาดในการอัปโหลดไฟล์', [
                    { text: 'OK', onPress: () => { } },
                ]);
                setIsLoading(false);
                return;
            }

            const apiEndpoint = `${GOOGLE_CLOUD_DOWNLOAD_URL}?fileId=${fileIdx}`;
            const fileUri = FileSystem.documentDirectory + file_name;

            const response = await FileSystem.downloadAsync(apiEndpoint, fileUri, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken,
                },
            });

            if (!response.uri) {
                throw new Error(`Failed to download file: ${response.status}`);
            }

            return response.uri;
        } catch (error) {
            if (isMounted.current) {
                Alert.alert('Download failed', error.message);
            }
            throw error;
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!pdfData[fileId]) {
                handleDownload();
            }
        }, [fileId, pdfData])
    );

    const { top } = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { marginTop: Platform.OS === "ios" ? 0 : top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"} size={26} color={color.black} />

                </TouchableOpacity>
                <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
            </View>

            {/* PDF Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={30} color={color.blue[600]} />
                    <Text style={styles.loadingText}>กำลังโหลดเอกสาร...</Text>
                </View>
            ) : (
                pdfData[fileId] && (
                    <Pdf
                        source={{ uri: pdfData[fileId] }}
                        onError={error => {
                            if (isMounted.current) {
                                console.log(error);
                                Alert.alert('Error', 'Failed to load PDF');
                            }
                        }}
                        style={styles.pdf}
                    />
                )
            )}
        </SafeAreaView>
    );
};

export default PDFView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: color.zinc[200],
        marginBottom: 5,
    },
    backButton: {
        paddingLeft: 10,
        paddingRight: 20,
    },
    fileName: {
        fontSize: 18,
        fontFamily: 'SukhumvitSet-SemiBold',
        color: color.black,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    loadingText: {
        fontFamily: 'SukhumvitSet-Medium',
        fontSize: 12,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height - 40,
        borderRadius: 10,
        overflow: 'hidden',
    },
});
