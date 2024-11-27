import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentViewer from './ContentViewer';
import { Data } from '@/store/types';

const mockFile: Data = {
    id: '1',
    name: 'test.json',
    content: '{"key": "value"}',
    path: '/test.json',
};

const mockUpdateFile = jest.fn();

describe('ContentViewer', () => {
    it('renders the component with file content', () => {
        render(<ContentViewer file={mockFile} updateFile={mockUpdateFile} />);
        expect(screen.getByText('/test.json')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('toggles edit mode', () => {
        render(<ContentViewer file={mockFile} updateFile={mockUpdateFile} />);
        fireEvent.click(screen.getByText('Edit'));
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('displays JSON content correctly', () => {
        render(<ContentViewer file={mockFile} updateFile={mockUpdateFile} />);
        expect(screen.getByText(/"key": "value"/)).toBeInTheDocument();
    });

    it('validates JSON input', () => {
        render(<ContentViewer file={mockFile} updateFile={mockUpdateFile} />);
        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'invalid json' },
        });
        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
    });

    it('calls updateFile on valid input', () => {
        render(<ContentViewer file={mockFile} updateFile={mockUpdateFile} />);
        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: '{"newKey": "newValue"}' },
        });
        fireEvent.click(screen.getByText('Save'));
        expect(mockUpdateFile).toHaveBeenCalledWith('{"newKey": "newValue"}');
    });

    it('displays image content correctly', () => {
        const imageFile: Data = {
            id: '2',
            name: 'image.png',
            content: 'http://example.com/image.png',
            path: '/image.png',
        };
        render(<ContentViewer file={imageFile} updateFile={mockUpdateFile} />);
        expect(screen.getByRole('img')).toHaveAttribute(
            'src',
            'http://example.com/image.png'
        );
    });

    it('validates image URL input', () => {
        const imageFile: Data = {
            id: '2',
            name: 'image.png',
            content: 'http://example.com/image.png',
            path: '/image.png',
        };
        render(<ContentViewer file={imageFile} updateFile={mockUpdateFile} />);
        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'invalid url' },
        });
        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByText('Invalid image URL')).toBeInTheDocument();
    });
});
