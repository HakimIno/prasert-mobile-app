import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const useFetchBranchs = () => {
    const [dataBranchs, setDataBranchs] = useState<{ id: number, branch_name: string }[]>([]);

    const fetchBranchs = async () => {
        const { data, error } = await supabase
            .from('branchs')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching data from branchs:', error);
        } else {
            setDataBranchs(data);
        }
    };

    useEffect(() => {
        // Fetch the data once when the component mounts
        fetchBranchs();

        // Set up a Realtime subscription to listen for changes
        const channel = supabase
            .channel('public:branchs')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'branchs' },
                (payload) => {
                    console.log('Change detected in branchs table:', payload);
                    fetchBranchs(); // Refresh data when a change is detected
                }
            )
            .subscribe();

        // Cleanup subscription on component unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, []); // Empty dependency array ensures it only runs once on mount

    return dataBranchs;
};
