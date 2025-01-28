import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddFileModal from './AddFileModal';

describe('AddFileModal', () => {
    const handleModalVisibility = jest.fn();
    const confirmBtn = jest.fn();
    const pathsArray = [
        {
            id: '1',
            name: 'existingFile.txt',
            path: '/path/to/existingFile.txt',
            content: 'file content',
        },
    ];

    const renderComponent = (isOpen: boolean) => {
        render(
            <AddFileModal
                handleModalVisibility={handleModalVisibility}
                isOpen={isOpen}
                title="Add File"
                confirmBtn={confirmBtn}
                pathsArray={pathsArray}
            />
        );
    };

    it('should render the modal when isOpen is true', () => {
        renderComponent(true);
        expect(screen.getByTestId('add-file-modal')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
        renderComponent(false);
        expect(screen.queryByTestId('add-file-modal')).not.toBeInTheDocument();
    });

    it('should display error when file name is empty', () => {
        renderComponent(true);
        fireEvent.click(screen.getByText('Confirm'));
        expect(
            screen.getByText('File name cannot be empty')
        ).toBeInTheDocument();
    });

    it('should display error when file already exists', () => {
        renderComponent(true);
        fireEvent.change(screen.getByTestId('file-name'), {
            target: { value: 'existingFile' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(screen.getByText('File already exists')).toBeInTheDocument();
    });

    it('should display error for invalid JSON content', () => {
        renderComponent(true);
        fireEvent.change(screen.getByTestId('file-name'), {
            target: { value: 'test' },
        });
        fireEvent.click(screen.getByTestId('json-radio'));
        fireEvent.change(screen.getByTestId('content'), {
            target: { value: 'invalid json' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    });

    it('should display error for invalid PNG URL', () => {
        renderComponent(true);
        fireEvent.change(screen.getByTestId('file-name'), {
            target: { value: 'test' },
        });
        fireEvent.click(screen.getByTestId('png-radio'));
        fireEvent.change(screen.getByTestId('image-url'), {
            target: { value: 'invalid url' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(screen.getByText('Invalid image URL')).toBeInTheDocument();
    });

    it('should call confirmBtn with correct values', () => {
        renderComponent(true);
        fireEvent.change(screen.getByTestId('file-name'), {
            target: { value: 'test' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(confirmBtn).toHaveBeenCalledWith('test', 'txt', '');
    });

    it('should call handleModalVisibility when cancel button is clicked', () => {
        renderComponent(true);
        fireEvent.click(screen.getByText('Cancel'));
        expect(handleModalVisibility).toHaveBeenCalled();
    });
});
