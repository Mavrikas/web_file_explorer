import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { Data } from '@/store/types';

const mockFiles: Data[] = [
    {
        id: '1',
        name: 'Folder 1',
        path: 'Folder 1',
        content: [
            {
                id: '2',
                name: 'File 1',
                path: 'Folder 1\\File 1',
                content: 'File 1 content',
            },
        ],
    },
];

const mockDisplayFileContent = jest.fn();
const mockHandleDeleteButton = jest.fn();
const mockHandleAddFolder = jest.fn();
const mockHandleAddFile = jest.fn();
const mockSearchList = jest.fn();

describe('Sidebar Component', () => {
    beforeEach(() => {
        render(
            <Sidebar
                files={mockFiles}
                displayFileContent={mockDisplayFileContent}
                handleDeleteButton={mockHandleDeleteButton}
                handleAddFolder={mockHandleAddFolder}
                handleAddFile={mockHandleAddFile}
                searchList={mockSearchList}
            />
        );
    });

    test('renders Sidebar component', () => {
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('renders the title', () => {
        expect(screen.getByText('My files')).toBeInTheDocument();
    });

    test('renders the search input', () => {
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    test('calls searchList on search input change', () => {
        const searchInput = screen.getByTestId('search');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        expect(mockSearchList).toHaveBeenCalledWith('test');
    });

    test('renders the file structure', () => {
        expect(screen.getByText('Folder 1')).toBeInTheDocument();
        expect(screen.getByText('File 1')).toBeInTheDocument();
    });

    test('calls displayFileContent when a file is clicked', () => {
        const file = screen.getByText('File 1');
        fireEvent.click(file);
        expect(mockDisplayFileContent).toHaveBeenCalledWith(
            mockFiles[0].content[0]
        );
    });

    test('calls handleAddFolder when add folder button is clicked', () => {
        const addFolderButton = screen.getAllByTestId('addFolder')[0];
        fireEvent.click(addFolderButton);
        expect(mockHandleAddFolder).toHaveBeenCalled();
    });

    test('calls handleAddFile when add file button is clicked', () => {
        const addFileButton = screen.getAllByTestId('addFile')[0];
        fireEvent.click(addFileButton);
        expect(mockHandleAddFile).toHaveBeenCalled();
    });
});
