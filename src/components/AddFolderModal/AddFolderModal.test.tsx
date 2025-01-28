import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddFolderModal from './AddFolderModal';

describe('AddFolderModal', () => {
    const handleModalVisibility = jest.fn();
    const confirmBtn = jest.fn();
    const pathsArray = [
        {
            id: '1',
            name: 'existingFolder',
            path: '/existingFolder',
            content: [],
        },
    ];

    const renderComponent = (isOpen: boolean, title: string) => {
        render(
            <AddFolderModal
                handleModalVisibility={handleModalVisibility}
                isOpen={isOpen}
                title={title}
                confirmBtn={confirmBtn}
                pathsArray={pathsArray}
            />
        );
    };

    it('should render the modal when isOpen is true', () => {
        renderComponent(true, 'Add Folder');
        expect(screen.getByTestId('add-folder-modal')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
        renderComponent(false, 'Add Folder');
        expect(
            screen.queryByTestId('add-folder-modal')
        ).not.toBeInTheDocument();
    });

    it('should display an error message when folder name is empty', () => {
        renderComponent(true, 'Add Folder');
        fireEvent.click(screen.getByText('Confirm'));
        expect(
            screen.getByText('Folder name cannot be empty')
        ).toBeInTheDocument();
    });

    it('should display an error message when folder already exists', () => {
        renderComponent(true, 'Add Folder');
        fireEvent.change(screen.getByTestId('folder-name'), {
            target: { value: 'existingFolder' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(screen.getByText('Folder already exists')).toBeInTheDocument();
    });

    it('should call confirmBtn with the folder name when input is valid', () => {
        renderComponent(true, 'Add Folder');
        fireEvent.change(screen.getByTestId('folder-name'), {
            target: { value: 'newFolder' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(confirmBtn).toHaveBeenCalledWith('newFolder', 'folder', []);
    });

    it('should call handleModalVisibility when Cancel button is clicked', () => {
        renderComponent(true, 'Add Folder');
        fireEvent.click(screen.getByText('Cancel'));
        expect(handleModalVisibility).toHaveBeenCalled();
    });

    it('should display the correct title', () => {
        const title = 'Custom Title';
        renderComponent(true, title);
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});
