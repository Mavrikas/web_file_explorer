'use client';
import { use, useEffect, useState, MouseEvent } from 'react';
import { getFiles } from '@/controllers/files';
import { Data } from '@/store/types';
import Folder from '../Folder/Folder';
import File from '../File/File';
import AddFile from '../Icons/AddFile';
import AddFolder from '../Icons/AddFolder';
import { ROOT_OBJECT } from '@/constants';
import ActionButtons from '../ActionButtons/ActionButtons';

type SidebarProps = {
    files: Data[];
    displayFileContent: (a: Data) => void;
    handleDeleteButton: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFolder: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFile: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    searchList: (a: string) => void;
};
export default function Sidebar({
    files,
    displayFileContent,
    handleDeleteButton,
    handleAddFolder,
    handleAddFile,
    searchList,
}: SidebarProps) {
    const [search, setSearch] = useState('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        searchList(e.target.value);
    };
    const createStucture = () => {
        const createStuctureRecursive = (contents: Data[]) => {
            return contents.map((item: Data) => {
                if (typeof item.content !== 'string') {
                    return (
                        <Folder
                            file={item}
                            key={`folder-${item.id}`}
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
                            key={`file-${item.id}`}
                            displayFileContent={() => displayFileContent(item)}
                            file={item}
                            handleDeleteButton={handleDeleteButton}
                        />
                    );
                }
            });
        };
        return createStuctureRecursive(files);
    };

    return (
        <div className="p-[20px] border-r-2 border-gray-500 min-w-[300px] max-w-[300px] overflow-auto">
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
            />
            {files.length > 0 && <ul>{createStucture()}</ul>}
        </div>
    );
}
