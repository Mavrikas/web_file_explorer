import { Data } from '@/store/types';
import FolderOpened from '../Icons/FolderOpened';
import AddFile from '../Icons/AddFile';
import FileIcon from '../Icons/FileIcon';
import { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../Button/Button';
import { isJson } from '@/utils';

type ContentViewerProps = {
    file: Data;
    updateFile: (content: string) => void;
};

export default function ContentViewer({
    file,
    updateFile,
}: ContentViewerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(file?.content);
    const [errorContent, setErrorContent] = useState('');
    const [type, setType] = useState('');

    const handleEdit = () => {
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
                            id={`folder-${item.id}`}
                            key={`folder-${item.id}`}
                            className="list-none pl-[20px]"
                        >
                            {item.name}
                            {createStuctureRecursive(item.content)}
                        </ul>
                    );
                } else {
                    return (
                        <li
                            id={`file-${item.id}`}
                            key={`file-${item.id}`}
                            className="list-none pl-[20px]"
                        >
                            {item.name}
                        </li>
                    );
                }
            });
        };
        return createStuctureRecursive(file);
    };

    const validateInput = () => {
        let hasError = false;
        const contentTrimmed = (content as string).trim();

        if (
            contentTrimmed.length > 0 &&
            type === 'json' &&
            !isJson(contentTrimmed)
        ) {
            setErrorContent('Invalid JSON');
            hasError = true;
        }

        if (
            type === 'png' &&
            !contentTrimmed.match(/(https?:\/\/.*\.(?:png))/i)
        ) {
            setErrorContent('Invalid image URL');
            hasError = true;
        }

        if (!hasError) {
            updateFile(contentTrimmed);
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (file) {
            setContent(file.content);
            setType(file.name.split('.').pop()!);
            setErrorContent('');
            setIsEditing(false);
        }
    }, [file]);

    useEffect(() => {
        if (!isEditing) {
            setContent(file?.content);
            setErrorContent('');
        }
    }, [isEditing]);

    const displayContent = () => {
        if (typeof file.content === 'string') {
            if (file.name.includes('png')) {
                return isEditing ? (
                    <>
                        <label htmlFor="url" className="mt-4">
                            Image URL
                        </label>
                        <input
                            type="input"
                            id={'url'}
                            className={`border-2 border-gray-300 rounded-md w-full p-2 `}
                            value={content as string}
                            onChange={handleContentChange}
                        />
                    </>
                ) : (
                    <img src={file.content as string} alt={file.name} />
                );
            } else if (file.name.includes('json')) {
                return file.content.length ? (
                    isEditing ? (
                        <textarea
                            className="w-full h-[400px] resize-none"
                            onChange={handleContentChange}
                            value={`${content}`}
                        ></textarea>
                    ) : (
                        <pre>
                            {JSON.stringify(
                                JSON.parse(file.content as string),
                                null,
                                2
                            )}
                        </pre>
                    )
                ) : null;
            } else {
                return isEditing ? (
                    <textarea
                        value={content as string}
                        onChange={handleContentChange}
                        className="w-full h-[400px] resize-none"
                    />
                ) : (
                    <p>{file.content as string}</p>
                );
            }
        } else {
            return createStucture();
        }
    };

    return (
        file && (
            <div className="p-[20px] w-full">
                <h1 className="text-sky-600 text-lg flex flex-row items-center">
                    <span className="pr-[10px]">
                        {Array.isArray(file.content) ? (
                            <FolderOpened />
                        ) : (
                            <FileIcon />
                        )}
                    </span>
                    {file.path}
                </h1>

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

                <div
                    className={`border-2 border-gray-500 min-w-[500px] min-h-[400px] w-9/12 p-[3px] bg-white overflow-auto ${errorContent && 'border-red-500'}`}
                >
                    {displayContent()}
                </div>
                {errorContent && <p className="text-red-500">{errorContent}</p>}
            </div>
        )
    );
}
