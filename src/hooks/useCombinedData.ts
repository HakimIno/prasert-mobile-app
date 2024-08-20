import { useMemo } from 'react';
import { useFetchBranchs } from './useFetchBranchs';
import { useFetchTypeCar } from './useFetchTypeCar';
import { useFiles } from '../context/FilesComtext';

type FolderType = {
    type: 'folder';
    id: number;
    branch_name?: string;
    car_type_name?: string;
    folderName: string;
};

type FileType = {
    type: 'file';
    branchs: any;
    type_cars: any;
    branch_id: number;
    id: number;
    filename: string;
    creationdate: string;
    owner: string;
    storage_provider: string;
    file_id: string;
    icon: { id: number, icon_url: string };
    folderName?: string;
};

// Combined type
type CombinedDataType = FolderType | FileType;

export const useCombinedData = () => {
    const folders = useFetchBranchs();
    const { dataTypeCars } = useFetchTypeCar(null);
    const { filteredFiles, searchQuery, setSearchQuery, fetchFilesWithIcons, } = useFiles({ branch: null, type_cars: null });

    //@ts-ignore
    const combinedData: CombinedDataType[] = useMemo(() => {
        // แปลงข้อมูลโฟลเดอร์ให้มีประเภท 'folder'
        const foldersWithType = folders.map(folder => ({
            ...folder,
            type: 'folder',
            folderName: folder.branch_name,
            type_in: "branch",
        }));

        if (searchQuery) {
            const searchQueryLowerCase = searchQuery.toLowerCase();

            // กรองและแปลงโฟลเดอร์ตามสาขา (branch)
            const filteredBranchFolders = folders
                .filter(folder => folder.branch_name.toLowerCase().includes(searchQueryLowerCase))
                .map(folder => ({
                    ...folder,
                    folderName: folder.branch_name,
                    type: 'folder',
                    type_in: "branch"
                }));

            // กรองและแปลงโฟลเดอร์ตามประเภทรถยนต์ (typeCar)
            const filteredTypeCarFolders = dataTypeCars
                .filter(typeCar => typeCar.car_type_name.toLowerCase().includes(searchQueryLowerCase))
                .map(typeCar => ({
                    ...typeCar,
                    folderName: typeCar.car_type_name,
                    type: 'folder',
                    type_in: "typeCar"
                }));

            // กรองและแปลงไฟล์ที่ตรงกับ searchQuery
            const filteredFilesWithFolders = filteredFiles
                .filter(file => file.filename.toLowerCase().includes(searchQueryLowerCase))
                .map(file => {
                    // ค้นหาโฟลเดอร์ที่เกี่ยวข้องกับไฟล์
                    const associatedFolder = folders.find(folder => folder.id === file.branch_id) ||
                        dataTypeCars.find(typeCar => typeCar.id === file.type_car_id);
                    return {
                        ...file,
                        type: 'file',
                        //@ts-ignore
                        folderName: associatedFolder ? associatedFolder.branch_name || associatedFolder.car_type_name : "Unknown Folder",
                        file_id: file.file_id
                    };
                });

            // เพิ่มโฟลเดอร์ที่มีไฟล์ที่ตรงกับ searchQuery
            const foldersWithMatchingFiles = foldersWithType.filter(folder =>
                filteredFilesWithFolders.some(file => file.folderName === folder.folderName)
            );

            const typeCarFoldersWithMatchingFiles = dataTypeCars
                .filter(typeCar =>
                    filteredFilesWithFolders.some(file => file.folderName === typeCar.car_type_name)
                )
                .map(typeCar => ({
                    ...typeCar,
                    folderName: typeCar.car_type_name,
                    type: 'folder',
                    type_in: "typeCar"
                }));

            // รวมผลลัพธ์ทั้งหมด
            const combinedResults = [
                ...filteredBranchFolders,
                ...filteredTypeCarFolders,
                ...foldersWithMatchingFiles,
                ...typeCarFoldersWithMatchingFiles,
                ...filteredFilesWithFolders
            ];

            // จัดเรียงให้โฟลเดอร์มาก่อนไฟล์
            combinedResults.sort((a, b) => {
                if (a.type === 'folder' && b.type !== 'folder') return -1;
                if (a.type !== 'folder' && b.type === 'folder') return 1;
                return 0;
            });

            return combinedResults;
        } else {
            // หากไม่มี searchQuery ให้แสดงเฉพาะโฟลเดอร์
            return [...foldersWithType];
        }
    }, [folders, filteredFiles, searchQuery, dataTypeCars]);




    const isFileType = (item: CombinedDataType): item is FileType => item.type === 'file';

    return {
        filteredFiles,
        combinedData,
        fetchFilesWithIcons,
        setSearchQuery,
        searchQuery,
        isFileType
    };
};
