import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const useFetchIcons = () => {
    const [dataIcon, setDataIcon] = useState<{ id: number, icon_url: string; type: string; abbreviation: string }[]>([]);

    const fetchIcons = async () => {
        const { data, error } = await supabase
            .from('icon')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching data from icon:', error);
        } else {
            setDataIcon(data);
        }
    };

    useEffect(() => {
        // Fetch the data once when the component mounts
        fetchIcons();

        // // Set up a Realtime subscription to listen for changes
        // const channel = supabase
        //     .channel('public:icon')
        //     .on(
        //         'postgres_changes',
        //         { event: '*', schema: 'public', table: 'icon' },
        //         (payload) => {
        //             console.log('Change detected in icon table:', payload);
        //             fetchIcons(); // Refresh data when a change is detected
        //         }
        //     )
        //     .subscribe();

        // // Cleanup subscription on component unmount
        // return () => {
        //     supabase.removeChannel(channel);
        // };
    }, []); // Empty dependency array ensures it only runs once on mount

    return dataIcon;
};
