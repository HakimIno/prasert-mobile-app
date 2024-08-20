import React, { createContext, useContext, useState, useCallback } from 'react';

type PDFContextType = {
    pdfData: Record<string, string>;
    loadPdf: (
        fileId: string,
        fileName: string,
        storageProvider: string,
        accessToken: string,
        refreshToken: string,
        downloadFile: (
            fileIdx: string,
            accessToken: string,
            refreshToken: string,
            file_name: string,
            storageProvider: string
        ) => Promise<string>
    ) => Promise<void>;
};

const PDFContext = createContext<PDFContextType>({
    pdfData: {},
    loadPdf: async () => { },
});

export const PDFProvider = ({ children }) => {
    const [pdfData, setPdfData] = useState({});

    const loadPdf = useCallback(async (fileId, fileName, storageProvider, accessToken, refreshToken, downloadFile) => {
        if (!pdfData[fileId]) {
            try {
                const uri = await downloadFile(fileId, accessToken, refreshToken, fileName, storageProvider);
                if (uri) {
                    setPdfData(prevState => ({ ...prevState, [fileId]: uri }));
                }
            } catch (error) {
                console.error("Failed to load PDF", error);
            }
        }
    }, [pdfData]);

    return (
        <PDFContext.Provider value={{ pdfData, loadPdf }}>
            {children}
        </PDFContext.Provider>
    );
};

export const usePDF = () => useContext(PDFContext);
