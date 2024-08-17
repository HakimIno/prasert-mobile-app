import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const useFetchTypeCar = (branchId: unknown) => {
    const [dataTypeCars, setDataTypeCars] = useState<{ id: number, car_type_name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // สถานะ loading

    const fetchTypeCars = async () => {
        setLoading(true); // เริ่มต้นการโหลด
        const { data, error } = await supabase
            .from('type_cars')
            .select('*')
            .eq('branch_id', branchId) // กรองข้อมูลตาม branch_id
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching data from type_cars:', error);
        } else {
            setDataTypeCars(data);
        }
        setLoading(false); // สิ้นสุดการโหลด
    };

    useEffect(() => {
        if (branchId) {
            fetchTypeCars();

            const channel = supabase
                .channel('public:type_cars')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'type_cars' },
                    (payload) => {
                        console.log('Change detected in type_cars table:', payload);
                        fetchTypeCars(); // Refresh data when a change is detected
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [branchId]); // Re-run when branchId changes

    return { dataTypeCars, loading, fetchTypeCars }; // ส่งสถานะ loading กลับไปด้วย
};
