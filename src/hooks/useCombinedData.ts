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
        const foldersWithType = folders.map(folder => ({
            ...folder,
            type: 'folder',
            folderName: folder.branch_name,
            type_in: "branch",
        }));

        if (searchQuery) {
            const searchQueryLowerCase = searchQuery.toLowerCase();

            const filteredBranchFolders = folders
                .filter(folder => folder.branch_name.toLowerCase().includes(searchQueryLowerCase))
                .map(folder => ({
                    ...folder,
                    folderName: folder.branch_name,
                    type: 'folder',
                    type_in: "branch"
                }));

            const filteredTypeCarFolders = dataTypeCars
                .filter(typeCar => typeCar.car_type_name.toLowerCase().includes(searchQueryLowerCase))
                .map(typeCar => ({
                    ...typeCar,
                    folderName: typeCar.car_type_name,
                    type: 'folder',
                    type_in: "typeCar"
                }));

            const filteredFilesWithFolders = filteredFiles
                .filter(file => file.filename.toLowerCase().includes(searchQueryLowerCase) && file.file_id)
                .map(file => {
                    const associatedFolder = folders.find(folder => folder.id === file.branch_id);
                    return {
                        ...file,
                        type: 'file',
                        folderName: associatedFolder ? associatedFolder.branch_name : "Unknown Folder",
                        file_id: file.file_id
                    };
                });

            return [...filteredBranchFolders, ...filteredTypeCarFolders, ...filteredFilesWithFolders];
        } else {
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
