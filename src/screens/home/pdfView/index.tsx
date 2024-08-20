import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Alert, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../../context/AuthContext';
import color from '../../../constant/color';
import { useFocusEffect } from '@react-navigation/native';
import { usePDF } from '../../../context/PDFContext';

const PDFView = ({ route }) => {
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
        fileIdx,
        accessToken,
        refreshToken,
        file_name,
        storageProvider
    ) => {
        try {
            let apiEndpoint;
            if (storageProvider === 'google_drive') {
                apiEndpoint = `https://prasert-upload-to-dive.prasertjarernyonte.workers.dev/download?fileId=${fileIdx}`;
            } else {
                throw new Error('Unsupported storage provider');
            }

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

    return (
        <View style={styles.container}>
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
        </View>
    );
};

export default PDFView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        padding: 10,
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