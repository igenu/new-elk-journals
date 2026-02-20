import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table, Button, message, Space, Tooltip, Tag } from 'antd';
import { FaEye, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { manuscriptApi } from '../../services/api';




const ManuscriptList = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [journalName, setJournalName] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const journalId = searchParams.get('journalId');
    const pollingIntervalRef = useRef(null);

    const fetchManuscripts = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const params = journalId ? { journalId } : {};
            const response = await manuscriptApi.getAll(params);
            // Expected response structure: { message: "...", data: [...] }
            const manuscriptsData = response.data.data;
            setManuscripts(manuscriptsData);

            // Set journal name from first manuscript if filtering by journal
            if (journalId && manuscriptsData.length > 0 && manuscriptsData[0].journal?.title) {
                setJournalName(manuscriptsData[0].journal.title);
            }
        } catch (error) {
            console.error("Failed to fetch manuscripts:", error);
            if (showLoading) message.error("Failed to load manuscripts.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [journalId]);

    // Initial fetch
    useEffect(() => {
        fetchManuscripts();
    }, [fetchManuscripts]);

    // Polling for live data updates (every 10 seconds)
    useEffect(() => {
        if (loading) return;

        pollingIntervalRef.current = setInterval(() => {
            fetchManuscripts(false); // Silent fetch without loading state
        }, 10000); // Poll every 10 seconds

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [loading, fetchManuscripts]);

    const columns = [
        {
            title: 'S.No',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 70,
        },
        {
            title: 'Ref ID',
            dataIndex: 'manuscript_id',
            key: 'manuscript_id',
            width: 120,
            ellipsis: {
                showTitle: false,
            },
            render: (id) => (
                <Tooltip placement="topLeft" title={id}>
                    {id}
                </Tooltip>
            ),
        },
        {
            title: 'Submitter Name',
            dataIndex: 'submitter_name',
            key: 'submitter_name',
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'submitter_email',
            key: 'submitter_email',
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (email) => (
                <Tooltip placement="topLeft" title={email}>
                    {email}
                </Tooltip>
            ),
        },
        {
            title: 'Journal',
            dataIndex: 'journal',
            key: 'journal',
            width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: (journal) => {
                const title = journal?.title || 'N/A';
                return (
                    <Tooltip placement="topLeft" title={title}>
                        {title}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Submitted At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status) => {
                // Define color mapping for different statuses
                const getStatusColor = (status) => {
                    const statusLower = status?.toLowerCase() || '';
                    if (statusLower === 'accepted') return 'green';
                    if (statusLower === 'rejected') return 'red';
                    if (statusLower === 'pending') return 'gold';
                    if (statusLower === 'under_review' || statusLower === 'under review') return 'blue';
                    if (statusLower === 'revision_requested' || statusLower === 'revision requested') return 'orange';
                    if (statusLower === 'assigned to editor' || statusLower === 'assigned_to_editor') return 'purple';
                    if (statusLower === 'accepted by editor' || statusLower === 'accepted_by_editor') return 'cyan';
                    return 'default';
                };

                return (
                    <Tag color={getStatusColor(status)}>
                        {status?.toUpperCase() || 'N/A'}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            // fixed: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<FaEye className="text-gray-600 text-lg" />}
                            onClick={() => navigate(`/dashboard/manuscripts/${record.manuscript_id}`, {
                                state: { journalId }
                            })}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (


        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                {journalId && (
                    <Button
                        type="text"
                        icon={<FaArrowLeft />}
                        onClick={() => navigate('/dashboard/view-journal')}
                        className="flex items-center"
                    >
                        Back to Journals
                    </Button>
                )}
                <h1 className="text-2xl font-bold text-gray-800">
                    {journalId && journalName
                        ? `Manuscripts for ${journalName}`
                        : 'Manage Manuscripts'}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <Table
                    columns={columns}
                    dataSource={manuscripts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: 1100 }}
                />
            </div>
        </div>
    );
};

export default ManuscriptList;
