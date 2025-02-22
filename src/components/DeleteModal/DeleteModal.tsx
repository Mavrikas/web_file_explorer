import React from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

type DeleteModalProps = {
    handleModalVisibility: () => void;
    isOpen: boolean;
    text: string;
    confirmBtn: () => void;
};
export default function DeleteModal({
    handleModalVisibility,
    isOpen,
    text,
    confirmBtn,
}: DeleteModalProps) {
    return (
        isOpen && (
            <Modal
                handleModalVisibility={handleModalVisibility}
                title={'Warning'}
                testid="delete-modal"
            >
                <p className="flex justify-between px-8 mt-[20px]">{text}</p>
                <div className="flex justify-between px-8 mt-[90px]">
                    <Button
                        text="Confirm"
                        onClick={confirmBtn}
                        type="primary"
                    />
                    <Button
                        text="Cancel"
                        onClick={handleModalVisibility}
                        type="secondary"
                    />
                </div>
            </Modal>
        )
    );
}
