'use client';
import React, { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { CreateItemTypes, Data, FolderType } from '@/store/types';

type AddFolderModal = {
    handleModalVisibility: () => void;
    isOpen: boolean;
    title: string;
    pathsArray: Data[];
    confirmBtn: (name: string, type: FolderType, content: []) => void;
};
export default function AddFolderModal({
    handleModalVisibility,
    isOpen,
    title,
    confirmBtn,
    pathsArray,
}: AddFolderModal) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) setError('');
        setName(e.target.value);
    };

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

    const validateInput = (name: string) => {
        const nameTrimmed = name.trim();

        if (nameTrimmed === '') {
            setError('Folder name cannot be empty');
        } else if (pathsArray.some((el) => el.name === nameTrimmed)) {
            setError('Folder already exists');
        } else {
            confirmBtn(nameTrimmed, 'folder', []);
        }
    };

    return (
        isOpen && (
            <Modal
                handleModalVisibility={handleModalVisibility}
                title={title}
                handleSubmit={() => validateInput(name)}
                testid="add-folder-modal"
            >
                <label htmlFor="name" className="mt-[20px]">
                    Folder name
                </label>
                <input
                    type="text"
                    id={'name'}
                    className={`border-2 border-gray-300 rounded-md w-full p-2 ${error && 'border-red-500'}`}
                    value={name}
                    onChange={handleInputChange}
                    autoFocus
                    data-testid="folder-name"
                />
                <ErrorMessage errorContent={error} />

                <div className="flex justify-between px-8 mt-[70px]">
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
