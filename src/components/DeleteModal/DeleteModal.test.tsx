import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteModal from './DeleteModal';

describe('DeleteModal Component', () => {
    const handleModalVisibility = jest.fn();
    const confirmBtn = jest.fn();
    const text = 'Are you sure you want to delete this item?';

    it('should render the modal with the correct text', () => {
        render(
            <DeleteModal
                handleModalVisibility={handleModalVisibility}
                isOpen={true}
                text={text}
                confirmBtn={confirmBtn}
            />
        );

        expect(
            screen.getByText('Are you sure you want to delete this item?')
        ).toBeInTheDocument();
    });

    it('should call confirmBtn when Confirm button is clicked', () => {
        render(
            <DeleteModal
                handleModalVisibility={handleModalVisibility}
                isOpen={true}
                text={text}
                confirmBtn={confirmBtn}
            />
        );

        fireEvent.click(screen.getByText('Confirm'));
        expect(confirmBtn).toHaveBeenCalled();
    });

    it('should call handleModalVisibility when Cancel button is clicked', () => {
        render(
            <DeleteModal
                handleModalVisibility={handleModalVisibility}
                isOpen={true}
                text={text}
                confirmBtn={confirmBtn}
            />
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(handleModalVisibility).toHaveBeenCalled();
    });

    it('should not render the modal when isOpen is false', () => {
        render(
            <DeleteModal
                handleModalVisibility={handleModalVisibility}
                isOpen={false}
                text={text}
                confirmBtn={confirmBtn}
            />
        );

        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });
});
