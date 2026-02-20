import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Tag, message, Popconfirm, Tooltip } from 'antd';
import { FaFileAlt, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import { abstractSubmissionApi } from '../../services/api';
import { ImageURl } from '../../services/serviceApi';
import moment from 'moment';

const AbstractManagement = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await abstractSubmissionApi.getAll();
            // API returns data directly as an array in response.data
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else if (response.data && Array.isArray(response.data.success)) {
                // Fallback for success wrapper format
                setSubmissions(response.data.success);
            } else {
                setSubmissions([]);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            message.error('Failed to fetch abstract submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        setActionLoading(id);
        try {
            await abstractSubmissionApi.updateStatus(id, status);
            message.success(`Submission ${status.toLowerCase()} successfully`);
            fetchSubmissions(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            render: (text, render, index) => <span className="text-gray-600 font-mono text-xs">#{index + 1}</span>
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            width: 180,
            render: (author) => {
                if (author && author.firstName && author.lastName) {
                    return <span className="font-medium">{`${author.firstName} ${author.lastName}`}</span>;
                }
                return <span className="text-gray-400">N/A</span>;
            }
        },
        {
            title: 'Conference',
            dataIndex: ['conference', 'name'],
            key: 'conference_name',
            render: (text) => <span className="font-medium text-[#12b48b]">{text || 'N/A'}</span>
        },
        {
            title: 'Abstract File',
            dataIndex: 'abstract_file',
            key: 'abstract_file',
            render: (text) => (
                text ? (
                    <a href={`${ImageURl}${text}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                        <FaDownload /> Download
                    </a>
                ) : <span className="text-gray-400">No File</span>
            )
        },
        {
            title: 'Submission Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('DD MMM YYYY, hh:mm A')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Pending') color = 'orange';
                if (status === 'Approved') color = 'green';
                if (status === 'Rejected') color = 'red';
                return (
                    <Tag color={color} key={status}>
                        {status ? status.toUpperCase() : 'PENDING'}
                    </Tag>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {record.status !== 'Approved' && (
                        <Popconfirm
                            title="Approve Submission"
                            description="Are you sure you want to approve this abstract?"
                            onConfirm={() => handleStatusUpdate(record.id, 'Approved')}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Approve">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<FaCheck />}
                                    loading={actionLoading === record.id}
                                    className="bg-green-600 hover:bg-green-700 border-none"
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                    {record.status !== 'Rejected' && (
                        <Popconfirm
                            title="Reject Submission"
                            description="Are you sure you want to reject this abstract?"
                            onConfirm={() => handleStatusUpdate(record.id, 'Rejected')}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Reject">
                                <Button
                                    type="primary"
                                    danger
                                    shape="circle"
                                    icon={<FaTimes />}
                                    loading={actionLoading === record.id}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={<div className="flex items-center gap-2"><FaFileAlt className="text-[#12b48b]" /> Abstract Submissions Management</div>}
                className="shadow-sm border-t-4 border-t-[#12b48b]"
            >
                <Table
                    columns={columns}
                    dataSource={submissions}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No abstract submissions found' }}
                />
            </Card>
        </div>
    );
};

export default AbstractManagement;
