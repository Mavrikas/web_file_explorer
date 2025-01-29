'use client';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { isJson } from '@//utils';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { Data, FileTypes } from '@/store/types';

type AddFileModal = {
    handleModalVisibility: () => void;
    isOpen: boolean;
    title: string;
    pathsArray: Data[];
    confirmBtn: (name: string, selected: FileTypes, content?: string) => void;
};
export default function AddFileModal({
    handleModalVisibility,
    isOpen,
    title,
    confirmBtn,
    pathsArray,
}: AddFileModal) {
    const [selected, setSelected] = useState<FileTypes>('txt');
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
        setSelected(e.target.value as FileTypes);
    };

    const validateInput = (name: string) => {
        let hasError = false;
        const nameTrimmed = name.trim();
        const contentTrimmed = content.trim();

        if (nameTrimmed === '') {
            hasError = true;
            setError('File name cannot be empty');
        } else if (
            pathsArray.some((el) => el.name === `${nameTrimmed}.${selected}`)
        ) {
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

        !hasError && confirmBtn(nameTrimmed, selected, contentTrimmed);
    };

    useEffect(() => {
        if (!isOpen) {
            resetInput();
            setSelected('txt');
        }
    }, [isOpen]);

    const getBody = () => {
        return (
            <>
                <label htmlFor="content" className="mt-4">
                    Content <span className="text-slate-400">(Optional)</span>
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
