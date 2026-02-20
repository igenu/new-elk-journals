import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const ThankYouModal = ({ open, onOk }) => {
    return (
        <Modal
            open={open}
            onCancel={onOk}
            footer={null}
            centered
            width={400}
            className="text-center"
        >
            <div className="flex flex-col items-center justify-center py-6">
                <CheckCircleFilled className="text-[#12b48b] text-6xl mb-4" />
                <h2 className="text-2xl font-bold text-[#0b1c2e] mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6 text-center px-4">
                    Your conference registration has been successfully submitted. We will contact you shortly.
                </p>
                <Button
                    type="primary"
                    onClick={onOk}
                    className="bg-[#204066] hover:bg-[#0b1c2e] h-10 px-8 rounded-md font-semibold"
                >
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default ThankYouModal;
