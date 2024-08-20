import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

type File = {
    branchs: any;
    type_cars: any;
    branch_id: number;
    id: number;
    filename: string;
    creationdate: string;
    owner: string;
    storage_provider: string;
    file_id: string;
    type_car_id: number;
    icon: { id: number, icon_url: string }[];
};

type FilesContextType = {
    filteredFiles: File[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    fetchFilesWithIcons: (branchId?: number, typeCarsId?: number) => Promise<void>;
    resetSearchQuery: () => void;
    restoreSearchQuery: () => void
};

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }) => {
    const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [cachedFiles, setCachedFiles] = useState<File[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchQueryRef = useRef<string>("");

    const fetchFilesWithIcons = async (branchId?: number, typeCarsId?: number) => {
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
            branch_id,  
            type_car_id, 
            storage_provider,
            file_id,
            branchs:branch_id (branch_name),
            type_cars:type_car_id (car_type_name)
        `).order('creationdate', { ascending: false });

        if (branchId) {
            query = query.eq('branch_id', branchId);
        }

        if (typeCarsId) {
            query = query.eq('type_car_id', typeCarsId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching files with icons:', error);
            setLoading(false);
            return;
        }

        const filteredData = data || [];

        setCachedFiles(filteredData);
        setFilteredFiles(filteredData);

        setLoading(false);
    };

    const resetSearchQuery = () => {
        searchQueryRef.current = searchQuery; // เก็บค่า searchQuery ปัจจุบัน
        setSearchQuery("");
    };

    const restoreSearchQuery = () => {
        setSearchQuery(searchQueryRef.current); // คืนค่า searchQuery จาก useRef
    };

    useEffect(() => {
        fetchFilesWithIcons();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const searchQueryLower = searchQuery.toLowerCase();
            const filteredData = cachedFiles.filter(file =>
                file.filename.toLowerCase().includes(searchQueryLower)
            );
            setFilteredFiles(filteredData);
        } else {
            setFilteredFiles(cachedFiles);
        }
    }, [searchQuery, cachedFiles]);

    return (
        <FilesContext.Provider value={{ filteredFiles, loading, searchQuery, setSearchQuery, fetchFilesWithIcons, resetSearchQuery, restoreSearchQuery }}>
            {children}
        </FilesContext.Provider>
    );
};

export const useFiles = ({ branch, type_cars }) => {
    const context = useContext(FilesContext);
    if (context === undefined) {
        throw new Error('useFiles must be used within a FilesProvider');
    }

    useEffect(() => {
        context.fetchFilesWithIcons(branch?.id, type_cars?.id);
    }, [branch?.id, type_cars?.id]); // ใช้ branch?.id และ type_cars?.id ใน dependency array

    return context;
};

