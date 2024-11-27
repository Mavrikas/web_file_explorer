'use client';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { isJson } from '@//utils';
import { PNG_URL_REGEX } from '@/constants';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

type AddFileModal = {
    handleModalVisibility: () => void;
    isOpen: boolean;
    title: string;
    pathsArray: string[];
    selectedPath: string[];
    confirmBtn: (name: string, selected: string, content?: string) => void;
};
export default function AddFileModal({
    handleModalVisibility,
    isOpen,
    title,
    confirmBtn,
    pathsArray,
    selectedPath,
}: AddFileModal) {
    const [selected, setSelected] = useState('txt');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [errorContent, setErrorContent] = useState('');

    const resetInput = () => {
        setName('');
        setContent('');
        setError('');
        setErrorContent('');
    };

    const handleContentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (errorContent) setErrorContent('');
        setContent(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError('');
        setName(e.target.value);
    };
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        resetInput();
        setSelected(e.target.value);
    };

    const validateInput = (name: string) => {
        let hasError = false;
        const nameTrimmed = name.trim();
        const contentTrimmed = content.trim();
        const path =
            selectedPath.join('\\') === ''
                ? `${nameTrimmed}.${selected}`
                : `${selectedPath.join('\\')}\\${nameTrimmed}.${selected}`;
        if (nameTrimmed === '') {
            hasError = true;
            setError('File name cannot be empty');
        } else if (pathsArray.includes(path)) {
            hasError = true;
            setError('File already exists');
        }
        if (
            contentTrimmed.length > 0 &&
            selected === 'json' &&
            !isJson(contentTrimmed)
        ) {
            setErrorContent('Invalid JSON');
            hasError = true;
        }
        if (selected === 'png' && !contentTrimmed.match(PNG_URL_REGEX)) {
            setErrorContent('Invalid image URL');
            hasError = true;
        }
        !hasError && confirmBtn(nameTrimmed, selected, contentTrimmed);
    };

    useEffect(() => {
        if (!isOpen) {
            resetInput();
            setSelected('txt');
        }
    }, [isOpen]);

    const getBody = () => {
        if (selected === 'png') {
            return (
                <>
                    <label htmlFor="url" className="mt-4">
                        Image URL
                    </label>
                    <input
                        type="input"
                        id={'url'}
                        className={`border-2 border-gray-300 rounded-md w-full p-2 ${errorContent && 'border-red-500'}`}
                        value={content}
                        onChange={handleContentChange}
                        data-testid="image-url"
                    />
                    <ErrorMessage errorContent={errorContent} />
                </>
            );
        } else {
            return (
                <>
                    <label htmlFor="content" className="mt-4">
                        Content{' '}
                        <span className="text-slate-400">(Optional)</span>
                    </label>
                    <textarea
                        id={'content'}
                        className={`border-2 border-gray-300 rounded-md w-full p-2 ${errorContent && 'border-red-500'}`}
                        value={content}
                        onChange={handleContentChange}
                        data-testid="content"
                    />
                    <ErrorMessage errorContent={errorContent} />
                </>
            );
        }
    };
    return (
        isOpen && (
            <Modal
                handleModalVisibility={handleModalVisibility}
                title={title}
                handleSubmit={() => validateInput(name)}
                testid="add-file-modal"
            >
                <fieldset>
                    <legend>Select file type</legend>
                    <div className="flex justify-between px-[60px]">
                        <label htmlFor="png">
                            PNG
                            <input
                                className="ml-2"
                                type="radio"
                                id="png"
                                name="type"
                                value="png"
                                onChange={handleRadio}
                                checked={selected === 'png'}
                                data-testid="png-radio"
                            />
                        </label>
                        <label htmlFor="txt">
                            TXT
                            <input
                                className="ml-2"
                                type="radio"
                                id="txt"
                                name="type"
                                value="txt"
                                onChange={handleRadio}
                                checked={selected === 'txt'}
                                data-testid="txt-radio"
                            />
                        </label>
                        <label htmlFor="json">
                            JSON
                            <input
                                className="ml-2"
                                type="radio"
                                id="json"
                                name="type"
                                value="json"
                                onChange={handleRadio}
                                checked={selected === 'json'}
                                data-testid="json-radio"
                            />
                        </label>
                    </div>
                </fieldset>

                <label htmlFor="name" className="mt-4">
                    File name
                </label>
                <input
                    type="text"
                    id={'name'}
                    className={`border-2 border-gray-300 rounded-md w-full p-2 ${error && 'border-red-500'}`}
                    value={name}
                    onChange={handleInputChange}
                    autoFocus
                    data-testid="file-name"
                />
                <ErrorMessage errorContent={error} />
                {getBody()}
                <div className="flex justify-between px-8 mt-8">
                    <Button
                        text="Confirm"
                        onClick={() => validateInput(name)}
                        type="primary"
                    />
                    <Button
                        text="Cancel"
                        onClick={handleModalVisibility}
                        type="secondary"
                    />
                </div>
            </Modal>
        )
    );
}
