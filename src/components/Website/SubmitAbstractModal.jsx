import React, { useState } from 'react';
import { Modal, Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { abstractSubmissionApi } from '../../services/api';

const SubmitAbstractModal = ({ isOpen, onClose, conferenceId }) => {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        // values.abstractFile is now an array of files due to getValueFromEvent
        if (!values.abstractFile || values.abstractFile.length === 0) {
            message.error("Please upload your abstract file (DOC/DOCX).");
            return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            message.error("Please login to submit abstract.");
            return;
        }
        const user = JSON.parse(userStr);
        const authorId = user.id || user.userId;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("conference_id", conferenceId);
            formData.append("author_id", authorId);
            // Access the file correctly from the array
            formData.append("abstract", values.abstractFile[0].originFileObj);

            // Using the new abstractSubmissionApi
            let response;
            try {
                response = await abstractSubmissionApi.submit(formData);
            } catch (err) {
                response = err.response;
            }

            // Check for success property, successful HTTP status, or success message
            const isSuccess = response && response.data && (
                response.data.success ||
                response.status === 201 ||
                response.status === 200 ||
                response.data.message === "Abstract submitted successfully."
            );

            if (isSuccess) {
                onClose(); // Close modal immediately
                form.resetFields(); // Reset form
                // Ensure modal closes before showing success alert
                setTimeout(() => {
                    Swal.fire({
                        title: "Submitted!",
                        text: "Abstract submitted successfully!",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        navigate('/dashboard/conference/full-paper-submission');
                    });
                }, 300);
            } else {
                onClose();
                // Handle 400 and other errors
                const errorMessage = response?.data?.message || "Failed to submit abstract.";
                Swal.fire({
                    title: "Error",
                    text: errorMessage,
                    icon: "error"
                });
            }
        } catch (error) {
            onClose();
            console.error("Abstract submission error:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred. Please try again.",
                icon: "error"
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Submit Abstract"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Upload Abstract (DOC/DOCX)"
                    name="abstractFile"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e && e.fileList;
                    }}
                    rules={[{ required: true, message: 'Please upload a DOC or DOCX file' }]}
                >
                    <Upload
                        beforeUpload={(file) => {
                            const isDoc = file.type === 'application/msword' ||
                                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                            if (!isDoc) {
                                message.error('You can only upload DOC or DOCX files!');
                            }
                            return false; // Prevent auto upload
                        }}
                        maxCount={1}
                        accept=".doc,.docx"
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#12b48b]">
                        Submit
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default SubmitAbstractModal;
