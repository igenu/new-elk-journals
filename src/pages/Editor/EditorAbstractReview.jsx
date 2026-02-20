import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Input, message, Tooltip, Breadcrumb, Divider } from 'antd';
import { FaDownload, FaCheck, FaTimes } from 'react-icons/fa';
import { HomeOutlined, FileTextOutlined, UserOutlined, CommentOutlined, InfoCircleOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import { ImageURl } from '../../services/serviceApi';
import { useEditorAssignedAbstractsQuery, useEditorReviewMutation } from '../../hooks/useAbstractsQuery';
import moment from 'moment';

const { TextArea } = Input;

const EditorAbstractReview = () => {
    // React Query hooks for real-time polling
    const {
        data: abstracts = [],
        isLoading: loading,
        refetch: refetchAbstracts,
        isFetching
    } = useEditorAssignedAbstractsQuery();

    // Mutation hook for review actions
    const editorReviewMutation = useEditorReviewMutation();

    // Local UI state
    const [reviewModal, setReviewModal] = useState({ open: false, abstractId: null, action: null, title: '', record: null });
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const [detailModal, setDetailModal] = useState({ open: false, record: null });

    const openReviewModal = (abstractId, action, title, record) => {
        setReviewModal({ open: true, abstractId, action, title, record });
        setComment('');
        setCommentError('');
    };

    const closeReviewModal = () => {
        setReviewModal({ open: false, abstractId: null, action: null, title: '', record: null });
        setComment('');
        setCommentError('');
    };

    const handleReviewSubmit = async () => {
        if (!comment.trim()) {
            setCommentError('Comment is mandatory. Please provide your review comment.');
            return;
        }
        setCommentError('');

        const { abstractId, action } = reviewModal;

        try {
            const data = await editorReviewMutation.mutateAsync({ abstractId, action, comment });
            if (data && data.success) {
                message.success(data.message || `Abstract ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
            }
            closeReviewModal();
        } catch (error) {
            console.error('Error reviewing abstract:', error);
            message.error(error?.response?.data?.message || 'Failed to submit review');
        }
    };

    const getStatusTag = (status) => {
        const colorMap = {
            'Assigned to Editor': 'blue',
            'Reviewed by Editor': 'green',
            'Assigned to Conference Editor': 'purple',
            'Reviewed by Conference Editor': 'cyan',
            'Accepted': 'green',
            'Rejected': 'red',
        };
        return (
            <Tag color={colorMap[status] || 'default'}>
                {status ? status.toUpperCase() : 'UNKNOWN'}
            </Tag>
        );
    };

    const getRoleLabel = (record) => {
        if (record.status === 'Assigned to Conference Editor' || record.status === 'Reviewed by Conference Editor') {
            return 'Conference Editor';
        }
        return 'Editor';
    };

    // Detail Modal Functions
    const openDetailModal = (record) => {
        setDetailModal({ open: true, record });
    };

    const closeDetailModal = () => {
        setDetailModal({ open: false, record: null });
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
            width: 90,
            render: (id) => <span className="font-mono text-xs text-gray-500">ABS-{String(id).padStart(3, '0')}</span>,
        },
        {
            title: 'Conference',
            dataIndex: ['conference', 'name'],
            key: 'conference',
            width: 200,
            render: (text) => <span className="font-medium text-[#12b48b]">{text || 'N/A'}</span>,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            width: 150,
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
        // {
        //     title: 'Assigned By',
        //     dataIndex: 'assigned_by',
        //     key: 'assigned_by',
        //     width: 130,
        //     render: (_, record) => {
        //         const assignedBy = record.status === 'Assigned to Conference Editor' || record.status === 'Reviewed by Conference Editor'
        //             ? record.conference_editor_assigned_by
        //             : record.assigned_by;
        //         return (
        //             <span className="text-gray-600">
        //                 <UserOutlined className="mr-1" />
        //                 {assignedBy?.name || 'N/A'}
        //             </span>
        //         );
        //     },
        // },
        // {
        //     title: 'Your Role',
        //     key: 'role',
        //     width: 140,
        //     render: (_, record) => {
        //         const role = getRoleLabel(record);
        //         return (
        //             <Tag color={role === 'Conference Editor' ? 'purple' : 'blue'}>
        //                 {role}
        //             </Tag>
        //         );
        //     },
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 180,
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Previous Comments',
            key: 'comments',
            width: 180,
            render: (_, record) => {
                const comments = [];
                if (record.editor_comment) {
                    comments.push({ label: 'Editor', text: record.editor_comment, color: 'blue' });
                }
                if (record.conference_editor_comment) {
                    comments.push({ label: 'Conf. Editor', text: record.conference_editor_comment, color: 'purple' });
                }

                return (
                    <div
                        onClick={() => openDetailModal(record)}
                        className="cursor-pointer hover:bg-blue-50 -m-2 p-2 rounded transition-colors min-h-[40px] flex items-center"
                    >
                        {comments.length === 0 ? (
                            <span className="text-gray-400 text-xs">No comments yet - Click for details</span>
                        ) : (
                            <div className="space-y-1">
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
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            render: (_, record) => {
                if (record.status === 'Rejected') {
                    return <span className="text-red-500 text-sm font-medium">Rejected - No further action</span>;
                }
                if (record.status === 'Reviewed by Editor') {
                    return <span className="text-green-600 text-sm font-medium">Accepted - Awaiting next stage</span>;
                }
                if (record.status === 'Reviewed by Conference Editor') {
                    return <span className="text-green-600 text-sm font-medium">Accepted - Awaiting Admin</span>;
                }
                if (record.status === 'Accepted') {
                    return <span className="text-green-600 text-sm font-medium">Final Accepted</span>;
                }

                return (
                    <Space size="small">
                        <Tooltip title="Accept Abstract">
                            <Button
                                type="primary"
                                size="small"
                                icon={<FaCheck />}
                                loading={editorReviewMutation.isPending}
                                onClick={() => openReviewModal(record.id, 'accept', record.title, record)}
                                className="bg-green-600 hover:bg-green-700 border-none flex items-center gap-1"
                            >
                                Accept
                            </Button>
                        </Tooltip>
                        <Tooltip title="Reject Abstract">
                            <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<FaTimes />}
                                loading={editorReviewMutation.isPending}
                                onClick={() => openReviewModal(record.id, 'reject', record.title, record)}
                                className="flex items-center gap-1"
                            >
                                Reject
                            </Button>
                        </Tooltip>
                    </Space>
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
                        { title: 'Review Abstracts' },
                    ]}
                />
            </div>

            <Card
                title={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <FileTextOutlined className="text-[#12b48b]" />
                            <span>Assigned Abstracts for Review</span>
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
                className="shadow-sm border-t-4 border-t-[#12b48b]"
            >
                <Table
                    columns={columns}
                    dataSource={abstracts}
                    rowKey="id"
                    loading={loading && !abstracts.length}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No abstracts assigned to you for review' }}
                    scroll={{ x: 1500 }}
                />
            </Card>

            {/* Review Comment Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {reviewModal.action === 'accept' ? (
                            <FaCheck className="text-green-600" />
                        ) : (
                            <FaTimes className="text-red-500" />
                        )}
                        <span>
                            {reviewModal.action === 'accept' ? 'Accept' : 'Reject'} Abstract
                        </span>
                    </div>
                }
                open={reviewModal.open}
                onCancel={closeReviewModal}
                footer={null}
                destroyOnClose
                centered
                width={550}
            >
                <div className="py-2">
                    {reviewModal.title && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Abstract Title</span>
                            <span className="font-medium text-gray-800">{reviewModal.title}</span>
                        </div>
                    )}

                    {reviewModal.record && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Your Role</span>
                            <Tag color={getRoleLabel(reviewModal.record) === 'Conference Editor' ? 'purple' : 'blue'}>
                                {getRoleLabel(reviewModal.record)}
                            </Tag>
                        </div>
                    )}

                    {/* Show previous editor comment if this is conference editor stage */}
                    {reviewModal.record?.editor_comment && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-xs text-blue-600 font-medium block mb-1">
                                <CommentOutlined className="mr-1" />
                                Editor Comment
                            </span>
                            <span className="text-gray-700 text-sm">{reviewModal.record.editor_comment}</span>
                        </div>
                    )}

                    <div className="mb-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Review Comment <span className="text-red-500">*</span>
                        </label>
                        <TextArea
                            rows={4}
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                                if (e.target.value.trim()) setCommentError('');
                            }}
                            placeholder={
                                reviewModal.action === 'accept'
                                    ? 'Enter your acceptance comment (e.g., reason for approval, suggestions)...'
                                    : 'Enter your rejection reason (mandatory)...'
                            }
                            status={commentError ? 'error' : ''}
                            maxLength={1000}
                            showCount
                        />
                        {commentError && (
                            <div className="text-red-500 text-xs mt-1">{commentError}</div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={closeReviewModal}>Cancel</Button>
                        {reviewModal.action === 'accept' ? (
                            <Button
                                type="primary"
                                onClick={handleReviewSubmit}
                                loading={editorReviewMutation.isPending}
                                className="bg-green-600 hover:bg-green-700 border-none"
                            >
                                Confirm Accept
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                danger
                                onClick={handleReviewSubmit}
                                loading={editorReviewMutation.isPending}
                            >
                                Confirm Reject
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
                width={650}
                centered
                destroyOnClose
            >
                {detailModal.record && (
                    <div className="py-2">
                        {/* Header with ID and Status */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-sm text-gray-500">
                                ABS-{String(detailModal.record.id).padStart(3, '0')}
                            </span>
                            <div className="flex items-center gap-2">
                                {getStatusTag(detailModal.record.status)}
                                <Tag color={getRoleLabel(detailModal.record) === 'Conference Editor' ? 'purple' : 'blue'}>
                                    {getRoleLabel(detailModal.record)}
                                </Tag>
                            </div>
                        </div>

                        {/* Conference */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Conference</span>
                            <span className="font-medium text-[#12b48b]">{detailModal.record.conference?.name || 'N/A'}</span>
                        </div>

                        {/* Author */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Author</span>
                            <div className="flex items-center gap-2">
                                <UserOutlined className="text-gray-400" />
                                <span className="font-medium">
                                    {detailModal.record.author?.firstName} {detailModal.record.author?.lastName}
                                </span>
                            </div>
                        </div>

                        {/* Abstract File & Submission Date */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Abstract File</span>
                                {detailModal.record.abstract_file ? (
                                    <a
                                        href={`${ImageURl}${detailModal.record.abstract_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                                    >
                                        <FaDownload /> Download
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-sm">No File</span>
                                )}
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs text-gray-500 block mb-1">Submission Date</span>
                                <span className="text-sm">{moment(detailModal.record.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
                            </div>
                        </div>

                        <Divider className="my-4" />

                        {/* Comments Section */}
                        <div>
                            <span className="text-sm font-medium text-gray-700 block mb-3">
                                <CommentOutlined className="mr-2" />
                                Review Comments
                            </span>

                            {/* Editor Comment */}
                            {detailModal.record.editor_comment ? (
                                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <span className="text-xs text-blue-600 font-medium block mb-1">
                                        Editor Comment
                                    </span>
                                    <span className="text-gray-700 text-sm">{detailModal.record.editor_comment}</span>
                                </div>
                            ) : (
                                <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium block mb-1">
                                        Editor Comment
                                    </span>
                                    <span className="text-gray-400 text-sm italic">No comment yet</span>
                                </div>
                            )}

                            {/* Conference Editor Comment */}
                            {detailModal.record.conference_editor_comment ? (
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <span className="text-xs text-purple-600 font-medium block mb-1">
                                        Conference Editor Comment
                                    </span>
                                    <span className="text-gray-700 text-sm">{detailModal.record.conference_editor_comment}</span>
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <span className="text-xs text-gray-500 font-medium block mb-1">
                                        Conference Editor Comment
                                    </span>
                                    <span className="text-gray-400 text-sm italic">No comment yet</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EditorAbstractReview;
