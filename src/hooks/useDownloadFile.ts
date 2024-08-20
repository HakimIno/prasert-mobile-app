import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const useDownloadFile = () => {
    const { session } = useAuth();

    const downloadFile = async (
        fileId: string,
        fileName: string,
        storageProvider: string
    ) => {
        try {
            const { access_token: accessToken, refresh_token: refreshToken } = session || {};

            if (!accessToken || !refreshToken) {
                throw new Error('Tokens are not available');
            }

            let apiEndpoint: string;
            if (storageProvider === 'cloudinary') {
                apiEndpoint = `https://res.cloudinary.com/dkm0oeset/image/upload/${fileId}`;
            } else if (storageProvider === 'google_drive') {
                apiEndpoint = `https://prasert-upload-to-dive.prasertjarernyonte.workers.dev/download?fileId=${fileId}`;
            } else {
                throw new Error('Unsupported storage provider');
            }

            const fileUri = FileSystem.documentDirectory + fileName;
            const response = await FileSystem.downloadAsync(apiEndpoint, fileUri, {
                headers: storageProvider === 'google_drive' ? {
                    Authorization: `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken,
                } : undefined,
            });

            if (!response.uri) {
                throw new Error(`Failed to download file: ${response.status}`);
            }

            Alert.alert('Download complete', `File saved to: ${response.uri}`);
            return response.uri;
        } catch (error) {
            Alert.alert('Download failed', error.message);
        }
    };

    const openFile = async (fileUri: string) => {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert('Error', 'Sharing is not available on this device');
        }
    };

    return { downloadFile, openFile };
};
