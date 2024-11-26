'use client';
import { Data } from '@/store/types';
import { useState, MouseEvent, useEffect, useMemo } from 'react';
import Trash from '../Icons/Trash';
import AddFolder from '../Icons/AddFolder';
import AddFile from '../Icons/AddFile';
import ActionButtons from '../ActionButtons/ActionButtons';
import FolderOpened from '../Icons/FolderOpened';
import FolderClosed from '../Icons/FolderClosed';

type FolderProps = {
    file: Data;
    children: React.ReactNode;
    handleDeleteButton: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFolder: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFile: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    displayFileContent: () => void;
};
export default function Folder({
    file,
    children,
    handleDeleteButton,
    handleAddFolder,
    handleAddFile,
    displayFileContent,
}: FolderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [iconsVisible, setIconsVisible] = useState(false);
    const handleVisible = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
    };
    const handleOnMouseEnter = () => {
        setIconsVisible(true);
    };
    const handleOnMouseLeave = () => {
        setIconsVisible(false);
    };

    return (
        <>
            <span
                className={`flex flex-row justify-start hover:bg-stone-300 pl-[5px]`}
                onClick={displayFileContent}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
            >
                <button className="mr-[5px]" onClick={handleVisible}>
                    {isVisible ? <FolderOpened /> : <FolderClosed />}
                </button>
                <h4
                    className={`text-base font-bold text-sky-600 mr-[5px] cursor-pointer`}
                >
                    {file.name}
                </h4>
                <ActionButtons
                    handleAddFile={handleAddFile}
                    handleAddFolder={handleAddFolder}
                    handleDeleteButton={handleDeleteButton}
                    iconsVisible={iconsVisible}
                    file={file}
                    extraClasses="ml-[15px]"
                />
            </span>

            <ul
                className={`text-base font-bold text-sky-600 cursor-pointer pl-[10px] ${isVisible ? '' : 'h-0 overflow-hidden'}`}
            >
                {children}
            </ul>
        </>
    );
}
