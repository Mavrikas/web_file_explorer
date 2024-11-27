import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddFolderModal from './AddFolderModal';

describe('AddFolderModal', () => {
    const handleModalVisibility = jest.fn();
    const confirmBtn = jest.fn();
    const pathsArray = ['existingFolder'];
    const selectedPath: string[] = [];

    const renderComponent = (isOpen: boolean) => {
        render(
            <AddFolderModal
                handleModalVisibility={handleModalVisibility}
                isOpen={isOpen}
                title="Add Folder"
                confirmBtn={confirmBtn}
                pathsArray={pathsArray}
                selectedPath={selectedPath}
            />
        );
    };

    it('should render the modal when isOpen is true', () => {
        renderComponent(true);
        expect(screen.getByTestId('add-folder-modal')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
        renderComponent(false);
        expect(
            screen.queryByTestId('add-folder-modal')
        ).not.toBeInTheDocument();
    });

    it('should display an error message when folder name is empty', () => {
        renderComponent(true);
        fireEvent.click(screen.getByText('Confirm'));
        expect(
            screen.getByText('Folder name cannot be empty')
        ).toBeInTheDocument();
    });

    it('should display an error message when folder already exists', () => {
        renderComponent(true);
        fireEvent.change(screen.getByTestId('folder-name'), {
            target: { value: 'existingFolder' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(screen.getByText('Folder already exists')).toBeInTheDocument();
    });

    it('should call confirmBtn with the folder name when input is valid', () => {
        renderComponent(true);
        fireEvent.change(screen.getByTestId('folder-name'), {
            target: { value: 'newFolder' },
        });
        fireEvent.click(screen.getByText('Confirm'));
        expect(confirmBtn).toHaveBeenCalledWith('newFolder');
    });

    it('should call handleModalVisibility when Cancel button is clicked', () => {
        renderComponent(true);
        fireEvent.click(screen.getByText('Cancel'));
        expect(handleModalVisibility).toHaveBeenCalled();
    });
});
