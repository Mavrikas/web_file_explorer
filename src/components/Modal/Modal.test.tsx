import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
    const handleModalVisibility = jest.fn();
    const handleSubmit = jest.fn();
    const title = 'Test Modal';
    const children = <div>Modal Content</div>;

    test('renders Modal with title and children', () => {
        render(
            <Modal handleModalVisibility={handleModalVisibility} title={title}>
                {children}
            </Modal>
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('calls handleModalVisibility when close button is clicked', () => {
        render(
            <Modal handleModalVisibility={handleModalVisibility} title={title}>
                {children}
            </Modal>
        );

        fireEvent.click(screen.getByRole('button'));
        expect(handleModalVisibility).toHaveBeenCalledTimes(1);
    });

    test('calls handleSubmit when form is submitted', () => {
        render(
            <Modal
                handleModalVisibility={handleModalVisibility}
                handleSubmit={handleSubmit}
                title={title}
            >
                {children}
            </Modal>
        );

        fireEvent.submit(screen.getByTestId('modal-form'));
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    test('renders with provided testid', () => {
        const testid = 'custom-modal';
        render(
            <Modal
                handleModalVisibility={handleModalVisibility}
                title={title}
                testid={testid}
            >
                {children}
            </Modal>
        );

        expect(screen.getByTestId(testid)).toBeInTheDocument();
    });
});
