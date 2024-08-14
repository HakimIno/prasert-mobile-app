import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

type File = {
    id: number;
    filename: string;
    creationdate: string;
    owner: string;
    icon: { id: number, icon_url: string }[];
};

type FilesContextType = {
    files: File[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [cachedFiles, setCachedFiles] = useState<File[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchFilesWithIcons = async () => {
        setLoading(true);

        let query = supabase
            .from('files')
            .select(`
                id,
                file_id,
                filename,
                creationdate,
                owner,
                icon (
                    id,
                    icon_url
                ),
                branchs (
                    id,
                    branch_name
                )
            `).order('creationdate', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching files with icons:', error);
            setLoading(false);
            return;
        }

        const filteredData = data || [];
        setCachedFiles(filteredData);
        setFiles(filteredData);

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchFilesWithIcons();

        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'files' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchFilesWithIcons();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const searchQueryLower = searchQuery.toLowerCase();
            const filteredData = cachedFiles.filter(file =>
                file.filename.toLowerCase().includes(searchQueryLower)
            );
            setFiles(filteredData);
        } else {
            setFiles(cachedFiles);
        }
    }, [searchQuery, cachedFiles]);

    return (
        <FilesContext.Provider value={{ files, loading, searchQuery, setSearchQuery }
        }>
            {children}
        </FilesContext.Provider>
    );
};

export const useFiles = () => {
    const context = useContext(FilesContext);
    if (context === undefined) {
        throw new Error('useFiles must be used within a FilesProvider');
    }
    return context;
};
