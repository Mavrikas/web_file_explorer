import React, { MouseEvent } from 'react';
import { Data, FolderType } from '@/store/types';
import AddFile from '../Icons/AddFile';
import AddFolder from '../Icons/AddFolder';
import Trash from '../Icons/Trash';

type ActionButtonsProps = {
    handleCreate?: (
        e: MouseEvent<HTMLButtonElement>,
        a: Data,
        type?: FolderType
    ) => void;
    handleDeleteButton?: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    file: Data;
    iconsVisible?: boolean;
    extraClasses?: string;
};

export default function ActionButtons({
    handleCreate,
    handleDeleteButton,
    file,
    iconsVisible = true,
    extraClasses = '',
}: ActionButtonsProps) {
    return (
        <span
            className={`flex flex-row justify-end ${extraClasses} ${iconsVisible ? '' : 'hidden'}`}
        >
            {handleCreate && (
                <button
                    onClick={(e) => handleCreate(e, file)}
                    className="hover:drop-shadow mx-[2px]"
                    name="addFile"
                    data-testid="addFile"
                >
                    <AddFile />
                </button>
            )}
            {handleCreate && (
                <button
                    onClick={(e) => handleCreate(e, file, 'folder')}
                    className="hover:drop-shadow mx-[2px]"
                    name="addFolder"
                    data-testid="addFolder"
                >
                    <AddFolder />
                </button>
            )}
            {handleDeleteButton && (
                <button
                    onClick={(e) => handleDeleteButton(e, file)}
                    className="hover:drop-shadow mr-[2px] ml-[4px]"
                    name="delete"
                    data-testid="delete"
                >
                    <Trash />
                </button>
            )}
        </span>
    );
}
