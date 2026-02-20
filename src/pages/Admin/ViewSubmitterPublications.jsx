import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, message, Space, Tooltip, Select, Input, Upload, Row, Col, Popconfirm, Tabs, Card, Empty, Spin, Alert } from 'antd';
import { FaEye, FaPlus, FaUpload, FaPencilAlt, FaTrash, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { publicationApi, journalApi, journalIssueApi, manuscriptApi } from '../../services/api';
import { encryptId } from '../../utils/idEncryption';
import { ImageURl } from '../../services/serviceApi';

const { Option } = Select;
const { TextArea } = Input;

const ViewSubmitterPublications = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [journals, setJournals] = useState([]);
    const [issues, setIssues] = useState([]);
    const [editingPublication, setEditingPublication] = useState(null);
    const navigate = useNavigate();

    // New states for Auto Publication feature
    const [activeTab, setActiveTab] = useState('manual');
    const [awaitingManuscripts, setAwaitingManuscripts] = useState([]);
    const [selectedManuscript, setSelectedManuscript] = useState(null);
    const [loadingManuscripts, setLoadingManuscripts] = useState(false);
    const [autoFormValues, setAutoFormValues] = useState(null);

    // Fetch Initial Data
    useEffect(() => {
        fetchPublications();
        fetchJournals();
    }, []);

    const fetchPublications = async () => {
        setLoading(true);
        try {
            const response = await publicationApi.getAll();
            setPublications(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch publications", error);
            message.error("Failed to load publications");
        } finally {
            setLoading(false);
        }
    };

    const fetchJournals = async () => {
        try {
            const response = await journalApi.getAll();
            // Handle both array directly or wrapped in data
            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setJournals(data);
        } catch (error) {
            console.error("Failed to fetch journals", error);
        }
    };

    const fetchIssuesByJournal = async (journalId) => {
        if (!journalId) {
            setIssues([]);
            return [];
        }
        try {
            // Using real API - GET /api/journal-issues/journal/{journalId}
            const response = await journalIssueApi.getByJournal(journalId);
            const data = response.data.data || [];
            setIssues(data);
            return data;
        } catch (error) {
            console.error("Failed to fetch issues", error);
            message.error("Failed to load issues for the selected journal");
            setIssues([]);
            return [];
        }
    };

    // Fetch manuscripts with "Awaiting Copyright" or "Accepted" status
    const fetchAwaitingCopyrightManuscripts = async () => {
        setLoadingManuscripts(true);
        try {
            // Using real API - GET /api/manuscripts?status=Awaiting%20Copyright,Accepted
            // This fetches both manuscripts awaiting copyright and accepted manuscripts
            const response = await manuscriptApi.getAll({ status: 'Awaiting Copyright,Accepted' });
            setAwaitingManuscripts(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch manuscripts", error);
            message.error("Failed to load manuscripts for publication");
        } finally {
            setLoadingManuscripts(false);
        }
    };

    // Map manuscript data to publication form fields
    const mapManuscriptToPublication = (manuscript) => {
        console.log("Manuscript:", manuscript);
        // Build author name from authors array
        const authorName = manuscript.authors?.length > 0
            ? manuscript.authors.map(a => `${a.first_name} ${a.last_name}`).join(', ')
            : manuscript.submitter_name || '';

        // Build affiliations from authors array
        const affiliations = manuscript.authors?.length > 0
            ? manuscript.authors.map((a, index) => {
                const parts = [
                    `${a.first_name} ${a.last_name}`,
                    a.department,
                    a.institution,
                    a.country
                ].filter(Boolean); // Remove null/undefined/empty string values
                return `${index + 1}. ${parts.join(', ')}`;
            }).join('\n')
            : '';

        return {
            journal_id: manuscript.journal_id || '',
            issue_id: '', // Admin needs to select issue
            manuscript_id: manuscript.manuscript_id || '',
            title: manuscript.paper_title || '',
            author_name: authorName,
            doi: '', // To be filled by admin
            pages: '', // To be filled by admin
            author_affiliations: affiliations,
            abstract_description: manuscript.abstract || '',
            abstract_keywords: manuscript.keywords || manuscript.abstract_keywords || '',
            pdf_file: null,
            // Keep reference to source manuscript and file path
            source_manuscript_id: manuscript.id,
            manuscript_file_path: manuscript.manuscript_file_path || ''
        };
    };

    // Handle manuscript selection in Auto Publication tab
    const handleManuscriptSelect = async (manuscriptId) => {
        const manuscript = awaitingManuscripts.find(m => m.id === manuscriptId);
        setSelectedManuscript(manuscript);

        if (manuscript) {
            setAutoFormValues(null); // Clear previous while loading
            try {
                // Fetch full details using the public manuscript ID
                const response = await manuscriptApi.getNewManuscriptDetails(manuscript.manuscript_id);
                const fullDetails = response.data.data;

                if (fullDetails) {
                    console.log("Full Manuscript Details for Auto-Fill:", fullDetails);
                    const mappedValues = mapManuscriptToPublication(fullDetails);
                    setAutoFormValues(mappedValues);

                    // Set issues directly from the nested journal object if available
                    let availableIssues = [];
                    if (fullDetails.journal && fullDetails.journal.issues && fullDetails.journal.issues.length > 0) {
                        availableIssues = fullDetails.journal.issues;
                        setIssues(availableIssues);

                    } else if (fullDetails.journal_id) {
                        // Fallback to fetching if not in nested object
                        availableIssues = await fetchIssuesByJournal(fullDetails.journal_id);
                    }

                    // Auto-select first issue if available
                    if (availableIssues && availableIssues.length > 0) {
                        mappedValues.issue_id = availableIssues[0].id;
                        // Re-set form values with selected issue
                        setAutoFormValues({ ...mappedValues, issue_id: availableIssues[0].id });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch full manuscript details", error);
                message.error("Failed to load full manuscript details. Using summary data.", 5);

                // Fallback to local summary data if API fails
                const mappedValues = mapManuscriptToPublication(manuscript);
                setAutoFormValues(mappedValues);
                if (manuscript.journal_id) {
                    fetchIssuesByJournal(manuscript.journal_id);
                }
            }
        } else {
            setAutoFormValues(null);
        }
    };

    // Handle tab change
    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key === 'auto' && awaitingManuscripts.length === 0) {
            fetchAwaitingCopyrightManuscripts();
        }
        // Reset selected manuscript when switching tabs
        if (key === 'manual') {
            setSelectedManuscript(null);
            setAutoFormValues(null);
        }
    };

    // Reset modal state when closing
    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingPublication(null);
        setActiveTab('manual');
        setSelectedManuscript(null);
        setAutoFormValues(null);
        setIssues([]);
    };

    // Validation Schema
    const getPublicationSchema = (isEdit, currentValues) => Yup.object().shape({
        journal_id: Yup.number().required('Journal is required'),
        issue_id: Yup.number().required('Issue is required'),
        manuscript_id: Yup.string().required('Manuscript ID is required'),
        title: Yup.string().required('Title is required'),
        author_name: Yup.string().required('Author Name is required'),
        doi: Yup.string().optional(),
        pages: Yup.string().optional(),
        author_affiliations: Yup.string().optional(),
        abstract_description: Yup.string().optional(),
        abstract_keywords: Yup.string().optional(),
        pdf_file: Yup.mixed()
            .test(
                "fileType",
                "Only PDF files are allowed",
                value => !value || (value && value.type === "application/pdf")
            )
            .nullable()
            .optional()
    });

    const handleDelete = async (id) => {
        try {
            await publicationApi.delete(id);
            message.success('Publication deleted successfully');
            fetchPublications();
        } catch (error) {
            console.error("Delete error", error);
            message.error(error.response?.data?.message || 'Failed to delete publication');
        }
    };

    const handleEdit = (record) => {
        setEditingPublication(record);
        setActiveTab('manual'); // Always use manual tab for editing
        setIsModalVisible(true);
        // Pre-fetch issues if journal is already selected
        if (record.journal_id) {
            fetchIssuesByJournal(record.journal_id);
        }
    };

    const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
        console.log("Submitting values:", values);
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'manuscript_file_path') return;
            // Skip pdf_file as we handle it specifically below


            // Standard append
            if (values[key] !== null && values[key] !== undefined) {
                formData.append(key, values[key]);
            }
        });

        // Handle File Logic: New File vs Existing Manuscript File
        if (values.pdf_file) {
            // User selected a new file
            formData.append('pdf_file', values.pdf_file);
        } else if (values.manuscript_file_path && !editingPublication) {
            formData.append('pdf_file', values.manuscript_file_path);

        }

        try {
            let response;
            if (editingPublication) {
                response = await publicationApi.update(editingPublication.id, formData);
            } else {
                response = await publicationApi.create(formData);
            }

            if (response.data.success) {
                message.success(`Publication ${editingPublication ? 'updated' : 'created'} successfully`);
                handleModalClose();
                resetForm();
                fetchPublications();
            } else {
                message.error(response.data.message || `Failed to ${editingPublication ? 'update' : 'create'} publication`);
            }
        } catch (error) {
            console.error("Submission error", error);
            message.error(error.response?.data?.message || `Failed to ${editingPublication ? 'update' : 'create'} publication`);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 70,
        },
        {
            title: 'Manuscript ID',
            dataIndex: 'manuscript_id',
            key: 'manuscript_id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: 'Author',
            dataIndex: 'author_name',
            key: 'author_name',
        },
        {
            title: 'Journal',
            dataIndex: 'journal', // detailed object in response?
            key: 'journal',
            render: (journal) => journal?.title || 'N/A'
        },
        {
            title: 'Issue',
            dataIndex: 'issue',
            key: 'issue',
            render: (issue) => issue ? `Vol ${issue.volume} No ${issue.issue_no}` : 'N/A'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            icon={<FaEye />}
                            onClick={() => {
                                const encryptedId = encryptId(record.id);
                                navigate(`/dashboard/view-submitter-publications/${encryptedId}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            icon={<FaPencilAlt />}
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Publication?"
                        description="Are you sure you want to delete this publication? This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button
                                icon={<FaTrash />}
                                className="text-red-500 hover:text-red-700"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const renderPublicationForm = (initialValues) => (
        <Formik
            initialValues={initialValues}
            validationSchema={getPublicationSchema(!!editingPublication, initialValues)}
            onSubmit={handleSubmitForm}
            enableReinitialize
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {

                return (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Journal <span className="text-red-500">*</span></label>
                                    <Select
                                        placeholder="Select Journal"
                                        className="w-full"
                                        value={values.journal_id || undefined}
                                        onChange={(val) => {
                                            setFieldValue('journal_id', val);
                                            setFieldValue('issue_id', ''); // Reset issue
                                            fetchIssuesByJournal(val);
                                        }}
                                        status={touched.journal_id && errors.journal_id ? 'error' : ''}
                                    >
                                        {journals.map(j => <Option key={j.id} value={j.id}>{j.title}</Option>)}
                                    </Select>
                                    {touched.journal_id && errors.journal_id && <div className="text-red-500 text-xs mt-1">{errors.journal_id}</div>}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue <span className="text-red-500">*</span></label>
                                    <Select
                                        placeholder="Select Issue"
                                        className="w-full"
                                        value={values.issue_id || undefined}
                                        onChange={(val) => setFieldValue('issue_id', val)}
                                        status={touched.issue_id && errors.issue_id ? 'error' : ''}
                                        disabled={!values.journal_id}
                                    >
                                        {issues.map(i => (
                                            <Option key={i.id} value={i.id}>
                                                Vol {i.volume}, No {i.issue_no} ({i.year})
                                            </Option>
                                        ))}
                                    </Select>
                                    {touched.issue_id && errors.issue_id && <div className="text-red-500 text-xs mt-1">{errors.issue_id}</div>}
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Manuscript ID <span className="text-red-500">*</span></label>
                                    <Input
                                        name="manuscript_id"
                                        placeholder="e.g. MS-2024-001"
                                        value={values.manuscript_id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        status={touched.manuscript_id && errors.manuscript_id ? 'error' : ''}
                                    />
                                    {touched.manuscript_id && errors.manuscript_id && <div className="text-red-500 text-xs mt-1">{errors.manuscript_id}</div>}
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                                    <Input
                                        name="author_name"
                                        placeholder="Main Author Name"
                                        value={values.author_name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        status={touched.author_name && errors.author_name ? 'error' : ''}
                                    />
                                    {touched.author_name && errors.author_name && <div className="text-red-500 text-xs mt-1">{errors.author_name}</div>}
                                </div>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <Input
                                name="title"
                                placeholder="Publication Title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                status={touched.title && errors.title ? 'error' : ''}
                            />
                            {touched.title && errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                        </div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DOI</label>
                                    <Input
                                        name="doi"
                                        placeholder="DOI"
                                        value={values.doi}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                                    <Input
                                        name="pages"
                                        placeholder="e.g. 10-25"
                                        value={values.pages}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Affiliations</label>
                            <TextArea
                                name="author_affiliations"
                                placeholder="Author Affiliations"
                                value={values.author_affiliations}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={2}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                            <TextArea
                                name="abstract_description"
                                placeholder="Abstract description..."
                                value={values.abstract_description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={3}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                            <Input
                                name="abstract_keywords"
                                placeholder="Keywords separated by comma"
                                value={values.abstract_keywords}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                            <Upload
                                beforeUpload={(file) => {
                                    setFieldValue("pdf_file", file);
                                    return false; // Prevent automatic upload
                                }}
                                onRemove={() => setFieldValue("pdf_file", null)}
                                maxCount={1}
                                accept=".pdf"
                                fileList={values.pdf_file ? [values.pdf_file] : []}
                            >
                                <Button icon={<FaUpload />}>Select PDF File</Button>
                            </Upload>
                            {touched.pdf_file && errors.pdf_file && <div className="text-red-500 text-xs mt-1">{errors.pdf_file}</div>}

                            {/* Show existing file link if editing */}
                            {editingPublication && editingPublication.pdf_path && !values.pdf_file && (
                                <div className="mt-2 text-sm text-gray-500">
                                    Current Publication File: <a href={`${ImageURl}${editingPublication.pdf_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Existing PDF</a>
                                </div>
                            )}

                            {/* Show manuscript file link if auto-filling and no new file selected */}
                            {values.manuscript_file_path && !values.pdf_file && !editingPublication && (
                                <div className="mt-2 text-sm text-gray-500 bg-blue-50 p-2 rounded border border-blue-100">
                                    <span className="font-semibold text-blue-700">Auto-detected:</span> Using manuscript file.
                                    <a href={`${ImageURl}${values.manuscript_file_path}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline flex items-center gap-1 inline-flex">
                                        <FaFileAlt /> View Manuscript File
                                    </a>
                                    <div className="text-xs text-gray-400 mt-1">To replace, simply select a new file above.</div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button onClick={handleModalClose} type="default">Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                {editingPublication ? 'Update Publication' : 'Submit Publication'}
                            </Button>
                        </div>
                    </form>
                )
            }}
        </Formik>
    );

    // Render the Auto Publication tab content
    const renderAutoPublicationTab = () => (
        <div className="space-y-4">
            {/* Manuscript Selection Dropdown */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Manuscript (Accepted / Awaiting Copyright)
                </label>
                {loadingManuscripts ? (
                    <div className="flex items-center justify-center py-8">
                        <Spin tip="Loading manuscripts..." />
                    </div>
                ) : awaitingManuscripts.length === 0 ? (
                    <Empty
                        description="No manuscripts available for publication"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Select
                        placeholder="Choose a manuscript to auto-fill the form"
                        className="w-full"
                        size="large"
                        value={selectedManuscript?.id}
                        onChange={handleManuscriptSelect}
                        optionLabelProp="label"
                    >
                        {awaitingManuscripts.map(m => (
                            <Option
                                key={m.id}
                                value={m.id}
                                label={`${m.manuscript_id}  ${m.paper_title ? ` - ${m.paper_title}` : ''}`}
                            >
                                <div className="py-2">
                                    <div className="flex items-center gap-2">
                                        <FaFileAlt className="text-blue-500" />
                                        <span className="font-medium">{m.manuscript_id}</span>
                                        <span className="text-gray-400">|</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                            m.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                            m.status === 'Awaiting Copyright' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {m.status}
                                        </span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-600">{m.journal?.title}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 truncate">
                                        {m.paper_title}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        By: {m.submitter_name}
                                    </div>
                                </div>
                            </Option>
                        ))}
                    </Select>
                )}
            </div>

            {/* Show selected manuscript info */}
            {selectedManuscript && (
                <Alert
                    type="info"
                    showIcon
                    message={`Selected: ${selectedManuscript.manuscript_id}`}
                    description={
                        <div className="text-sm">
                            <div><strong>Title:</strong> {autoFormValues?.title || selectedManuscript.paper_title}</div>
                            <div><strong>Author:</strong> {selectedManuscript.submitter_name}</div>
                            <div><strong>Journal:</strong> {selectedManuscript.journal?.title}</div>
                        </div>
                    }
                    className="mb-4"
                />
            )}

            {/* Show form when manuscript is selected */}
            {selectedManuscript && autoFormValues && (
                <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Publication Details (Auto-filled)</h4>
                    {renderPublicationForm(autoFormValues)}
                </div>
            )}

            {/* Show hint when no manuscript selected */}
            {!selectedManuscript && awaitingManuscripts.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p>Select a manuscript from the dropdown above to auto-fill the publication form</p>
                </div>
            )}
        </div>
    );

    // Get initial values for manual tab
    const getManualInitialValues = () => ({
        journal_id: editingPublication?.journal_id || '',
        issue_id: editingPublication?.issue_id || '',
        manuscript_id: editingPublication?.manuscript_id || '',
        title: editingPublication?.title || '',
        author_name: editingPublication?.author_name || '',
        doi: editingPublication?.doi || '',
        pages: editingPublication?.pages || '',
        author_affiliations: editingPublication?.author_affiliations || '',
        abstract_description: editingPublication?.abstract_description || '',
        abstract_keywords: editingPublication?.abstract_keywords || '',
        pdf_file: null
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Submitter Publications</h1>
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={() => {
                        setEditingPublication(null);
                        setActiveTab('manual');
                        setIsModalVisible(true);
                        setIssues([]); // Reset issues on new
                    }}
                    size="large"
                >
                    Add New Publication
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <Table
                    columns={columns}
                    dataSource={publications}
                    rowKey="id"
                    loading={loading}
                    bordered
                />
            </div>

            <Modal
                title={editingPublication ? "Edit Publication" : "Add New Publication"}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
                destroyOnClose
            >
                {editingPublication ? (
                    // For editing, show only the form (no tabs)
                    renderPublicationForm(getManualInitialValues())
                ) : (
                    // For new publication, show tabs
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        items={[
                            {
                                key: 'manual',
                                label: (
                                    <span className="flex items-center gap-2">
                                        <FaPencilAlt />
                                        Manual Publication
                                    </span>
                                ),
                                children: renderPublicationForm(getManualInitialValues())
                            },
                            {
                                key: 'auto',
                                label: (
                                    <span className="flex items-center gap-2">
                                        <FaFileAlt />
                                        Auto Publication
                                    </span>
                                ),
                                children: renderAutoPublicationTab()
                            }
                        ]}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ViewSubmitterPublications;
