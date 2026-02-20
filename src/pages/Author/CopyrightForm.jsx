import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Breadcrumb, message, Modal, Input, Spin, Result } from 'antd';
import { FaArrowLeft, FaPenNib, FaFileContract } from 'react-icons/fa';
import moment from 'moment';
import usePrint from '../../hooks/usePrint';
import './CopyrightForm.css';

// New Imports
import { copyrightApi, manuscriptApi } from '../../services/api';
import FormRenderer from '../../components/DynamicForm/FormRenderer';
import SignatureCanvas from 'react-signature-canvas';

const { Title } = Typography;

const CopyrightForm = ({ viewOnly = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [template, setTemplate] = useState(null);
    const [manuscript, setManuscript] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [noSubmission, setNoSubmission] = useState(false);

    // Signing State
    const [signatures, setSignatures] = useState({});
    const [signModalVisible, setSignModalVisible] = useState(false);
    const [currentSignIndex, setCurrentSignIndex] = useState(null);
    const [signName, setSignName] = useState('');

    const componentRef = useRef();
    const sigCanvasRef = useRef(null);
    const handlePrint = usePrint(componentRef, manuscript?.paper_title || 'CopyrightAgreement');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            // First, check if a submission already exists
            try {
                const submissionRes = await copyrightApi.getSubmission(id);
                if (submissionRes.data.success && submissionRes.data.data) {
                    const { submission, template: savedTemplate } = submissionRes.data.data;

                    // Parse schema if stringified
                    const schema = typeof savedTemplate.schema === 'string'
                        ? JSON.parse(savedTemplate.schema)
                        : savedTemplate.schema;

                    // Parse submission_data if stringified
                    const submissionData = typeof submission.submission_data === 'string'
                        ? JSON.parse(submission.submission_data)
                        : submission.submission_data;

                    // Get manuscript data for display
                    const manuscriptRes = await copyrightApi.getManuscript(id);
                    const rawData = manuscriptRes.data.data;
                    const formattedData = {
                        ...rawData,
                        authors_formatted: (rawData.authors || []).map(a => `${a.first_name} ${a.last_name}`).join(', ')
                    };

                    setTemplate(schema);
                    setManuscript(formattedData);
                    setSignatures(submissionData?.signatures || {});
                    setIsSubmitted(true);
                    setLoading(false);
                    return;
                }
            } catch (subError) {
                // 404 means no submission exists
                if (subError.response?.status === 404) {
                    // If viewOnly mode (admin), show message and stop
                    if (viewOnly) {
                        setNoSubmission(true);
                        setLoading(false);
                        return;
                    }
                    // Otherwise continue to show fresh form for author
                } else {
                    throw subError;
                }
            }

            // No existing submission, load fresh form
            const [templateRes, manuscriptRes] = await Promise.all([
                copyrightApi.getActiveTemplate(),
                copyrightApi.getManuscript(id)
            ]);

            const templateData = templateRes.data.data;
            const rawData = manuscriptRes.data.data;

            // Parse schema if it's a string (backend returns stringified JSON)
            const schema = typeof templateData.schema === 'string'
                ? JSON.parse(templateData.schema)
                : templateData.schema;

            // Format data for the template (e.g. combined author string)
            const formattedData = {
                ...rawData,
                authors_formatted: (rawData.authors || []).map(a => `${a.first_name} ${a.last_name}`).join(', ')
            };

            setTemplate(schema);
            setManuscript(formattedData);
            setIsSubmitted(false);
        } catch (error) {
            console.error("Failed to load form data", error);
            message.error("Failed to load copyright form.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignClick = (index) => {
        setCurrentSignIndex(index);
        setSignName('');
        setSignModalVisible(true);
    };

    const handleSignConfirm = () => {
        if (sigCanvasRef.current.isEmpty()) {
            message.error('Please draw your signature');
            return;
        }
        const signatureImage = sigCanvasRef.current.getCanvas().toDataURL('image/png');
        setSignatures(prev => ({
            ...prev,
            [currentSignIndex]: {
                signatureImage: signatureImage,
                date: moment().format('DD/MM/YYYY')
            }
        }));
        setSignModalVisible(false);
        message.success('Signed successfully');
    };

    const handleSubmit = async () => {
        if (Object.keys(signatures).length === 0) {
            message.warning('Please sign at least one author slot');
            return;
        }

        try {
            const payload = {
                manuscript_id: manuscript.manuscript_id,
                template_version: template.version,
                signatures: signatures
            };
            const response = await copyrightApi.submit(payload);
            if (response.data.success) {
                message.success(response.data.data.message || 'Copyright agreement submitted successfully');
                
                // Update manuscript status from "Awaiting Copyright" to "Copyright Received"
                try {
                    await manuscriptApi.updateStatus(manuscript.manuscript_id, {
                        status: 'Copyright Received',
                        comment: 'Copyright form has been submitted by the author',
                        statusUpdatedBy: "system"
                    });
                } catch (statusError) {
                    console.error("Failed to update manuscript status:", statusError);
                    // Don't show error to user as copyright was submitted successfully
                }
                
                navigate(-1);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to submit form";
            message.error(errorMessage);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;

    // Admin view with no submission - show message
    if (noSubmission) {
        return (
            <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
                <Result
                    status="info"
                    title="Copyright Form Not Submitted Yet"
                    subTitle="The author has not submitted the copyright agreement for this manuscript yet."
                    extra={
                        <Button type="primary" onClick={() => navigate(-1)} className="bg-[#12b48b] border-none">
                            Go Back
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!manuscript || !template) return <div className="p-6 text-center text-gray-500">Form not available</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen print:p-0 print:bg-white">
            {/* Navigation and Actions - Hidden during print */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-3">
                    <Button
                        shape="circle"
                        icon={<FaArrowLeft />}
                        onClick={() => navigate(-1)}
                        className="border-none shadow-sm text-gray-600 hover:text-[#12b48b] bg-white"
                    />
                    <div>
                        <Title level={4} className="m-0 text-gray-800">Copyright Form</Title>
                        <Breadcrumb items={[
                            { title: 'Dashboard' },
                            { title: 'My Manuscripts', onClick: () => navigate('/dashboard/submit-manuscript'), className: 'cursor-pointer' },
                            { title: 'Copyright Reference' }
                        ]} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint} className="hidden md:inline-block">
                        Print / Save as PDF
                    </Button>
                    {!isSubmitted && (
                        <Button type="primary" onClick={handleSubmit} className="bg-[#12b48b] hover:bg-[#0e9f7a] border-none shadow-md">
                            Submit Agreement
                        </Button>
                    )}
                    {isSubmitted && (
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                            <FaFileContract /> Already Submitted
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Form Container */}
            <div ref={componentRef} className="bg-white shadow-xl mx-auto max-w-6xl p-8 md:p-12 font-calibri text-black leading-relaxed print:shadow-none print:p-12">
                <FormRenderer
                    schema={template}
                    data={manuscript}
                    signatures={signatures}
                    onSign={isSubmitted ? null : handleSignClick}
                />
            </div>

            {/* Sign Modal (Shared Wrapper) */}
            <Modal
                title="E-Sign Copyright Form"
                open={signModalVisible}
                onOk={handleSignConfirm}
                onCancel={() => setSignModalVisible(false)}
                okText="Sign Document"
                okButtonProps={{ className: 'bg-[#12b48b] hover:bg-[#0e9f7a]' }}
                centered
            >
                <div className="py-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100 flex items-start gap-3">
                        <FaFileContract className="text-blue-500 text-xl mt-1" />
                        <div className="text-sm text-blue-800">
                            You are about to digitally sign the copyright transfer agreement for manuscript: <strong>{manuscript.paper_title}</strong>.
                        </div>
                    </div>

                    <p className="mb-2 font-semibold">Draw your signature below:</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-3">
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            penColor="black"
                            canvasProps={{
                                width: 450,
                                height: 150,
                                className: 'signature-canvas w-full'
                            }}
                        />
                    </div>
                    <Button
                        onClick={() => sigCanvasRef.current?.clear()}
                        size="small"
                        className="mb-3"
                    >
                        Clear Signature
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                        This signature will be stamped with today's date: {moment().format('DD MMM, YYYY')}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default CopyrightForm;

