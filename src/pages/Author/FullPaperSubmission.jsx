import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table, Card, Tag, Button, message, Tooltip, Breadcrumb, Modal } from 'antd';
import { FaDownload, FaUpload } from 'react-icons/fa';
import { HomeOutlined, FileTextOutlined, CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { ImageURl } from '../../services/serviceApi';
import { abstractSubmissionApi, fullPaperCopyrightApi } from '../../services/api';
import FullPaperUploadModal from '../../components/FullPaperUploadModal';
import FormRenderer from '../../components/DynamicForm/FormRenderer';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';

const FullPaperSubmission = () => {
    const [abstracts, setAbstracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadModal, setUploadModal] = useState({ open: false, record: null });
    const [copyrightModal, setCopyrightModal] = useState({ open: false, data: null, loading: false });
    const pollingIntervalRef = useRef(null);
    const copyrightPrintRef = useRef(null);

    const fetchAcceptedAbstracts = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await abstractSubmissionApi.getAuthorAccepted();
            if (response.data && response.data.success) {
                setAbstracts(response.data.data);
            } else {
                setAbstracts([]);
            }
        } catch (error) {
            console.error('Error fetching accepted abstracts:', error);
            if (showLoading) message.error(error?.response?.data?.message || 'Failed to fetch accepted abstracts');
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchAcceptedAbstracts();
    }, [fetchAcceptedAbstracts]);

    // Polling for live data updates (every 10 seconds)
    useEffect(() => {
        if (loading) return;

        pollingIntervalRef.current = setInterval(() => {
            fetchAcceptedAbstracts(false); // Silent fetch without loading state
        }, 10000); // Poll every 10 seconds

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [loading, fetchAcceptedAbstracts]);

    const openUploadModal = (record) => {
        setUploadModal({ open: true, record });
    };

    const closeUploadModal = () => {
        setUploadModal({ open: false, record: null });
    };

    const openCopyrightModal = async (record) => {
        setCopyrightModal({ open: true, data: null, loading: true });
        try {
            const response = await fullPaperCopyrightApi.getSubmission(record.id);
            if (response.data && response.data.success) {
                const { submission, template } = response.data.data;

                // Parse schema if it's a string (backend might return stringified JSON)
                const schema = typeof template.schema === 'string'
                    ? JSON.parse(template.schema)
                    : template.schema;

                // Parse submission_data if it's a string
                const submissionData = typeof submission.submission_data === 'string'
                    ? JSON.parse(submission.submission_data)
                    : submission.submission_data;

                // Extract signatures from submission data
                const signatures = submissionData?.signatures || {};

                // Ensure authors array has proper structure
                let authorsArray = submissionData?.authors || [];

                // If authors array is empty or doesn't have proper structure, create from root-level data
                if (!authorsArray || authorsArray.length === 0) {
                    authorsArray = [{
                        full_name: submission.author_name,
                        name: submission.author_name,
                        first_name: submission.author_name?.split(' ')[0] || '',
                        last_name: submission.author_name?.split(' ').slice(1).join(' ') || '',
                        email: submission.author_email,
                        designation: submission.author_designation,
                        institution: submission.author_institution,
                        address: submission.author_address,
                        phone: submission.author_phone,
                        city: '',
                        state: '',
                        country: '',
                        is_corresponding_author: true
                    }];
                } else {
                    // Ensure each author has all required fields
                    authorsArray = authorsArray.map((author, idx) => ({
                        full_name: author.full_name || author.name || `Author ${idx + 1}`,
                        name: author.name || author.full_name || `Author ${idx + 1}`,
                        first_name: author.first_name || author.full_name?.split(' ')[0] || author.name?.split(' ')[0] || '',
                        last_name: author.last_name || author.full_name?.split(' ').slice(1).join(' ') || author.name?.split(' ').slice(1).join(' ') || '',
                        email: author.email || '',
                        designation: author.designation || '',
                        institution: author.institution || '',
                        address: author.address || '',
                        phone: author.phone || '',
                        city: author.city || '',
                        state: author.state || '',
                        country: author.country || '',
                        is_corresponding_author: author.is_corresponding_author || idx === 0
                    }));
                }

                // Merge root-level submission fields with submission_data for FormRenderer
                const mergedData = {
                    ...submissionData, // Fields from submission_data (manuscriptTitle, journalId)
                    paper_title: submission.paper_title,
                    conference_name: submission.conference_name,
                    author_name: submission.author_name,
                    author_email: submission.author_email,
                    author_designation: submission.author_designation,
                    author_institution: submission.author_institution,
                    author_address: submission.author_address,
                    author_phone: submission.author_phone,
                    // Override authors array with proper structure
                    authors: authorsArray,
                    // Also provide journal object format if journalId exists
                    journal: submissionData?.journal || {
                        id: submissionData?.journalId,
                        title: submission.conference_name || 'Unknown Journal'
                    },
                    // Ensure authors_formatted for display
                    authors_formatted: authorsArray.map(a => a.name || a.full_name).join(', ')
                };

                setCopyrightModal({
                    open: true,
                    data: {
                        ...response.data.data,
                        template: { ...template, schema },
                        submission: { ...submission, submission_data: submissionData },
                        mergedData, // Add merged data for FormRenderer
                        signatures
                    },
                    loading: false
                });
            } else {
                message.error('Failed to fetch copyright details');
                setCopyrightModal({ open: false, data: null, loading: false });
            }
        } catch (error) {
            console.error('Error fetching copyright:', error);
            message.error(error?.response?.data?.message || 'Failed to fetch copyright details');
            setCopyrightModal({ open: false, data: null, loading: false });
        }
    };

    const closeCopyrightModal = () => {
        setCopyrightModal({ open: false, data: null, loading: false });
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 50,
            render: (_, __, index) => (
                <span className="text-gray-600 font-mono text-xs">#{index + 1}</span>
            ),
        },
        {
            title: 'Abstract ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (id) => <span className="font-mono text-xs text-gray-500">ABS-{String(id).padStart(3, '0')}</span>,
        },
        // {
        //     title: 'Abstract Title',
        //     dataIndex: 'title',
        //     key: 'title',
        //     width: 250,
        //     render: (title) => <span className="font-medium text-gray-800">{title}</span>,
        // },
        {
            title: 'Conference',
            dataIndex: ['conference', 'name'],
            key: 'conference',
            width: 220,
            render: (text) => <span className="font-medium text-[#12b48b]">{text || 'N/A'}</span>,
        },
        {
            title: 'Abstract File',
            dataIndex: 'abstract_file',
            key: 'abstract_file',
            width: 120,
            render: (text) =>
                text ? (
                    <a
                        href={`${ImageURl}${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                        <FaDownload /> Download
                    </a>
                ) : (
                    <span className="text-gray-400">No File</span>
                ),
        },
        {
            title: 'Submission Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (date) => moment(date).format('DD MMM YYYY, hh:mm A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: () => (
                <Tag color="green" icon={<CheckCircleOutlined />}>
                    ACCEPTED
                </Tag>
            ),
        },
        {
            title: 'Full Paper',
            key: 'full_paper',
            width: 200,
            render: (_, record) => {
                const files = record.full_paper_files;
                if (files && files.length > 0) {
                    return (
                        <div className="space-y-1">
                            {files.map((f) => (
                                <div key={f.id} className="flex items-center gap-1">
                                    <Tooltip title={`Uploaded: ${moment(f.uploaded_at).format('DD MMM YYYY, hh:mm A')}`}>
                                        <a
                                            href={`${ImageURl}${f.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                        >
                                            <FaDownload className="text-[10px]" />
                                            <span className="truncate max-w-[120px]">{f.file_name}</span>
                                        </a>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    );
                }

                return (
                    <Tag color="warning" className="text-xs">
                        Not Submitted
                    </Tag>
                );
            },
        },
        {
            title: 'Copyright',
            key: 'copyright',
            width: 140,
            render: (_, record) => {
                if (record.copyright_submitted) {
                    return (
                        <Tooltip title={`Signed by: ${record.copyright_submission?.author_name || 'Author'}`}>
                            <Button
                                size="small"
                                type="primary"
                                icon={<SafetyCertificateOutlined />}
                                onClick={() => openCopyrightModal(record)}
                                className="bg-[#12b48b] hover:bg-[#0e9a77] border-none text-xs"
                            >
                                View
                            </Button>
                        </Tooltip>
                    );
                }
                return (
                    <Tag color="warning" className="text-xs">
                       Pending
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            width: 160,
            render: (_, record) => {
                const hasFiles = record.full_paper_files && record.full_paper_files.length > 0;
                const hasCopyright = record.copyright_submitted;
                const isFullySubmitted = hasFiles && hasCopyright;

                return (
                    <Button
                        type="primary"
                        size="small"
                        icon={<FaUpload />}
                        onClick={() => openUploadModal(record)}
                        disabled={isFullySubmitted}
                        className={`flex items-center gap-1 ${isFullySubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#12b48b] hover:bg-[#0e9a77]'} border-none`}
                    >
                        {isFullySubmitted ? 'Completed' : 'Submit Full Paper'}
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { href: '/dashboard', title: <HomeOutlined /> },
                        { title: 'Full Paper Submission' },
                    ]}
                />
            </div>

            <Card
                title={
                    <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-[#12b48b]" />
                        <span>Full Paper Submission</span>
                    </div>
                }
                className="shadow-sm border-t-4 border-t-[#12b48b]"
                extra={
                    <span className="text-sm text-gray-500">
                        Only accepted abstracts are shown below
                    </span>
                }
            >
                <Table
                    columns={columns}
                    dataSource={abstracts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No accepted abstracts found. Full paper submission is available only after your abstract is accepted.' }}
                    scroll={{ x: 1300 }}
                />
            </Card>

            {/* Full Paper Upload Modal */}
            <FullPaperUploadModal
                open={uploadModal.open}
                onCancel={closeUploadModal}
                abstractRecord={uploadModal.record}
                onSuccess={fetchAcceptedAbstracts}
            />

            {/* Copyright View Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <SafetyCertificateOutlined className="text-[#12b48b]" />
                        <span>Copyright Agreement</span>
                    </div>
                }
                open={copyrightModal.open}
                onCancel={closeCopyrightModal}
                footer={[
                    <Button
                        key="print"
                        onClick={useReactToPrint({
                            contentRef: copyrightPrintRef,
                            documentTitle: `Copyright_Abstract_${copyrightModal.data?.submission?.abstract_id || 'Agreement'}`,
                        })}
                        disabled={!copyrightModal.data}
                    >
                        Print / Save as PDF
                    </Button>,
                    <Button key="close" onClick={closeCopyrightModal}>
                        Close
                    </Button>
                ]}
                width={1100}
                centered={false}
                style={{ top: 10, paddingBottom: 10 }}
                bodyStyle={{ overflowY: 'auto', padding: '24px' }}
            >
                {copyrightModal.loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-gray-500">Loading copyright details...</div>
                    </div>
                ) : copyrightModal.data ? (
                    <div>
                        {/* Copyright Information - Not printed */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg no-print">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Submission Date</span>
                                    <span className="text-sm font-medium">
                                        {moment(copyrightModal.data.submission.createdAt).format('DD MMM YYYY, hh:mm A')}
                                    </span>
                                </div>
                                {copyrightModal.data.submitter && (
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Submitted By</span>
                                        <span className="text-sm font-medium">
                                            {copyrightModal.data.submitter.name} ({copyrightModal.data.submitter.email})
                                        </span>
                                    </div>
                                )}
                                
                            </div>
                        </div>

                        {/* Render Copyright Form - This will be printed */}
                        <div ref={copyrightPrintRef} className="bg-white p-8 print:p-12 font-calibri text-black leading-relaxed">
                            <FormRenderer
                                schema={copyrightModal.data.template.schema}
                                data={copyrightModal.data.mergedData}
                                signatures={copyrightModal.data.signatures}
                                onSign={null}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-gray-500">No copyright data available</div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default FullPaperSubmission;
