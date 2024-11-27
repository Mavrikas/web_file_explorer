import React from 'react';
import CloseIcon from '../Icons/CloseIcon';

type ModalProps = {
    handleModalVisibility: () => void;
    handleSubmit?: () => void;
    title: string;
    children?: React.ReactNode;
    testid?: string;
};
export default function Modal({
    handleModalVisibility,
    title,
    children,
    handleSubmit,
    testid,
}: ModalProps) {
    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit && handleSubmit();
    };

    return (
        <>
            <div className="size-full bg-slate-400 opacity-30 absolute top-0 left-0 flex justify-center items-center"></div>
            <div
                data-testid={testid ? testid : 'modal'}
                className="min-w-[400px] min-h-[250px] bg-white opacity-100 p-[20px] absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 rounded-md flex flex-col justify-start"
            >
                <div className="w-full flex justify-between items-center">
                    <h2 className="text-lg font-bold text-black">{title}</h2>
                    <button
                        className="hover:drop-shadow"
                        onClick={handleModalVisibility}
                    >
                        <CloseIcon />
                    </button>
                </div>
                {handleSubmit ? (
                    <form
                        data-testid="modal-form"
                        onSubmit={handleOnSubmit}
                        className="w-full h-full flex flex-col justify-between"
                    >
                        {children}
                    </form>
                ) : (
                    children
                )}
            </div>
        </>
    );
}
