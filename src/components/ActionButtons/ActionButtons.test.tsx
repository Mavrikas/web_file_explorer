import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ActionButtons from './ActionButtons';
import { Data } from '@/store/types';

describe('ActionButtons', () => {
    const mockFile: Data = {
        id: '1',
        name: 'testFile',
        path: 'testFile',
        content: 'testContent',
    };

    test('renders add file button and triggers handleAddFile', () => {
        const handleAddFile = jest.fn();
        const { getByTestId } = render(
            <ActionButtons handleAddFile={handleAddFile} file={mockFile} />
        );

        const addFileButton = getByTestId('addFile');
        expect(addFileButton).toBeInTheDocument();

        fireEvent.click(addFileButton);
        expect(handleAddFile).toHaveBeenCalledWith(
            expect.any(Object),
            mockFile
        );
    });

    test('renders add folder button and triggers handleAddFolder', () => {
        const handleAddFolder = jest.fn();
        const { getByTestId } = render(
            <ActionButtons handleAddFolder={handleAddFolder} file={mockFile} />
        );

        const addFolderButton = getByTestId('addFolder');
        expect(addFolderButton).toBeInTheDocument();

        fireEvent.click(addFolderButton);
        expect(handleAddFolder).toHaveBeenCalledWith(
            expect.any(Object),
            mockFile
        );
    });

    test('renders delete button and triggers handleDeleteButton', () => {
        const handleDeleteButton = jest.fn();
        const { getByTestId } = render(
            <ActionButtons
                handleDeleteButton={handleDeleteButton}
                file={mockFile}
            />
        );

        const deleteButton = getByTestId('delete');
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
        expect(handleDeleteButton).toHaveBeenCalledWith(
            expect.any(Object),
            mockFile
        );
    });

    test('does not render buttons when iconsVisible is false', () => {
        const { queryByTestId } = render(
            <ActionButtons file={mockFile} iconsVisible={false} />
        );

        expect(queryByTestId('addFile')).toBeNull();
        expect(queryByTestId('addFolder')).toBeNull();
        expect(queryByTestId('delete')).toBeNull();
    });

    test('applies extraClasses to the span element', () => {
        const { container } = render(
            <ActionButtons file={mockFile} extraClasses="extra-class" />
        );

        const spanElement = container.querySelector('span');
        expect(spanElement).toHaveClass('extra-class');
    });
});
