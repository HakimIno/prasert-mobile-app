import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

type File = {
    id: number;
    filename: string;
    creationdate: string; // หรือ Date ถ้าคุณต้องการใช้ object ของ Date
    owner: string;
    icon: { icon_url: string }[];
};

export const useFetchFiles = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [cachedFiles, setCachedFiles] = useState<File[]>([]); // เก็บข้อมูลเดิมไว้ใน cachedFiles

    const fetchFilesWithIcons = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('files')
            .select(`
                id,
                file_id,
                filename,
                creationdate,
                owner,
                icon:icon (
                    icon_url
                )
            `);

        if (error) {
            console.error('Error fetching files with icons:', error);
            setLoading(false);
            return;
        }

        if (data) {
            setCachedFiles(data); // อัปเดตข้อมูลเดิมใน cachedFiles
        }
        setFiles(data || []);

        setTimeout(() => {
            setLoading(false);
        }, 1000); // หน่วงเวลา 5 วินาที
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

    return { files: loading ? cachedFiles : files, loading };
};
