'use client';
import ContentViewer from '@/components/ContentViewer/ContentViewer';
import AddFolderModal from '@/components/AddFolderModal/AddFolderModal';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import Modal from '@/components/Modal/Modal';
import Sidebar from '@/components/Sidebar/Sidebar';
import { getFiles } from '@/controllers/files';
import { Data } from '@/store/types';
import { useEffect, useState, MouseEvent } from 'react';
import AddFileModal from '@/components/AddFileModal/AddFileModal';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const [fileList, setFileList] = useState<any>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedFileToDelete, setSelectedFileToDelete] = useState<any>(null);
    const [selectedPath, setSelectedPath] = useState<any>(null);
    const [modalDeleteOpen, setDeleteModalOpen] = useState<any>(false);
    const [modalAddFolderOpen, setAddFolderModalOpen] = useState<any>(false);
    const [modalAddFileOpen, setAddFileModalOpen] = useState<any>(false);
    const [pathsArrays, setPathsArray] = useState<any>([]);

    const handleFileSelect = (file: Data | null) => {
        setSelectedFile(file);
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

    const deleteSelection = (file: Data) => {
        const tempFiles = structuredClone(fileList);
        const filePathArray = file.path.split('\\');

        const findAndDeleteFile = (files: Data[], pathArray: string[]) => {
            const [currentPath, ...rest] = pathArray;
            const index = files.findIndex((file) => file.name === currentPath);
            if (rest.length === 0) {
                files.splice(index, 1);
            } else {
                if (Array.isArray(files[index].content)) {
                    findAndDeleteFile(files[index].content, rest);
                }
            }
        };
        findAndDeleteFile(tempFiles, filePathArray);

        if (selectedFile) {
            const selectedFilePathArray = selectedFile?.path.split('\\');
            for (const dir of selectedFilePathArray) {
                if (filePathArray.includes(dir)) {
                    handleFileSelect(null);
                    break;
                }
            }
        }

        setFileList(tempFiles);
        handleDeleteModalVisibility();
    };

    const addFolder = (name: string) => {
        const tempFiles = structuredClone(fileList);

        const findAndAddFolder = (files: Data[], pathArray: string[]) => {
            const [currentPath, ...rest] = pathArray;
            const index = files.findIndex((file) => file.name === currentPath);
            if (rest.length === 0) {
                (files[index].content as Array<Data>).push({
                    id: uuidv4(),
                    name: name,
                    path: `${files[index].path}\\${name}`,
                    content: [],
                });
            } else {
                findAndAddFolder(files[index].content as Array<Data>, rest);
            }
        };

        if (selectedPath.length === 1 && selectedPath[0] === '') {
            tempFiles.push({
                id: uuidv4(),
                name: name,
                path: name,
                content: [],
            });
        } else {
            findAndAddFolder(tempFiles, selectedPath);
        }
        setFileList(tempFiles);
        handleAddFolderModalVisibility();
    };

    const addFile = (name: string, type: string, content = '') => {
        const tempFiles = structuredClone(fileList);

        const findAndAddFile = (files: Data[], pathArray: string[]) => {
            const [currentPath, ...rest] = pathArray;
            const index = files.findIndex((file) => file.name === currentPath);
            if (rest.length === 0) {
                (files[index].content as Array<Data>).push({
                    id: uuidv4(),
                    name: `${name}.${type}`,
                    path: `${files[index].path}\\${name}.${type}`,
                    content: content,
                });
            } else {
                findAndAddFile(files[index].content as Array<Data>, rest);
            }
        };
        if (selectedPath.length === 1 && selectedPath[0] === '') {
            tempFiles.push({
                id: uuidv4(),
                name: `${name}.${type}`,
                path: `${name}.${type}`,
                content: content,
            });
        } else {
            findAndAddFile(tempFiles, selectedPath);
        }

        setFileList(tempFiles);
        handleAddFileModalVisibility();
    };

    const searchList = (search: string) => {
        const filterFiles = (files: Data[]): Data[] => {
            return files.reduce((acc: Data[], file) => {
                if (file.name.toLowerCase().includes(search.toLowerCase())) {
                    acc.push(file);
                    if (Array.isArray(file.content)) {
                        acc.pop();
                        const filteredContent = filterFiles(file.content);
                        if (filteredContent.length > 0) {
                            acc.push({
                                ...file,
                                content: filteredContent,
                            });
                        }
                    }
                } else if (Array.isArray(file.content)) {
                    const filteredContent = filterFiles(file.content);
                    if (filteredContent.length > 0) {
                        acc.push({
                            ...file,
                            content: filteredContent,
                        });
                    }
                }
                return acc;
            }, []);
        };
        setFileList(filterFiles(getFiles()));
    };

    const updateFile = (content: string) => {
        const tempFiles = structuredClone(fileList);
        const findAndUpdateFile = (files: Data[], pathArray: string[]) => {
            const [currentPath, ...rest] = pathArray;
            const index = files.findIndex((file) => file.name === currentPath);
            if (rest.length === 0) {
                files[index].content = content;
            } else {
                findAndUpdateFile(files[index].content as Array<Data>, rest);
            }
        };
        findAndUpdateFile(tempFiles, selectedFile.path.split('\\'));
        setFileList(tempFiles);
        setSelectedFile({ ...selectedFile, content: content });
    };

    const handleDeleteButton = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedFileToDelete(file);
        handleDeleteModalVisibility();
    };

    const handleAddFolder = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPath(file.path.split('\\'));
        handleAddFolderModalVisibility();
    };

    const handleAddFile = (
        event: MouseEvent<HTMLButtonElement>,
        file: Data
    ) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPath(file.path.split('\\'));
        handleAddFileModalVisibility();
    };

    useEffect(() => {
        const getPaths = (files: Data[], pathArray: string[]) => {
            const [currentPath, ...rest] = pathArray;
            const index = files.findIndex((file) => file.name === currentPath);
            if (rest.length === 0) {
                return (files[index].content as Array<Data>).map(
                    (file) => file.path
                );
            } else {
                return getPaths(files[index].content as Array<Data>, rest);
            }
        };
        if (selectedPath !== null) {
            let paths = [];
            if (selectedPath[0] !== '') {
                paths = getPaths(fileList, selectedPath);
            } else {
                paths = fileList.map((file: Data) => file.path);
            }
            setPathsArray(paths);
        }
    }, [selectedPath]);

    useEffect(() => {
        setFileList(getFiles());
    }, []);

    return (
        <>
            <div className="flex flex-row min-h-screen font-[family-name:var(--font-geist-sans)]">
                <Sidebar
                    files={fileList}
                    displayFileContent={handleFileSelect}
                    handleDeleteButton={handleDeleteButton}
                    handleAddFolder={handleAddFolder}
                    handleAddFile={handleAddFile}
                    searchList={searchList}
                />
                <ContentViewer file={selectedFile} updateFile={updateFile} />
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
