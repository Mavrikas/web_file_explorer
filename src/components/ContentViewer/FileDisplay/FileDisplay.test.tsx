import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import FileDisplay from './FileDisplay';
import { renderWithProviders } from '@/test-utils';

const mockUpdateFile = jest.fn();

const mockFile = {
    id: '1',
    name: 'test.json',
    content: '{"key": "value"}',
    path: 'userFiles\\test.json',
};

describe('FileDisplay', () => {
    test('renders FileDisplay component', () => {
        const initState = {
            files: {
                selectedFile: mockFile,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<FileDisplay updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    test('renders editable textarea when editing', () => {
        const initState = {
            files: {
                selectedFile: mockFile,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<FileDisplay updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });
        fireEvent.click(screen.getByText('Edit'));
        expect(screen.getByDisplayValue(mockFile.content)).toBeInTheDocument();
    });

    test('validates JSON content on save', () => {
        const initState = {
            files: {
                selectedFile: mockFile,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<FileDisplay updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });
        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByDisplayValue(mockFile.content), {
            target: { value: 'invalid json' },
        });
        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    });

    test('calls updateFile with valid JSON content on save', () => {
        const initState = {
            files: {
                selectedFile: mockFile,
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<FileDisplay updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });
        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByDisplayValue(mockFile.content), {
            target: { value: '{"key": "new value"}' },
        });
        fireEvent.click(screen.getByText('Save'));
        expect(mockUpdateFile).toHaveBeenCalledWith('{"key": "new value"}');
    });

    test('displays error for unsupported file type', () => {
        const initState = {
            files: {
                selectedFile: { ...mockFile, name: 'test.unsupported' },
                files: [],
                loading: false,
            },
        };
        renderWithProviders(<FileDisplay updateFile={mockUpdateFile} />, {
            preloadedState: initState,
        });

        expect(screen.getByText('Unsupported file type')).toBeInTheDocument();
    });
});
