import React, { useState, useEffect } from 'react';
import { Modal, Upload, Button, message, Tag, Steps, Divider } from 'antd';
import { UploadOutlined, FileTextOutlined, InboxOutlined, CheckCircleOutlined, FormOutlined } from '@ant-design/icons';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { fullPaperCopyrightApi } from '../services/api';
import FullPaperCopyrightForm from './FullPaperCopyrightForm';
import moment from 'moment';

const { Dragger } = Upload;

const ALLOWED_TYPES = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = '.doc,.docx';

const FullPaperUploadModal = ({ open, onCancel, abstractRecord, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [copyrightData, setCopyrightData] = useState(null);
    const [isCopyrightValid, setIsCopyrightValid] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            // If full paper files already exist, skip to copyright step
            const hasExistingFiles = abstractRecord?.full_paper_files && abstractRecord.full_paper_files.length > 0;
            setCurrentStep(hasExistingFiles ? 1 : 0);
            setFileList([]);
            setCopyrightData(null);
            setIsCopyrightValid(false);
        }
    }, [open, abstractRecord]);

    const handleUpload = async () => {
        const hasExistingFiles = abstractRecord?.full_paper_files && abstractRecord.full_paper_files.length > 0;

        // Validate file upload if no existing files
        if (!hasExistingFiles && fileList.length === 0) {
            message.warning('Please select a file to upload.');
            return;
        }

        if (!copyrightData || !copyrightData.signatures || Object.keys(copyrightData.signatures).length === 0) {
            message.warning('Please complete and sign the copyright agreement.');
            return;
        }

        setUploading(true);
        try {
            let response;

            if (hasExistingFiles) {
                // Submit only copyright (files already exist)
                const latestFile = abstractRecord.full_paper_files[0]; // Get the latest file
                response = await fullPaperCopyrightApi.submitCopyrightOnly(
                    abstractRecord.id,
                    latestFile.id,
                    copyrightData
                );
            } else {
                // Submit both file and copyright
                const formData = new FormData();
                formData.append('fullPaperFile', fileList[0]);
                formData.append('copyrightData', JSON.stringify(copyrightData));
                response = await fullPaperCopyrightApi.submitWithCopyright(abstractRecord.id, formData);
            }

            if (response.data && response.data.success) {
                message.success(response.data.data?.message || response.data.message || 'Copyright submitted successfully!');
                setFileList([]);
                setCopyrightData(null);
                setCurrentStep(0);
                if (onSuccess) onSuccess();
                onCancel();
            }
        } catch (error) {
            console.error('Error submitting:', error);
            message.error(error?.response?.data?.message || 'Failed to submit');
        } finally {
            setUploading(false);
        }
    };

    const uploadProps = {
        multiple: false,
        accept: ALLOWED_EXTENSIONS,
        fileList,
        beforeUpload: (file) => {
            const isAllowed = ALLOWED_TYPES.includes(file.type);
            if (!isAllowed) {
                message.error(`${file.name} is not a supported file type. Allowed: DOC, DOCX only.`);
                return Upload.LIST_IGNORE;
            }
            const isLt20M = file.size / 1024 / 1024 < 20;
            if (!isLt20M) {
                message.error(`${file.name} exceeds 20MB size limit.`);
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        onRemove: () => {
            setFileList([]);
        },
    };

    const handleClose = () => {
        setFileList([]);
        setCopyrightData(null);
        setCurrentStep(0);
        onCancel();
    };

    const goToNextStep = () => {
        const hasExistingFiles = abstractRecord?.full_paper_files && abstractRecord.full_paper_files.length > 0;
        if (currentStep === 0 && !hasExistingFiles && fileList.length === 0) {
            message.warning('Please select a file to upload before proceeding.');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const goToPreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleCopyrightDataChange = (data) => {
        setCopyrightData(data);
    };

    const handleCopyrightValidationChange = (isValid) => {
        setIsCopyrightValid(isValid);
    };

    const steps = [
        {
            title: 'Upload Paper',
            icon: <FileTextOutlined />,
        },
        {
            title: 'Copyright',
            icon: <FormOutlined />,
        },
    ];

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-[#12b48b]" />
                    <span>Submit Full Paper with Copyright</span>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            destroyOnClose
            centered={false}
            width={1200}
            style={{ top: 10, paddingBottom: 10 }}
            bodyStyle={{ overflowY: 'auto', padding: '24px' }}
        >
            <div className="py-2">
                {/* Steps indicator */}
                <Steps
                    current={currentStep}
                    items={steps}
                    className="mb-6"
                    size="small"
                />

                {abstractRecord && (
                    <>
                        {/* Abstract Info - Always visible */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Conference</span>
                                <span className="text-sm font-medium text-[#12b48b]">{abstractRecord.conference?.name || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Abstract Status</span>
                                <Tag color="green">ACCEPTED</Tag>
                            </div>
                        </div>

                        {abstractRecord.title && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Paper Title</span>
                                <span className="text-sm text-gray-800 font-medium">{abstractRecord.title}</span>
                            </div>
                        )}

                        {/* Show previously uploaded files if any */}
                        {abstractRecord.full_paper_files && abstractRecord.full_paper_files.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <span className="text-xs text-blue-600 font-medium block mb-2">Previously Uploaded Files</span>
                                {abstractRecord.full_paper_files.map((f) => (
                                    <div key={f.id} className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                                        <FileTextOutlined className="text-blue-500" />
                                        <span>{f.file_name}</span>
                                        <span className="text-xs text-gray-400">({moment(f.uploaded_at).format('DD MMM YYYY')})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <Divider className="my-4" />

                {/* Step 1: File Upload */}
                {currentStep === 0 && (
                    <div className="step-content">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Full Paper <span className="text-red-500">*</span>
                            </label>
                            <Dragger {...uploadProps}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ color: '#12b48b' }} />
                                </p>
                                <p className="ant-upload-text">Click or drag file to upload</p>
                                <p className="ant-upload-hint text-xs">
                                    Supported: Word documents (.doc, .docx) only. Max 20MB.
                                </p>
                            </Dragger>
                        </div>

                        {fileList.length > 0 && (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircleOutlined />
                                    <span className="font-medium">File selected:</span>
                                    <span>{fileList[0].name}</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
                            <p className="text-sm text-amber-800">
                                <strong>Important:</strong> After uploading your paper, you will need to complete and sign
                                a copyright agreement in the next step. Both the paper and signed copyright are required
                                for successful submission.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Copyright Form */}
                {currentStep === 1 && (
                    <div className="step-content">
                        <FullPaperCopyrightForm
                            abstractId={abstractRecord?.id}
                            abstractData={abstractRecord}
                            onCopyrightDataChange={handleCopyrightDataChange}
                            onValidationChange={handleCopyrightValidationChange}
                        />
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div>
                        {currentStep > 0 && (
                            <Button
                                onClick={goToPreviousStep}
                                icon={<FaArrowLeft />}
                                className="flex items-center gap-1"
                            >
                                Previous
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleClose}>Cancel</Button>

                        {currentStep === 0 ? (
                            <Button
                                type="primary"
                                onClick={goToNextStep}
                                disabled={fileList.length === 0}
                                className="bg-[#12b48b] hover:bg-[#0e9a77] border-none flex items-center gap-1"
                            >
                                Next: Copyright <FaArrowRight />
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                onClick={handleUpload}
                                loading={uploading}
                                disabled={!isCopyrightValid || (!abstractRecord?.full_paper_files?.length && fileList.length === 0)}
                                className="bg-[#12b48b] hover:bg-[#0e9a77] border-none"
                            >
                                {abstractRecord?.full_paper_files?.length > 0 ? 'Submit Copyright' : 'Submit Paper & Copyright'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FullPaperUploadModal;
