import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';
import { getFiles } from '../controllers/files';
import { Data } from '../store/types';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
jest.mock('../controllers/files', () => ({
    getFiles: jest.fn(),
}));

const mockFiles: Data[] = [
    {
        id: '1',
        name: 'file1',
        path: 'file1',
        content: 'content1',
    },
    {
        id: '2',
        name: 'folder1',
        path: 'folder1',
        content: [
            {
                id: '3',
                name: 'file2',
                path: 'folder1\\file2',
                content: 'content2',
            },
        ],
    },
];

describe('Home', () => {
    beforeEach(() => {
        (getFiles as jest.Mock).mockReturnValue(mockFiles);
    });

    test('renders Home component', () => {
        render(<Home />);
        expect(screen.getByText('My files')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('handles delete modal visibility', () => {
        render(<Home />);
        fireEvent.click(screen.getAllByTestId('delete')[0]);
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });

    test('handles add folder modal visibility', () => {
        render(<Home />);
        fireEvent.click(screen.getAllByTestId('addFolder')[0]);
        expect(screen.getByTestId('add-folder-modal')).toBeInTheDocument();
    });

    test('handles add file modal visibility', () => {
        render(<Home />);
        fireEvent.click(screen.getAllByTestId('addFile')[0]);
        expect(screen.getByTestId('add-file-modal')).toBeInTheDocument();
    });

    test('deletes a file', () => {
        render(<Home />);
        fireEvent.click(screen.getAllByTestId('delete')[0]);
        fireEvent.click(screen.getByTestId('Confirm'));
        expect(screen.queryByText('file1')).not.toBeInTheDocument();
    });

    test('adds a folder', () => {
        render(<Home />);
        fireEvent.click(screen.getAllByTestId('addFolder')[0]);
        fireEvent.change(screen.getByTestId('folder-name'), {
            target: { value: 'newFolder' },
        });
        fireEvent.click(screen.getByTestId('Confirm'));
        expect(screen.getByText('newFolder')).toBeInTheDocument();
    });

    test('adds a file', () => {
        render(<Home />);
        fireEvent.click(screen.getAllByTestId('addFile')[0]);
        fireEvent.change(screen.getByTestId('file-name'), {
            target: { value: 'newFile' },
        });
        fireEvent.click(screen.getByTestId('txt-radio'));
        fireEvent.click(screen.getByTestId('Confirm'));
        expect(screen.getByText('newFile.txt')).toBeInTheDocument();
    });

    test('searches files', () => {
        render(<Home />);
        const file2 = screen.getByText('file2');
        expect(file2).toBeInTheDocument();
        fireEvent.change(screen.getByTestId('search'), {
            target: { value: 'file1' },
        });
        expect(screen.getByText('file1')).toBeInTheDocument();
        expect(file2).not.toBeInTheDocument();
    });
});
