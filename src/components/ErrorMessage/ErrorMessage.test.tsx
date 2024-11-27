import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage component', () => {
    it('renders the error message when errorContent is provided', () => {
        const { getByText } = render(
            <ErrorMessage errorContent="Error occurred" />
        );
        expect(getByText('Error occurred')).toBeInTheDocument();
    });

    it('does not render anything when errorContent is an empty string', () => {
        const { container } = render(<ErrorMessage errorContent="" />);
        expect(container.firstChild).toBeNull();
    });
});
