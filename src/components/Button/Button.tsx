import React from 'react';

type ButtonProps = {
    text?: string;
    onClick: () => void;
    type: 'primary' | 'secondary';
};

export default function Button({ text, onClick, type }: ButtonProps) {
    const PRIMARY_CLASSES =
        'rounded-md text-neutral-100 border border-blue-700 bg-blue-700 p-2 hover:shadow-lg min-w-[80px]';
    const SECONDARY_CLASSES =
        'rounded-md border border-black p-2 hover:shadow-lg min-w-[80px]';
    const classes = type === 'primary' ? PRIMARY_CLASSES : SECONDARY_CLASSES;

    return (
        <button className={classes} onClick={onClick}>
            {text}
        </button>
    );
}
