import React from 'react';
import { Data } from '@/store/types';
import FolderOpened from '../Icons/FolderOpened';
import FileIcon from '../Icons/FileIcon';
import { useSelector } from 'react-redux';
import { selectedFileSelector } from '@/store/filesSlice';
import FileDisplay from './FileDisplay/FileDisplay';

type ContentViewerProps = {
    updateFile: (content: string) => void;
};

export default function ContentViewer({ updateFile }: ContentViewerProps) {
    const selectedFile = useSelector(selectedFileSelector);

    const isFolder = selectedFile && Array.isArray(selectedFile.content);

    const createStucture = () => {
        const createStuctureRecursive = (contents: Data[] | Data) => {
            const array = Array.isArray(contents)
                ? contents
                : (contents as Data).content;
            return (array as Data[]).map((item: Data) => {
                if (typeof item.content !== 'string') {
                    return (
                        <ul
                            key={`folder-${item.path}`}
                            className="list-none pl-[20px]"
                        >
                            <div className="flex flex-row items-center">
                                <FolderOpened />
                                <span className="ml-[10px]">{item.name}</span>
                            </div>
                            {createStuctureRecursive(item.content)}
                        </ul>
                    );
                } else {
                    return (
                        <li
                            key={`file-${item.path}`}
                            className="list-none pl-[20px] flex flex-row items-center"
                        >
                            <FileIcon />
                            <span className="ml-[10px]">{item.name}</span>
                        </li>
                    );
                }
            });
        };
        return createStuctureRecursive(selectedFile.content);
    };

    const displayContent = () => {
        if (!isFolder) {
            return <FileDisplay updateFile={updateFile} />;
        } else {
            return createStucture();
        }
    };

    return (
        selectedFile?.content != null && (
            <div className="p-[20px] w-full">
                <h1 className="text-sky-600 text-lg flex flex-row items-center">
                    <span className="pr-[10px]">
                        {Array.isArray(selectedFile.content) ? (
                            <FolderOpened />
                        ) : (
                            <FileIcon />
                        )}
                    </span>
                    {selectedFile.path}
                </h1>

                {displayContent()}
            </div>
        )
    );
}
