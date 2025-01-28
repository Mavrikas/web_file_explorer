import React from 'react';
import { screen } from '@testing-library/react';
import ContentViewer from './ContentViewer';
import { Data } from '@/store/types';
import { renderWithProviders } from '@/test-utils';

const mockUpdateFile = jest.fn();

const mockFile: Data = {
    id: '1',
    name: 'test.json',
    content: '{"key": "value"}',
    path: '/test.json',
};

const mockFolder: Data = {
    id: '2',
    name: 'folder',
    content: [
        {
            id: '3',
            name: 'file1.txt',
            content: 'file content',
            path: '/folder/file1.txt',
        },
    ],
    path: '/folder',
};

describe('ContentViewer', () => {
    it('renders file content correctly', () => {
        const initState = {
            files: {
                selectedFile: mockFile,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<ContentViewer updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });

        expect(screen.getByText('/test.json')).toBeInTheDocument();
    });

    it('renders folder structure correctly', () => {
        const initState = {
            files: {
                selectedFile: mockFolder,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<ContentViewer updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });
        expect(screen.getByText('/folder')).toBeInTheDocument();
        expect(screen.getByText('file1.txt')).toBeInTheDocument();
    });

    it('does not render anything if no file is selected', () => {
        const initState = {
            files: {
                selectedFile: null,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<ContentViewer updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });

        expect(screen.queryByText('/test.json')).not.toBeInTheDocument();
    });
});
