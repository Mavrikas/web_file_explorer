'use client';
import ContentViewer from '@/components/ContentViewer/ContentViewer';
import AddFolderModal from '@/components/AddFolderModal/AddFolderModal';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import Sidebar from '@/components/Sidebar/Sidebar';
import { CreateItemTypes, Data, FolderType } from '@/store/types';
import { useEffect, useState, MouseEvent } from 'react';
import AddFileModal from '@/components/AddFileModal/AddFileModal';
import { useAppDispatch, useAppSelector } from '@/hooks/rtkHooks';
import {
    createNewFile,
    deleteFile,
    fetchFileContent,
    fetchFilesList,
    loadingSelector,
    selectedFileSelector,
    setSelectedFile,
    updateFileContent,
} from '@/store/filesSlice';

export default function MainView() {
    const dispatch = useAppDispatch();

    const [selectedFileToDelete, setSelectedFileToDelete] = useState<any>(null);
    const [modalDeleteOpen, setDeleteModalOpen] = useState(false);
    const [modalAddFolderOpen, setAddFolderModalOpen] = useState(false);
    const [modalAddFileOpen, setAddFileModalOpen] = useState(false);

    const selectedFile = useAppSelector(selectedFileSelector);
    const isLoading = useAppSelector(loadingSelector);

    const handleFileSelect = (file: Data) => {
        dispatch(setSelectedFile(file));
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
    const closeModals = () => {
        setDeleteModalOpen(false);
        setAddFolderModalOpen(false);
        setAddFileModalOpen(false);
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

    const addItem = async (
        name: string,
        type: CreateItemTypes,
        content?: string | []
    ) => {
        await dispatch(
            createNewFile({
                path: selectedFile.path.split('\\').join('-'),
                type: type,
                name,
                content: content ?? '',
            })
        );
        await dispatch(fetchFilesList());
        closeModals();
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

    const handleCreateAction = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data,
        type?: FolderType
    ) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch(setSelectedFile(file));
        if (type === 'folder') {
            handleAddFolderModalVisibility();
        } else {
            handleAddFileModalVisibility();
        }
    };

    useEffect(() => {
        dispatch(fetchFilesList());
    }, []);

    return (
        <>
            <div className="flex flex-row min-h-screen font-[family-name:var(--font-geist-sans)]">
                <Sidebar
                    displayFileContent={handleFileSelect}
                    handleDeleteButton={handleDeleteButton}
                    handleCreate={handleCreateAction}
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
                confirmBtn={addItem}
                pathsArray={selectedFile?.content ?? []}
            />
            <AddFileModal
                handleModalVisibility={handleAddFileModalVisibility}
                isOpen={modalAddFileOpen}
                title={'Add File'}
                confirmBtn={addItem}
                pathsArray={selectedFile?.content ?? []}
            />
        </>
    );
}
