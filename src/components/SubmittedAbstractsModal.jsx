import React, { useState } from 'react';
import { Modal, Table, Tag, Button, Space, Select, Input, message, Tooltip, Popconfirm, Divider, Timeline, Descriptions, Card } from 'antd';
import { FaDownload, FaUserEdit, FaCheck, FaTimes, FaFilePdf, FaUser, FaCalendarAlt, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import { FileTextOutlined, UserOutlined, CommentOutlined, PaperClipOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SyncOutlined, InfoCircleOutlined, ReloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { ImageURl } from '../services/serviceApi';
import { fullPaperCopyrightApi } from '../services/api';
import FormRenderer from './DynamicForm/FormRenderer';
import { useReactToPrint } from 'react-to-print';
import {
    useAbstractsQuery,
    useGeneralEditorsQuery,
    useConferenceEditorsQuery,
    useAssignEditorMutation,
    useAssignConferenceEditorMutation,
    useAdminDecisionMutation
} from '../hooks/useAbstractsQuery';
import moment from 'moment';

const { TextArea } = Input;

const STATUS_COLORS = {
    'Submitted': 'orange',
    'Assigned to Editor': 'blue',
    'Reviewed by Editor': 'geekblue',
    'Assigned to Conference Editor': 'purple',
    'Reviewed by Conference Editor': 'cyan',
    'Accepted': 'green',
    'Rejected': 'red',
};

// Status stages for timeline (simplified - conference editor acceptance is final)
const STATUS_STAGES = [
    { key: 'Submitted', label: 'Submitted', icon: <FileTextOutlined /> },
    { key: 'Assigned to Editor', label: 'Assigned to Editor', icon: <UserOutlined /> },
    { key: 'Reviewed by Editor', label: 'Reviewed by Editor', icon: <CheckCircleOutlined /> },
    { key: 'Assigned to Conference Editor', label: 'Assigned to Conf. Editor', icon: <UserOutlined /> },
    { key: 'Accepted', label: 'Accepted (Final)', icon: <CheckCircleOutlined /> },
];

const SubmittedAbstractsModal = ({ open, onCancel, conferenceId, conferenceName }) => {
    // React Query hooks for real-time polling
    const {
        data: abstracts = [],
        isLoading: loading,
        refetch: refetchAbstracts,
        isFetching
    } = useAbstractsQuery(conferenceId, open);

    // Stage 1: General editors (not linked to any conference)
    const { data: generalEditors = [] } = useGeneralEditorsQuery(open);
    // Stage 2: Conference-specific editors (linked to this conference)
    const { data: conferenceEditors = [] } = useConferenceEditorsQuery(conferenceId, open);

    // Mutation hooks
    const assignEditorMutation = useAssignEditorMutation(conferenceId);
    const assignConfEditorMutation = useAssignConferenceEditorMutation(conferenceId);
    const adminDecisionMutation = useAdminDecisionMutation(conferenceId);

    // Local UI state
    const [selectedEditor, setSelectedEditor] = useState({});
    const [selectedConfEditor, setSelectedConfEditor] = useState({});
    const [finalDecisionModal, setFinalDecisionModal] = useState({ open: false, abstractId: null, action: null, record: null });
    const [adminComment, setAdminComment] = useState('');
    const [adminCommentError, setAdminCommentError] = useState('');
    const [detailModal, setDetailModal] = useState({ open: false, record: null });
    const [copyrightModal, setCopyrightModal] = useState({ open: false, data: null, loading: false });
    const copyrightPrintRef = React.useRef(null);

    // Stage 1: Assign Editor
    const handleAssignEditor = async (abstractId) => {
        const editorId = selectedEditor[abstractId];
        if (!editorId) {
            message.warning('Please select an editor first');
            return;
        }
        try {
            const data = await assignEditorMutation.mutateAsync({ abstractId, editorId });
            if (data && data.success) {
                message.success(data.message || 'Abstract assigned to editor successfully');
            }
            setSelectedEditor((prev) => {
                const updated = { ...prev };
                delete updated[abstractId];
                return updated;
            });
        } catch (error) {
            console.error('Error assigning editor:', error);
            message.error(error?.response?.data?.message || 'Failed to assign editor');
        }
    };

    // Stage 2: Assign Conference Editor
    const handleAssignConferenceEditor = async (abstractId) => {
        const editorId = selectedConfEditor[abstractId];
        if (!editorId) {
            message.warning('Please select a conference editor first');
            return;
        }
        try {
            const data = await assignConfEditorMutation.mutateAsync({ abstractId, editorId });
            if (data && data.success) {
                message.success(data.message || 'Abstract assigned to conference editor successfully');
            }
            setSelectedConfEditor((prev) => {
                const updated = { ...prev };
                delete updated[abstractId];
                return updated;
            });
        } catch (error) {
            console.error('Error assigning conference editor:', error);
            message.error(error?.response?.data?.message || 'Failed to assign conference editor');
        }
    };

    // Stage 3: Final Admin Decision
    const openFinalDecisionModal = (abstractId, action, record) => {
        setFinalDecisionModal({ open: true, abstractId, action, record });
        setAdminComment('');
        setAdminCommentError('');
    };

    const closeFinalDecisionModal = () => {
        setFinalDecisionModal({ open: false, abstractId: null, action: null, record: null });
        setAdminComment('');
        setAdminCommentError('');
    };

    const handleFinalDecision = async () => {
        const { abstractId, action } = finalDecisionModal;
        if (action === 'reject' && !adminComment.trim()) {
            setAdminCommentError('Comment is mandatory for rejection.');
            return;
        }
        setAdminCommentError('');

        try {
            const data = await adminDecisionMutation.mutateAsync({ abstractId, action, comment: adminComment });
            if (data && data.success) {
                message.success(data.message || `Abstract ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
            }
            closeFinalDecisionModal();
        } catch (error) {
            console.error('Error with final decision:', error);
            message.error(error?.response?.data?.message || 'Failed to process decision');
        }
    };

    // Stage 1: General editors options (not linked to any conference)
    const generalEditorOptions = generalEditors.map((editor) => ({
        value: editor.id,
        label: `${editor.name} (${editor.specialization || 'N/A'})`,
    }));

    // Stage 2: Conference-specific editor options
    const conferenceEditorOptions = conferenceEditors.map((editor) => ({
        value: editor.id,
        label: `${editor.name} - ${editor.role}${editor.is_primary ? ' ★' : ''} (${editor.specialization || 'N/A'})`,
    }));

    const renderComments = (record) => {
        const comments = [];
        if (record.editor_comment) {
            comments.push({ label: 'Editor', name: record.assigned_editor?.name, text: record.editor_comment, color: 'blue' });
        }
        if (record.conference_editor_comment) {
            comments.push({ label: 'Conf. Editor', name: record.assigned_conference_editor?.name, text: record.conference_editor_comment, color: 'purple' });
        }
        if (record.admin_final_comment) {
            comments.push({ label: 'Admin', name: 'Admin', text: record.admin_final_comment, color: 'orange' });
        }

        if (comments.length === 0) return null;

        return (
            <div className="space-y-1 mt-1">
                {comments.map((c, i) => (
                    <div key={i} className="text-xs">
                        <CommentOutlined className={`mr-1 text-${c.color}-500`} />
                        <span className="font-medium">{c.label}:</span>{' '}
                        <span className="text-gray-500 truncate inline-block max-w-[100px] align-bottom">
                            {c.text}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    // Render the admin action column based on abstract status
    const renderAdminAction = (record) => {
        const { status } = record;

        // Rejected or Final Accepted: No action
        if (status === 'Rejected') {
            return <span className="text-red-500 text-xs font-medium">Rejected</span>;
        }
        if (status === 'Accepted') {
            return <span className="text-green-600 text-xs font-medium">Accepted (Final)</span>;
        }

        // Stage 1: Submitted → Assign Editor
        if (status === 'Submitted') {
            return (
                <Space direction="vertical" size="small" className="w-full">
                    <Select
                        placeholder="Select Editor"
                        className="w-full"
                        size="small"
                        value={selectedEditor[record.id] || undefined}
                        onChange={(value) => setSelectedEditor((prev) => ({ ...prev, [record.id]: value }))}
                        options={generalEditorOptions}
                        allowClear
                    />
                    <Popconfirm
                        title="Assign Editor"
                        description="Assign this abstract to the selected editor?"
                        onConfirm={() => handleAssignEditor(record.id)}
                        okText="Yes"
                        cancelText="No"
                        disabled={!selectedEditor[record.id]}
                    >
                        <Button
                            type="primary"
                            size="small"
                            icon={<FaUserEdit />}
                            loading={assignEditorMutation.isPending}
                            disabled={!selectedEditor[record.id]}
                            className="bg-[#12b48b] hover:bg-[#0e9a77] border-none"
                        >
                            Assign Editor
                        </Button>
                    </Popconfirm>
                </Space>
            );
        }

        // Waiting: Assigned to Editor
        if (status === 'Assigned to Editor') {
            return (
                <span className="text-blue-600 text-xs font-medium">
                    Awaiting Editor Review
                    <div className="text-gray-500 mt-1">Editor: {record.assigned_editor?.name}</div>
                </span>
            );
        }

        // Stage 2: Reviewed by Editor → Assign Conference Editor
        if (status === 'Reviewed by Editor') {
            return (
                <Space direction="vertical" size="small" className="w-full">
                    <Select
                        placeholder="Select Conference Editor"
                        className="w-full"
                        size="small"
                        value={selectedConfEditor[record.id] || undefined}
                        onChange={(value) => setSelectedConfEditor((prev) => ({ ...prev, [record.id]: value }))}
                        options={conferenceEditorOptions}
                        allowClear
                    />
                    <Popconfirm
                        title="Assign Conference Editor"
                        description="Assign this abstract to the selected conference editor?"
                        onConfirm={() => handleAssignConferenceEditor(record.id)}
                        okText="Yes"
                        cancelText="No"
                        disabled={!selectedConfEditor[record.id]}
                    >
                        <Button
                            type="primary"
                            size="small"
                            icon={<FaUserEdit />}
                            loading={assignConfEditorMutation.isPending}
                            disabled={!selectedConfEditor[record.id]}
                            className="bg-purple-600 hover:bg-purple-700 border-none"
                        >
                            Assign Conf. Editor
                        </Button>
                    </Popconfirm>
                </Space>
            );
        }

        // Waiting: Assigned to Conference Editor
        if (status === 'Assigned to Conference Editor') {
            return (
                <span className="text-purple-600 text-xs font-medium">
                    Awaiting Conf. Editor Review
                    <div className="text-gray-500 mt-1">Conf. Editor: {record.assigned_conference_editor?.name}</div>
                </span>
            );
        }

        // Note: 'Reviewed by Conference Editor' status is no longer used
        // Conference editor acceptance now directly sets status to 'Accepted'

        return null;
    };

    // Detail Modal Functions
    const openDetailModal = (record) => {
        setDetailModal({ open: true, record });
    };

    const closeDetailModal = () => {
        setDetailModal({ open: false, record: null });
    };

    // Copyright Modal Functions
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

    // Get current stage index for timeline
    const getStageIndex = (status) => {
        if (status === 'Rejected') return -1;
        return STATUS_STAGES.findIndex(s => s.key === status);
    };

    // Helper to render decision badge
    const renderDecisionBadge = (decision) => {
        if (!decision) return null;
        const isAccepted = decision === 'accepted';
        return (
            <Tag
                color={isAccepted ? 'success' : 'error'}
                className="ml-2 text-xs"
                style={{ fontSize: '10px', padding: '0 4px', lineHeight: '16px' }}
            >
                {isAccepted ? 'ACCEPTED' : 'REJECTED'}
            </Tag>
        );
    };

    // Helper to format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;
        return moment(timestamp).format('DD MMM YYYY, hh:mm A');
    };

    // Render timeline for abstract status progress
    const renderStatusTimeline = (record) => {
        const isRejected = record.status === 'Rejected';
        const statusTimestamps = record.status_timestamps || {};

        // Determine if conference editor step was skipped
        // This happens when: status is 'Accepted' AND no conference editor was ever assigned
        const wasConfEditorSkipped = record.status === 'Accepted' && !record.assigned_conference_editor;

        // Filter STATUS_STAGES based on whether conference editor step was skipped
        const effectiveStages = wasConfEditorSkipped
            ? STATUS_STAGES.filter(stage => stage.key !== 'Assigned to Conference Editor')
            : STATUS_STAGES;

        // Get current stage index from the effective stages array
        const currentIndex = effectiveStages.findIndex(s => s.key === record.status);

        // Statuses where current step is complete and waiting for next assignment
        const completionStatuses = ['Submitted', 'Reviewed by Editor', 'Reviewed by Conference Editor', 'Accepted'];
        // Statuses where someone is assigned and we're waiting for their action
        const waitingForActionStatuses = ['Assigned to Editor', 'Assigned to Conference Editor'];

        const timelineItems = effectiveStages.map((stage, index) => {
            let color = 'gray';
            let dot = <ClockCircleOutlined style={{ fontSize: 16, color: '#9ca3af' }} />;

            if (isRejected) {
                // For rejected: show completed stages before rejection
                if (index < currentIndex) {
                    color = 'green';
                    dot = <CheckCircleOutlined style={{ fontSize: 16, color: '#22c55e' }} />;
                } else if (index === currentIndex) {
                    // The stage where rejection happened - show as waiting (it was in progress)
                    color = 'orange';
                    dot = <ClockCircleOutlined style={{ fontSize: 16, color: '#f97316' }} />;
                }
            } else if (index < currentIndex) {
                // Completed stages
                color = 'green';
                dot = <CheckCircleOutlined style={{ fontSize: 16, color: '#22c55e' }} />;
            } else if (index === currentIndex) {
                // Current stage
                if (completionStatuses.includes(record.status)) {
                    // Current step is complete (green check)
                    color = 'green';
                    dot = <CheckCircleOutlined style={{ fontSize: 16, color: '#22c55e' }} />;
                } else if (waitingForActionStatuses.includes(record.status)) {
                    // Assigned but waiting for reviewer action (clock/waiting)
                    color = 'orange';
                    dot = <ClockCircleOutlined style={{ fontSize: 16, color: '#f97316' }} />;
                }
            } else if (index === currentIndex + 1 && completionStatuses.includes(record.status) && record.status !== 'Accepted') {
                // Next step that needs to be initiated (blue spinner)
                color = 'blue';
                dot = <SyncOutlined spin style={{ fontSize: 16, color: '#3b82f6' }} />;
            }

            // Build content for each stage
            let content = null;
            let decisionBadge = null;
            let timestamp = null;

            // Stage 0: Submitted
            if (index === 0) {
                timestamp = record.createdAt;
                content = (
                    <div className="text-xs text-gray-500 mt-1">
                        <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                        {formatTimestamp(timestamp)}
                    </div>
                );
            }

            // Stage 1: Assigned to Editor
            if (index === 1 && record.assigned_editor) {
                timestamp = record.assigned_editor.assigned_at || statusTimestamps['Assigned to Editor'];
                content = (
                    <div className="text-xs text-gray-600 mt-1">
                        <div><span className="font-medium">Editor:</span> {record.assigned_editor.name}</div>
                        {timestamp && (
                            <div className="text-gray-500 mt-0.5">
                                <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                                {formatTimestamp(timestamp)}
                            </div>
                        )}
                    </div>
                );
            }

            // Stage 2: Reviewed by Editor
            if (index === 2 && (record.editor_comment || record.editor_decision)) {
                decisionBadge = renderDecisionBadge(record.editor_decision);
                timestamp = record.editor_reviewed_at || statusTimestamps['Reviewed by Editor'];
                content = (
                    <div className="mt-1">
                        {timestamp && (
                            <div className="text-xs text-gray-500 mb-1">
                                <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                                {formatTimestamp(timestamp)}
                            </div>
                        )}
                        {record.editor_comment && (
                            <div className="p-2 bg-blue-50 rounded border border-blue-100 text-xs">
                                <div className="font-medium text-blue-700 mb-1">
                                    <CommentOutlined className="mr-1" />
                                    Editor Comment:
                                </div>
                                <div className="text-gray-700">{record.editor_comment}</div>
                            </div>
                        )}
                    </div>
                );
            }

            // Stage 3: Assigned to Conference Editor
            if (index === 3 && record.assigned_conference_editor) {
                timestamp = record.assigned_conference_editor.assigned_at || statusTimestamps['Assigned to Conference Editor'];
                content = (
                    <div className="text-xs text-gray-600 mt-1">
                        <div><span className="font-medium">Conf. Editor:</span> {record.assigned_conference_editor.name}</div>
                        {timestamp && (
                            <div className="text-gray-500 mt-0.5">
                                <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                                {formatTimestamp(timestamp)}
                            </div>
                        )}
                    </div>
                );
            }

            // Stage 4: Reviewed by Conference Editor
            if (index === 4 && (record.conference_editor_comment || record.conference_editor_decision)) {
                decisionBadge = renderDecisionBadge(record.conference_editor_decision);
                timestamp = record.conference_editor_reviewed_at || statusTimestamps['Reviewed by Conference Editor'];
                content = (
                    <div className="mt-1">
                        {timestamp && (
                            <div className="text-xs text-gray-500 mb-1">
                                <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                                {formatTimestamp(timestamp)}
                            </div>
                        )}
                        {record.conference_editor_comment && (
                            <div className="p-2 bg-purple-50 rounded border border-purple-100 text-xs">
                                <div className="font-medium text-purple-700 mb-1">
                                    <CommentOutlined className="mr-1" />
                                    Conference Editor Comment:
                                </div>
                                <div className="text-gray-700">{record.conference_editor_comment}</div>
                            </div>
                        )}
                    </div>
                );
            }

            // Stage 5: Accepted (Admin Final Decision)
            if (index === 5 && (record.admin_final_comment || record.admin_decision)) {
                decisionBadge = renderDecisionBadge(record.admin_decision);
                timestamp = record.admin_reviewed_at || statusTimestamps['Accepted'];
                content = (
                    <div className="mt-1">
                        {timestamp && (
                            <div className="text-xs text-gray-500 mb-1">
                                <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                                {formatTimestamp(timestamp)}
                            </div>
                        )}
                        {record.admin_final_comment && (
                            <div className="p-2 bg-green-50 rounded border border-green-100 text-xs">
                                <div className="font-medium text-green-700 mb-1">
                                    <CommentOutlined className="mr-1" />
                                    Admin Final Comment:
                                </div>
                                <div className="text-gray-700">{record.admin_final_comment}</div>
                            </div>
                        )}
                    </div>
                );
            }

            // Determine text styling based on stage state
            let textClass = 'text-gray-400'; // Default for future stages
            if (isRejected) {
                if (index <= currentIndex) textClass = 'text-gray-800';
            } else if (index < currentIndex) {
                textClass = 'text-gray-800'; // Completed
            } else if (index === currentIndex) {
                textClass = 'text-gray-800'; // Current (whether complete or waiting)
            } else if (index === currentIndex + 1 && completionStatuses.includes(record.status) && record.status !== 'Accepted') {
                textClass = 'text-blue-600'; // Next step needing action
            }

            return {
                color,
                dot,
                children: (
                    <div className="pb-2">
                        <div className={`font-medium ${textClass} flex items-center flex-wrap`}>
                            {stage.label}
                            {decisionBadge}
                        </div>
                        {content}
                    </div>
                ),
            };
        });

        // Add rejection item if rejected
        if (isRejected) {
            // Find at which stage it was rejected based on decisions
            let rejectionComment = null;
            let rejectedBy = 'Admin';
            let rejectionTimestamp = null;

            // Check who rejected it based on the decision field
            if (record.admin_decision === 'rejected') {
                rejectionComment = record.admin_final_comment;
                rejectedBy = 'Admin';
                rejectionTimestamp = record.admin_reviewed_at;
            } else if (record.conference_editor_decision === 'rejected') {
                rejectionComment = record.conference_editor_comment;
                rejectedBy = record.assigned_conference_editor?.name || 'Conference Editor';
                rejectionTimestamp = record.conference_editor_reviewed_at;
            } else if (record.editor_decision === 'rejected') {
                rejectionComment = record.editor_comment;
                rejectedBy = record.assigned_editor?.name || 'Editor';
                rejectionTimestamp = record.editor_reviewed_at;
            } else {
                // Fallback to old logic if decisions not available
                rejectionComment = record.admin_final_comment || record.conference_editor_comment || record.editor_comment;
                if (record.conference_editor_comment && !record.admin_final_comment) {
                    rejectedBy = record.assigned_conference_editor?.name || 'Conference Editor';
                } else if (record.editor_comment && !record.conference_editor_comment) {
                    rejectedBy = record.assigned_editor?.name || 'Editor';
                }
            }

            // Get rejection timestamp from status history if not found
            if (!rejectionTimestamp && statusTimestamps['Rejected']) {
                rejectionTimestamp = statusTimestamps['Rejected'];
            }

            timelineItems.push({
                color: 'red',
                dot: <CloseCircleOutlined style={{ fontSize: 16, color: '#ef4444' }} />,
                children: (
                    <div className="pb-2">
                        <div className="font-medium text-red-600">Rejected</div>
                        {rejectionTimestamp && (
                            <div className="text-xs text-gray-500 mt-1">
                                <FaCalendarAlt className="inline mr-1" style={{ fontSize: '10px' }} />
                                {formatTimestamp(rejectionTimestamp)}
                            </div>
                        )}
                        {rejectionComment && (
                            <div className="mt-1 p-2 bg-red-50 rounded border border-red-100 text-xs">
                                <div className="font-medium text-red-700 mb-1">
                                    <CommentOutlined className="mr-1" />
                                    Rejection Reason ({rejectedBy}):
                                </div>
                                <div className="text-gray-700">{rejectionComment}</div>
                            </div>
                        )}
                    </div>
                ),
            });
        }

        return <Timeline items={timelineItems} />;
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 40,
            render: (_, __, index) => (
                <span className="text-gray-600 font-mono text-xs">#{index + 1}</span>
            ),
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            width: 130,
            render: (author) => {
                if (author && author.firstName && author.lastName) {
                    return <span className="font-medium">{`${author.firstName} ${author.lastName}`}</span>;
                }
                return <span className="text-gray-400">N/A</span>;
            },
        },
        {
            title: 'Abstract File',
            dataIndex: 'abstract_file',
            key: 'abstract_file',
            width: 100,
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
            width: 140,
            render: (date) => moment(date).format('DD MMM YYYY, hh:mm A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (status, record) => (
                <div
                    onClick={() => openDetailModal(record)}
                    className="cursor-pointer hover:bg-blue-50 -m-2 p-2 rounded transition-colors"
                >
                    <Tag color={STATUS_COLORS[status] || 'default'}>
                        {status ? status.toUpperCase() : 'SUBMITTED'}
                    </Tag>
                    {record.assigned_editor && (
                        <div className="text-xs text-gray-500 mt-1">
                            <UserOutlined className="mr-1" />
                            Editor: {record.assigned_editor.name}
                        </div>
                    )}
                    {record.assigned_conference_editor && (
                        <div className="text-xs text-purple-500 mt-1">
                            <UserOutlined className="mr-1" />
                            Conf. Editor: {record.assigned_conference_editor.name}
                        </div>
                    )}
                    {renderComments(record)}
                </div>
            ),
        },
        {
            title: 'Full Paper',
            key: 'full_paper',
            width: 160,
            render: (_, record) => {
                const files = record.full_paper_files;
                if (!files || files.length === 0) {
                    if (record.status === 'Accepted') {
                        return <span className="text-orange-500 text-xs font-medium">Awaiting Submission</span>;
                    }
                    return <span className="text-gray-400 text-xs">N/A</span>;
                }
                return (
                    <div className="space-y-1">
                        {files.map((f) => (
                            <Tooltip key={f.id} title={`Uploaded by ${f.uploaded_by?.firstName} ${f.uploaded_by?.lastName} on ${new Date(f.uploaded_at).toLocaleDateString()}`}>
                                <a
                                    href={`${ImageURl}${f.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                >
                                    <PaperClipOutlined />
                                    <span className="truncate max-w-[100px]">{f.file_name}</span>
                                </a>
                            </Tooltip>
                        ))}
                    </div>
                );
            },
        },
        {
            title: 'Copyright',
            key: 'copyright',
            width: 120,
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
                if (record.status === 'Accepted') {
                    return <Tag color="warning" className="text-xs">Pending</Tag>;
                }
                return <span className="text-gray-400 text-xs">N/A</span>;
            },
        },
        {
            title: 'Admin Action',
            key: 'action',
            width: 230,
            render: (_, record) => renderAdminAction(record),
        },
    ];

    const handleClose = () => {
        setSelectedEditor({});
        setSelectedConfEditor({});
        onCancel();
    };

    return (
        <>
            <Modal
                title={
                    <div className="flex items-center justify-between w-full pr-8">
                        <div className="flex items-center gap-2">
                            <FileTextOutlined className="text-[#12b48b]" />
                            <span>Submitted Abstracts {conferenceName ? `- ${conferenceName}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Tooltip title="Auto-refreshing every 5 seconds">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <SyncOutlined spin={isFetching} className={isFetching ? 'text-blue-500' : 'text-gray-400'} />
                                    <span>Live</span>
                                </div>
                            </Tooltip>
                            <Tooltip title="Refresh now">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<ReloadOutlined spin={isFetching} />}
                                    onClick={() => refetchAbstracts()}
                                    className="text-gray-500 hover:text-blue-500"
                                />
                            </Tooltip>
                        </div>
                    </div>
                }
                open={open}
                onCancel={handleClose}
                footer={<Button onClick={handleClose}>Close</Button>}
                width={1400}
                centered
                destroyOnClose
                styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
            >
                <Table
                    columns={columns}
                    dataSource={abstracts}
                    rowKey="id"
                    loading={loading && !abstracts.length}
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: 'No abstract submissions found for this conference' }}
                    size="small"
                    scroll={{ x: 1320 }}
                />
            </Modal>

            {/* Admin Final Decision Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {finalDecisionModal.action === 'accept' ? (
                            <FaCheck className="text-green-600" />
                        ) : (
                            <FaTimes className="text-red-500" />
                        )}
                        <span>
                            {finalDecisionModal.action === 'accept' ? 'Final Accept' : 'Final Reject'} Abstract
                        </span>
                    </div>
                }
                open={finalDecisionModal.open}
                onCancel={closeFinalDecisionModal}
                footer={null}
                destroyOnClose
                centered
                width={600}
                zIndex={1100}
            >
                <div className="py-2">
                    {finalDecisionModal.record?.title && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Abstract Title</span>
                            <span className="font-medium text-gray-800">{finalDecisionModal.record.title}</span>
                        </div>
                    )}

                    {/* Show Editor Comment */}
                    {finalDecisionModal.record?.editor_comment && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-xs text-blue-600 font-medium block mb-1">
                                <CommentOutlined className="mr-1" />
                                Editor Comment ({finalDecisionModal.record.assigned_editor?.name})
                            </span>
                            <span className="text-gray-700 text-sm">{finalDecisionModal.record.editor_comment}</span>
                        </div>
                    )}

                    {/* Show Conference Editor Comment */}
                    {finalDecisionModal.record?.conference_editor_comment && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <span className="text-xs text-purple-600 font-medium block mb-1">
                                <CommentOutlined className="mr-1" />
                                Conference Editor Comment ({finalDecisionModal.record.assigned_conference_editor?.name})
                            </span>
                            <span className="text-gray-700 text-sm">{finalDecisionModal.record.conference_editor_comment}</span>
                        </div>
                    )}

                    <div className="mb-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Comment {finalDecisionModal.action === 'reject' && <span className="text-red-500">*</span>}
                        </label>
                        <TextArea
                            rows={4}
                            value={adminComment}
                            onChange={(e) => {
                                setAdminComment(e.target.value);
                                if (e.target.value.trim()) setAdminCommentError('');
                            }}
                            placeholder={
                                finalDecisionModal.action === 'accept'
                                    ? 'Enter your comment (optional)...'
                                    : 'Enter rejection reason (mandatory)...'
                            }
                            status={adminCommentError ? 'error' : ''}
                            maxLength={1000}
                            showCount
                        />
                        {adminCommentError && (
                            <div className="text-red-500 text-xs mt-1">{adminCommentError}</div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={closeFinalDecisionModal}>Cancel</Button>
                        {finalDecisionModal.action === 'accept' ? (
                            <Button
                                type="primary"
                                onClick={handleFinalDecision}
                                loading={adminDecisionMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 border-none"
                            >
                                Final Accept
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                danger
                                onClick={handleFinalDecision}
                                loading={adminDecisionMutation.isPending}
                            >
                                Final Reject
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Abstract Detail Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <InfoCircleOutlined className="text-[#12b48b]" />
                        <span>Abstract Details</span>
                    </div>
                }
                open={detailModal.open}
                onCancel={closeDetailModal}
                footer={<Button onClick={closeDetailModal}>Close</Button>}
                width={900}
                centered
                destroyOnClose
                zIndex={1100}
                styles={{ body: { maxHeight: '75vh', overflowY: 'auto' } }}
            >
                {detailModal.record && (
                    <div className="py-2">
                        {/* Header Section with Status Badge */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {detailModal.record.title || ''}
                                </h3>
                                <Tag color={STATUS_COLORS[detailModal.record.status] || 'default'} className="text-sm px-3 py-1">
                                    {detailModal.record.status?.toUpperCase() || 'SUBMITTED'}
                                </Tag>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                                <div>Abstract ID: #{detailModal.record.id}</div>
                            </div>
                        </div>

                        <Divider className="my-4" />

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Abstract Info */}
                            <div>
                                <Card
                                    title={
                                        <span className="flex items-center gap-2 text-sm">
                                            <FaClipboardList className="text-[#12b48b]" />
                                            Abstract Information
                                        </span>
                                    }
                                    size="small"
                                    className="shadow-sm"
                                >
                                    <Descriptions column={1} size="small" className="text-sm">
                                        <Descriptions.Item label={<span className="font-medium text-gray-600">Conference</span>}>
                                            <span className="text-gray-800">{detailModal.record.conference?.name || 'N/A'}</span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className="font-medium text-gray-600">Author</span>}>
                                            <span className="text-gray-800 flex items-center gap-1">
                                                <FaUser className="text-gray-400" />
                                                {detailModal.record.author?.firstName} {detailModal.record.author?.lastName}
                                            </span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className="font-medium text-gray-600">Email</span>}>
                                            <a href={`mailto:${detailModal.record.author?.email}`} className="text-blue-600 hover:underline">
                                                {detailModal.record.author?.email}
                                            </a>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className="font-medium text-gray-600">Submitted On</span>}>
                                            <span className="text-gray-800 flex items-center gap-1">
                                                <FaCalendarAlt className="text-gray-400" />
                                                {moment(detailModal.record.createdAt).format('DD MMM YYYY, hh:mm A')}
                                            </span>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<span className="font-medium text-gray-600">Abstract File</span>}>
                                            {detailModal.record.abstract_file ? (
                                                <a
                                                    href={`${ImageURl}${detailModal.record.abstract_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                >
                                                    <FaFileAlt />
                                                    Download Abstract
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No file</span>
                                            )}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>

                                {/* Full Paper Files Section */}
                                <Card
                                    title={
                                        <span className="flex items-center gap-2 text-sm">
                                            <PaperClipOutlined className="text-purple-600" />
                                            Full Paper Files
                                        </span>
                                    }
                                    size="small"
                                    className="shadow-sm mt-4"
                                >
                                    {detailModal.record.full_paper_files && detailModal.record.full_paper_files.length > 0 ? (
                                        <div className="space-y-2">
                                            {detailModal.record.full_paper_files.map((file) => (
                                                <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                                    <div className="flex items-center gap-2">
                                                        <FaFilePdf className="text-red-500" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-800">{file.file_name}</div>
                                                            <div className="text-xs text-gray-500">
                                                                Uploaded by {file.uploaded_by?.firstName} {file.uploaded_by?.lastName} on {moment(file.uploaded_at).format('DD MMM YYYY')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={`${ImageURl}${file.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                                    >
                                                        <FaDownload /> Download
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-400">
                                            {detailModal.record.status === 'Accepted' ? (
                                                <span className="text-orange-500">Awaiting full paper submission</span>
                                            ) : (
                                                <span>Full paper not yet required</span>
                                            )}
                                        </div>
                                    )}
                                </Card>

                                {/* Assigned Reviewers */}
                                <Card
                                    title={
                                        <span className="flex items-center gap-2 text-sm">
                                            <UserOutlined className="text-blue-600" />
                                            Assigned Reviewers
                                        </span>
                                    }
                                    size="small"
                                    className="shadow-sm mt-4"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Editor:</span>
                                            {detailModal.record.assigned_editor ? (
                                                <Tag color="blue">{detailModal.record.assigned_editor.name}</Tag>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not assigned</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 text-sm">Conference Editor:</span>
                                            {detailModal.record.assigned_conference_editor ? (
                                                <Tag color="purple">{detailModal.record.assigned_conference_editor.name}</Tag>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Not assigned</span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column - Status Timeline */}
                            <div>
                                <Card
                                    title={
                                        <span className="flex items-center gap-2 text-sm">

                                            Review Progress & Comments
                                        </span>
                                    }
                                    size="small"
                                    className="shadow-sm h-full"
                                >
                                    <div className="pt-2">
                                        {renderStatusTimeline(detailModal.record)}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

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
                destroyOnClose
                zIndex={1100}
                styles={{ body: { overflowY: 'auto', padding: '24px' } }}
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
        </>
    );
};

export default SubmittedAbstractsModal;
