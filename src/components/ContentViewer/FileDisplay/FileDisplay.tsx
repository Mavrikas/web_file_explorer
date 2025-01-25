import Button from '@/components/Button/Button';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { selectedFileSelector } from '@/store/filesSlice';
import { API_URL } from '@/store/services/api';
import { getFileType, isJson } from '@/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type FileDisplayProps = {
    updateFile: (content: string) => void;
};

export default function FileDisplay({ updateFile }: FileDisplayProps) {
    const VALID_FILE_TYPES = ['json', 'txt', 'png'];
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');
    const [errorContent, setErrorContent] = useState('');
    const selectedFile = useSelector(selectedFileSelector);

    let invalidError = '';

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

    const getImageDisplay = () => {
        return (
            <img
                src={
                    API_URL + '/' + selectedFile.path.replace('userFiles\\', '')
                }
                alt={selectedFile.name}
            />
        );
    };

    const getJsonDisplay = () => {
        if (isEditing) {
            return (
                <textarea
                    className="w-full h-[400px] resize-none bg-[#f1efef] p-[5px]"
                    onChange={handleContentChange}
                    value={`${content}`}
                ></textarea>
            );
        } else {
            return (
                <textarea
                    disabled
                    className="w-full h-[400px] resize-none p-[5px]"
                    onChange={handleContentChange}
                    value={`${JSON.stringify(
                        JSON.parse(selectedFile.content as string),
                        null,
                        2
                    )}`}
                ></textarea>
            );
        }
    };

    const getTxtDisplay = () => {
        return isEditing ? (
            <textarea
                value={content as string}
                onChange={handleContentChange}
                className="w-full h-[400px] resize-none bg-[#f1efef] p-[5px]"
            />
        ) : (
            <textarea
                disabled
                value={selectedFile.content as string}
                onChange={handleContentChange}
                className="w-full h-[400px] resize-none p-[5px]"
            />
        );
    };
    const getFileContent = () => {
        switch (getFileType(selectedFile.name)) {
            case 'png':
                return getImageDisplay();
            case 'json':
                return getJsonDisplay();
            case 'txt':
                return getTxtDisplay();
        }
    };
    const isInvalidFile = () => {
        if (
            selectedFile.name.includes('json') &&
            !isJson(selectedFile.content as string)
        ) {
            invalidError = 'Invalid JSON';
            return true;
        } else if (!VALID_FILE_TYPES.includes(getFileType(selectedFile.name))) {
            invalidError = 'Unsupported file type';
            return true;
        }
        invalidError = '';
        return false;
    };

    useEffect(() => {
        if (!isEditing) {
            setErrorContent('');
        }
    }, [isEditing]);

    if (isInvalidFile()) {
        return (
            <p className="text-red-500 text-2xl mt-[10px]">{invalidError}</p>
        );
    } else {
        return (
            <>
                {!selectedFile.name.includes('png') && (
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

                {getFileContent()}
                <ErrorMessage errorContent={errorContent} />
            </>
        );
    }
}
