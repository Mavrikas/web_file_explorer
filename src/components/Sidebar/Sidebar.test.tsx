import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { Data } from '@/store/types';
import { renderWithProviders } from '@/test-utils';

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
const mockHandleCreate = jest.fn();

const initState = {
    files: {
        files: mockFiles,
        selectedFile: null,
        loading: false,
    },
};

describe('Sidebar Component', () => {
    beforeEach(() => {
        renderWithProviders(
            <Sidebar
                displayFileContent={mockDisplayFileContent}
                handleDeleteButton={mockHandleDeleteButton}
                handleCreate={mockHandleCreate}
            />,
            { preloadedState: initState }
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

    test('updates search state on input change', () => {
        const searchInput = screen.getByTestId('search');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        expect(searchInput).toHaveValue('test');
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

    test('calls handleCreate when add folder button is clicked', () => {
        const addFolderButton = screen.getAllByTestId('addFolder')[0];
        fireEvent.click(addFolderButton);
        expect(mockHandleCreate).toHaveBeenCalled();
    });

    test('calls handleCreate when add file button is clicked', () => {
        const addFileButton = screen.getAllByTestId('addFile')[0];
        fireEvent.click(addFileButton);
        expect(mockHandleCreate).toHaveBeenCalled();
    });
});
