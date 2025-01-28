import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Folder from './Folder';
import { Data } from '@/store/types';

describe('Folder Component', () => {
    const mockFile: Data = {
        id: '1',
        name: 'Test Folder',
        path: 'Test Folder',
        content: [],
    };
    const mockHandleDeleteButton = jest.fn();
    const mockHandleAddItem = jest.fn();
    const mockDisplayFileContent = jest.fn();

    const renderComponent = () =>
        render(
            <Folder
                file={mockFile}
                handleDeleteButton={mockHandleDeleteButton}
                handleCreate={mockHandleAddItem}
                displayFileContent={mockDisplayFileContent}
            >
                <li>Child File</li>
            </Folder>
        );

    test('renders folder name', () => {
        renderComponent();
        expect(screen.getByText('Test Folder')).toBeInTheDocument();
    });

    test('toggles visibility on click', () => {
        renderComponent();
        const folderElement = screen.getByText('Test Folder');
        fireEvent.click(folderElement);
        expect(mockDisplayFileContent).toHaveBeenCalled();
    });

    test('calls handleAddFile when add file button is clicked', () => {
        renderComponent();
        const folderElement = screen.getByText('Test Folder').parentElement;
        fireEvent.mouseEnter(folderElement!);
        const addFileButton = screen.getByRole('button', { name: /add file/i });
        fireEvent.click(addFileButton);
        expect(mockHandleAddItem).toHaveBeenCalledWith(
            expect.any(Object),
            mockFile
        );
    });

    test('calls handleAddFolder when add folder button is clicked', () => {
        renderComponent();
        const folderElement = screen.getByText('Test Folder').parentElement;
        fireEvent.mouseEnter(folderElement!);
        const addFolderButton = screen.getByRole('button', {
            name: /add folder/i,
        });
        fireEvent.click(addFolderButton);
        expect(mockHandleAddItem).toHaveBeenCalledWith(
            expect.any(Object),
            mockFile,
            'folder'
        );
    });

    test('calls handleDeleteButton when delete button is clicked', () => {
        renderComponent();
        const folderElement = screen.getByText('Test Folder').parentElement;
        fireEvent.mouseEnter(folderElement!);
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(mockHandleDeleteButton).toHaveBeenCalledWith(
            expect.any(Object),
            mockFile
        );
    });
});
