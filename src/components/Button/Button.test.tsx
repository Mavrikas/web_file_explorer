import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
    it('renders with primary type', () => {
        const { getByText } = render(
            <Button text="Primary Button" onClick={() => {}} type="primary" />
        );
        const buttonElement = getByText(/Primary Button/i);
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('bg-blue-700');
    });

    it('renders with secondary type', () => {
        const { getByText } = render(
            <Button
                text="Secondary Button"
                onClick={() => {}}
                type="secondary"
            />
        );
        const buttonElement = getByText(/Secondary Button/i);
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('border-black');
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        const { getByText } = render(
            <Button text="Click Me" onClick={handleClick} type="primary" />
        );
        const buttonElement = getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
