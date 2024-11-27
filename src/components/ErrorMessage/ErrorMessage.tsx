import React from 'react';

export default function ErrorMessage({
    errorContent,
}: {
    errorContent: string;
}) {
    return errorContent && <p className="text-red-500">{errorContent}</p>;
}
