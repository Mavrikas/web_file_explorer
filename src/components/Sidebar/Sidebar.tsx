'use client';
import React, { useState, MouseEvent } from 'react';
import { Data } from '@/store/types';
import Folder from '../Folder/Folder';
import File from '../File/File';
import { ROOT_OBJECT } from '@/constants';
import ActionButtons from '../ActionButtons/ActionButtons';
import { useAppSelector } from '@/hooks/rtkHooks';
import { filesSelector } from '@/store/filesSlice';

type SidebarProps = {
    displayFileContent: (a: Data) => void;
    handleDeleteButton: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFolder: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFile: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
};
export default function Sidebar({
    displayFileContent,
    handleDeleteButton,
    handleAddFolder,
    handleAddFile,
}: SidebarProps) {
    const [search, setSearch] = useState('');
    const fileList = useAppSelector(filesSelector);

    const searchList = (search: string, list: Data[]) => {
        const filterFiles = (files: Data[]): Data[] => {
            return files.reduce((acc: Data[], file) => {
                if (file.name.toLowerCase().includes(search.toLowerCase())) {
                    acc.push(file);
                    if (Array.isArray(file.content)) {
                        acc.pop();
                        const filteredContent = filterFiles(file.content);
                        acc.push({
                            ...file,
                            content: filteredContent,
                        });
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
        return filterFiles(list);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const createStucture = () => {
        const createStuctureRecursive = (contents: Data[]) => {
            return contents?.map((item: Data) => {
                if (Array.isArray(item.content)) {
                    return (
                        <Folder
                            file={item}
                            key={`folder-${item.path}`}
                            handleDeleteButton={handleDeleteButton}
                            handleAddFolder={handleAddFolder}
                            handleAddFile={handleAddFile}
                            displayFileContent={() => displayFileContent(item)}
                        >
                            {createStuctureRecursive(item.content)}
                        </Folder>
                    );
                } else {
                    return (
                        <File
                            key={`file-${item.path}`}
                            displayFileContent={() => displayFileContent(item)}
                            file={item}
                            handleDeleteButton={handleDeleteButton}
                        />
                    );
                }
            });
        };
        return createStuctureRecursive(searchList(search, fileList));
    };

    return (
        <div
            data-testid={'sidebar'}
            className="p-[20px] border-r-2 border-gray-500 min-w-[310px] max-w-[300px] overflow-auto"
        >
            <h1 className="text-xl text-black font-bold">My files</h1>
            <ActionButtons
                handleAddFile={handleAddFile}
                handleAddFolder={handleAddFolder}
                file={ROOT_OBJECT}
                extraClasses="mb-[10px] w-[260px]"
            />
            <input
                type="text"
                className="border-2 border-gray-300 rounded-md w-[260px] p-2 mb-[20px]"
                placeholder="Search"
                onChange={handleSearch}
                value={search}
                data-testid="search"
            />
            {fileList.length > 0 && <ul>{createStucture()}</ul>}
        </div>
    );
}
