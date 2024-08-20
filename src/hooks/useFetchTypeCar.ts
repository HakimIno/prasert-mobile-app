import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const useFetchTypeCar = (branchId: unknown) => {
    const [dataTypeCars, setDataTypeCars] = useState<{ id: number, car_type_name: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // สถานะ loading

    const fetchTypeCars = async () => {
        setLoading(true); // เริ่มต้นการโหลด

        // สร้าง query แบบ conditional
        let query = supabase.from('type_cars').select('*');

        if (branchId) {
            query = query.eq('branch_id', branchId); // กรองตาม branchId ถ้ามี
        }

        query = query.order('id', { ascending: true }); // จัดเรียงข้อมูล

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching data from type_cars:', error);
        } else {
            setDataTypeCars(data || []);
        }
        setLoading(false); // สิ้นสุดการโหลด
    };

    useEffect(() => {
        fetchTypeCars(); // เรียกใช้ฟังก์ชัน fetch เมื่อ component ถูก mount หรือ branchId เปลี่ยน

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
            supabase.removeChannel(channel); // ลบ subscription เมื่อ component ถูก unmount
        };
    }, [branchId]); // Re-run when branchId changes

    return { dataTypeCars, loading, fetchTypeCars }; // ส่งสถานะ loading กลับไปด้วย
};
