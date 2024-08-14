import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const useFetchTypeCar = () => {
    const [dataTypeCars, setDataTypeCars] = useState<{ id: number, car_type_name: string }[]>([]);

    const fetchBranchs = async () => {
        const { data, error } = await supabase
            .from('type_cars')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching data from type_cars:', error);
        } else {
            setDataTypeCars(data);
        }
    };

    useEffect(() => {
        fetchBranchs();

        const channel = supabase
            .channel('public:type_cars')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'type_cars' },
                (payload) => {
                    console.log('Change detected in type_cars table:', payload);
                    fetchBranchs(); // Refresh data when a change is detected
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return dataTypeCars;
};
