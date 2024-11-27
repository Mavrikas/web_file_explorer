import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import File from './File';
import { Data } from '@/store/types';

describe('File Component', () => {
    const mockFile: Data = {
        id: '1',
        name: 'testFile.txt',
        path: '/test/path',
        content: 'Sample content',
    };
    const mockDisplayFileContent = jest.fn();
    const mockHandleDeleteButton = jest.fn();

    it('should render file name', () => {
        render(
            <File
                file={mockFile}
                displayFileContent={mockDisplayFileContent}
                handleDeleteButton={mockHandleDeleteButton}
            />
        );

        expect(screen.getByText('testFile.txt')).toBeInTheDocument();
    });

    it('should call displayFileContent when clicked', () => {
        render(
            <File
                file={mockFile}
                displayFileContent={mockDisplayFileContent}
                handleDeleteButton={mockHandleDeleteButton}
            />
        );

        fireEvent.click(screen.getByText('testFile.txt'));
        expect(mockDisplayFileContent).toHaveBeenCalled();
    });

    it('should show action buttons on mouse enter and hide on mouse leave', () => {
        render(
            <File
                file={mockFile}
                displayFileContent={mockDisplayFileContent}
                handleDeleteButton={mockHandleDeleteButton}
            />
        );

        const fileElement = screen.getByText('testFile.txt').closest('span');
        expect(fileElement).toBeInTheDocument();

        fireEvent.mouseEnter(fileElement!);
        expect(screen.getByTestId('action-buttons')).not.toHaveClass('hidden');

        fireEvent.mouseLeave(fileElement!);
        expect(screen.getByTestId('action-buttons')).toHaveClass('hidden');
    });
});
