import { Data } from '@/store/types';
import FolderOpened from '../Icons/FolderOpened';
import FileIcon from '../Icons/FileIcon';
import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import { getFileType, isJson } from '@/utils';
import { PNG_URL_REGEX } from '@/constants';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useSelector } from 'react-redux';
import { selectedFileSelector } from '@/store/filesSlice';
import { useAppDispatch } from '@/hooks/rtkHooks';
import { API_URL } from '@/store/services/api';

type ContentViewerProps = {
    updateFile: (content: string) => void;
};

export default function ContentViewer({ updateFile }: ContentViewerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');
    const [errorContent, setErrorContent] = useState('');
    const [type, setType] = useState('');
    const selectedFile = useSelector(selectedFileSelector);
    const dispatch = useAppDispatch();

    const isFolder = selectedFile && Array.isArray(selectedFile.content);

    const handleEdit = () => {
        if (!isEditing) {
            setContent(selectedFile.content);
        }
        setIsEditing(!isEditing);
    };

    const handleContentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setContent(e.target.value);
    };

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

    const validateInput = () => {
        let hasError = false;
        const contentTrimmed = (content as string).trim();

        if (
            contentTrimmed.length > 0 &&
            getFileType(selectedFile.name) === 'json' &&
            !isJson(contentTrimmed)
        ) {
            setErrorContent('Invalid JSON');
            hasError = true;
        }

        if (!hasError) {
            updateFile(contentTrimmed);
            setIsEditing(false);
        }
    };

    // useEffect(() => {
    //     if (file) {
    //         setContent(file.content);
    //         setType(file.name.split('.').pop()!);
    //         setErrorContent('');
    //         setIsEditing(false);
    //     }
    // }, [file]);

    useEffect(() => {
        if (!isEditing) {
            // setContent(file?.content);
            setErrorContent('');
        }
    }, [isEditing]);

    const displayContent = () => {
        if (!isFolder) {
            let fileDisplay;
            if (getFileType(selectedFile.name) === 'png') {
                fileDisplay = (
                    <img
                        src={
                            API_URL +
                            '/' +
                            selectedFile.path.replace('userFiles\\', '')
                        }
                        alt={selectedFile.name}
                    />
                );
            } else if (getFileType(selectedFile.name) === 'json') {
                fileDisplay = selectedFile ? (
                    isEditing ? (
                        <textarea
                            className="w-full h-[400px] resize-none"
                            onChange={handleContentChange}
                            value={`${content}`}
                        ></textarea>
                    ) : (
                        //handle bad json
                        <pre>
                            {JSON.stringify(
                                JSON.parse(selectedFile.content as string),
                                null,
                                2
                            )}
                        </pre>
                    )
                ) : null;
            } else {
                fileDisplay = isEditing ? (
                    <textarea
                        value={content as string}
                        onChange={handleContentChange}
                        className="w-full h-[400px] resize-none"
                    />
                ) : (
                    <p>{selectedFile.content as string}</p>
                );
            }
            return (
                <>
                    <div
                        className={`border-2 border-gray-500 min-w-[500px] min-h-[400px] w-9/12 p-[3px] bg-white overflow-auto ${errorContent && 'border-red-500'}`}
                    >
                        {fileDisplay}
                    </div>
                    <ErrorMessage errorContent={errorContent} />
                </>
            );
        } else {
            return createStucture();
        }
    };

    return (
        selectedFile?.content && (
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

                {!isFolder && !selectedFile.name.includes('png') && (
                    <div className="flex justify-between  mt-[20px] mb-[5px] w-[200px]">
                        {isEditing ? (
                            <>
                                <Button
                                    text="Save"
                                    onClick={() => validateInput()}
                                    type="primary"
                                />
                                <Button
                                    text="Cancel"
                                    onClick={handleEdit}
                                    type="secondary"
                                />
                            </>
                        ) : (
                            <Button
                                text="Edit"
                                onClick={() => handleEdit()}
                                type="primary"
                            />
                        )}
                    </div>
                )}

                {displayContent()}
            </div>
        )
    );
}
