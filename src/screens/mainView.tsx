'use client';
import ContentViewer from '@/components/ContentViewer/ContentViewer';
import AddFolderModal from '@/components/AddFolderModal/AddFolderModal';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Data } from '@/store/types';
import { useEffect, useState, MouseEvent } from 'react';
import AddFileModal from '@/components/AddFileModal/AddFileModal';
import { useAppDispatch, useAppSelector } from '@/hooks/rtkHooks';
import {
    createNewFile,
    deleteFile,
    fetchFileContent,
    fetchFilesList,
    filesSelector,
    loadingSelector,
    selectedFileSelector,
    setSelectedFile,
    updateFileContent,
} from '@/store/filesSlice';

export default function MainView() {
    const dispatch = useAppDispatch();
    const fileList = useAppSelector(filesSelector);
    // const { data: fileList = [], error, isLoading } = useGetFilesQuery(null);

    // const [fileList, setFileList] = useState<Data[]>([]);
    // const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedFileToDelete, setSelectedFileToDelete] = useState<any>(null);
    const [selectedPath, setSelectedPath] = useState<any>(null);
    const [modalDeleteOpen, setDeleteModalOpen] = useState(false);
    const [modalAddFolderOpen, setAddFolderModalOpen] = useState(false);
    const [modalAddFileOpen, setAddFileModalOpen] = useState(false);
    const [pathsArrays, setPathsArray] = useState<string[]>([]);

    const selectedFile = useAppSelector(selectedFileSelector);
    const isLoading = useAppSelector(loadingSelector);

    const handleFileSelect = (file: Data) => {
        // setSelectedFile(file);
        dispatch(setSelectedFile(file));
        // useGetFileContentQuery(file?.path.split('\\').join('-'));
        !Array.isArray(file.content) &&
            dispatch(fetchFileContent(file!.path.split('\\').join('-')));
    };

    const handleDeleteModalVisibility = () => {
        setDeleteModalOpen(!modalDeleteOpen);
    };
    const handleAddFolderModalVisibility = () => {
        setAddFolderModalOpen(!modalAddFolderOpen);
    };
    const handleAddFileModalVisibility = () => {
        setAddFileModalOpen(!modalAddFileOpen);
    };

    const deleteSelection = async (file: Data) => {
        await dispatch(
            deleteFile({
                path: selectedFile.path.split('\\').join('-'),
            })
        );
        dispatch(setSelectedFile(null));
        await dispatch(fetchFilesList());
        handleDeleteModalVisibility();
    };

    const addFolder = async (name: string) => {
        await dispatch(
            createNewFile({
                path: selectedFile.path.split('\\').join('-'),
                type: 'folder',
                name,
            })
        );
        await dispatch(fetchFilesList());

        handleAddFolderModalVisibility();
    };

    const addFile = async (name: string, type: string, content = '') => {
        await dispatch(
            createNewFile({
                path: selectedFile.path.split('\\').join('-'),
                type: type,
                name,
                content,
            })
        );
        await dispatch(fetchFilesList());
        handleAddFileModalVisibility();
    };

    const updateFile = async (content: string) => {
        await dispatch(
            updateFileContent({
                path: selectedFile.path.split('\\').join('-'),
                content,
            })
        );
        await dispatch(
            fetchFileContent(selectedFile!.path.split('\\').join('-'))
        );
    };

    const handleDeleteButton = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedFileToDelete(file);
        dispatch(setSelectedFile(file));
        handleDeleteModalVisibility();
    };

    const handleAddFolder = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPath(file.path.split('\\'));
        dispatch(setSelectedFile(file));
        handleAddFolderModalVisibility();
    };

    const handleAddFile = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPath(file.path.split('\\'));
        dispatch(setSelectedFile(file));
        handleAddFileModalVisibility();
    };

    // useEffect(() => {
    //     const getPaths = (files: Data[], pathArray: string[]) => {
    //         const [currentPath, ...rest] = pathArray;
    //         const index = files.findIndex((file) => file.name === currentPath);
    //         if (rest.length === 0) {
    //             return (files[index].content as Array<Data>).map(
    //                 (file) => file.path
    //             );
    //         } else {
    //             return getPaths(files[index].content as Array<Data>, rest);
    //         }
    //     };
    //     if (selectedPath !== null) {
    //         let paths = [];
    //         if (selectedPath[0] !== '') {
    //             paths = getPaths(fileList, selectedPath);
    //         } else {
    //             paths = fileList.map((file: Data) => file.path);
    //         }
    //         setPathsArray(paths);
    //     }
    // }, [selectedPath]);

    useEffect(() => {
        dispatch(fetchFilesList());
    }, []);

    return (
        <>
            <div className="flex flex-row min-h-screen font-[family-name:var(--font-geist-sans)]">
                <Sidebar
                    displayFileContent={handleFileSelect}
                    handleDeleteButton={handleDeleteButton}
                    handleAddFolder={handleAddFolder}
                    handleAddFile={handleAddFile}
                />
                {!isLoading ? (
                    <ContentViewer updateFile={updateFile} />
                ) : (
                    'Loading...'
                )}
            </div>
            <DeleteModal
                handleModalVisibility={handleDeleteModalVisibility}
                isOpen={modalDeleteOpen}
                text={'Are you sure you want to delete this file?'}
                confirmBtn={() => deleteSelection(selectedFileToDelete)}
            />
            <AddFolderModal
                handleModalVisibility={handleAddFolderModalVisibility}
                isOpen={modalAddFolderOpen}
                title={'Add Folder'}
                confirmBtn={addFolder}
                pathsArray={pathsArrays}
                selectedPath={selectedPath}
            />
            <AddFileModal
                handleModalVisibility={handleAddFileModalVisibility}
                isOpen={modalAddFileOpen}
                title={'Add File'}
                confirmBtn={addFile}
                pathsArray={pathsArrays}
                selectedPath={selectedPath}
            />
        </>
    );
}
