import { MouseEvent } from 'react';
import { Data } from '@/store/types';
import AddFile from '../Icons/AddFile';
import AddFolder from '../Icons/AddFolder';
import Trash from '../Icons/Trash';

type ActionButtonsProps = {
    handleAddFile?: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleAddFolder?: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    handleDeleteButton?: (e: MouseEvent<HTMLButtonElement>, a: Data) => void;
    file: Data;
    iconsVisible?: boolean;
    extraClasses?: string;
};

export default function ActionButtons({
    handleAddFile,
    handleAddFolder,
    handleDeleteButton,
    file,
    iconsVisible = true,
    extraClasses = '',
}: ActionButtonsProps) {
    return (
        <span
            className={`flex flex-row justify-end ${extraClasses} ${iconsVisible ? '' : 'hidden'}`}
        >
            {handleAddFile && (
                <button
                    onClick={(e) => handleAddFile(e, file)}
                    className="hover:drop-shadow mx-[2px]"
                    name="addFile"
                >
                    <AddFile />
                </button>
            )}
            {handleAddFolder && (
                <button
                    onClick={(e) => handleAddFolder(e, file)}
                    className="hover:drop-shadow mx-[2px]"
                    name="addFolder"
                >
                    <AddFolder />
                </button>
            )}
            {handleDeleteButton && (
                <button
                    onClick={(e) => handleDeleteButton(e, file)}
                    className="hover:drop-shadow mr-[2px] ml-[4px]"
                    name="delete"
                >
                    <Trash />
                </button>
            )}
        </span>
    );
}
