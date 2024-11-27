'use client';
import { Data } from '@/store/types';
import React, { useState, MouseEvent } from 'react';
import FileIcon from '../Icons/FileIcon';
import ActionButtons from '../ActionButtons/ActionButtons';

type FileProps = {
    file: Data;
    displayFileContent: () => void;
    handleDeleteButton: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
};
export default function File({
    file,
    displayFileContent,
    handleDeleteButton,
}: FileProps) {
    const [iconsVisible, setIconsVisible] = useState(false);
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
                <FileIcon />
                <h6
                    className={`text-base font-normal text-black pl-[10px] cursor-pointer`}
                >
                    {file.name}
                </h6>
                <span
                    data-testid="action-buttons"
                    className={`flex flex-row justify-between ml-[15px] w-[50px] ${iconsVisible ? '' : 'hidden'}`}
                >
                    <ActionButtons
                        handleDeleteButton={handleDeleteButton}
                        iconsVisible={iconsVisible}
                        file={file}
                        extraClasses="ml-[5px]"
                    />
                </span>
            </span>
        </>
    );
}
