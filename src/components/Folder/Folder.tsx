'use client';
import { Data, FolderType } from '@/store/types';
import React, { useState, MouseEvent } from 'react';
import ActionButtons from '../ActionButtons/ActionButtons';
import FolderOpened from '../Icons/FolderOpened';
import FolderClosed from '../Icons/FolderClosed';

type FolderProps = {
    file: Data;
    children: React.ReactNode;
    handleDeleteButton: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleCreate: (
        e: MouseEvent<HTMLButtonElement>,
        a: Data,
        type?: FolderType
    ) => void;
    displayFileContent: () => void;
};
export default function Folder({
    file,
    children,
    handleDeleteButton,
    handleCreate,
    displayFileContent,
}: FolderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [iconsVisible, setIconsVisible] = useState(false);

    const handleVisible = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsVisible(!isVisible);
        displayFileContent();
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
                data-testid="folder"
                className={`flex flex-row justify-start hover:bg-stone-300 pl-[5px] `}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                onClick={handleVisible}
            >
                <button className="mr-[5px]">
                    {isVisible ? <FolderOpened /> : <FolderClosed />}
                </button>
                <h4
                    className={`text-base font-bold text-sky-600 mr-[5px] cursor-pointer`}
                >
                    {file.name}
                </h4>
                <ActionButtons
                    handleCreate={handleCreate}
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
