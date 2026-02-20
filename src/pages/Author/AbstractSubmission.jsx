import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table, Button, Space, Card, Tag, message } from 'antd';
import { FaFileAlt, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { abstractSubmissionApi } from '../../services/api';
import { ImageURl, scriptUrl } from '../../services/serviceApi';
import moment from 'moment';

const AbstractSubmission = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const pollingIntervalRef = useRef(null);

    const fetchSubmissions = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                if (showLoading) message.error('User information not found. Please login again.');
                return;
            }
            const user = JSON.parse(userStr);
            const userId = user.id || user.userId;

            if (!userId) {
                if (showLoading) message.error('Invalid user data.');
                return;
            }

            const response = await abstractSubmissionApi.getByAuthor(userId);
            if (Array.isArray(response.data)) {
                setSubmissions(response.data);
            } else if (response.data && Array.isArray(response.data.success)) {
                setSubmissions(response.data.success);
            } else {
                setSubmissions([]);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            if (showLoading) message.error('Failed to fetch abstract submissions');
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    // Polling for live data updates (every 10 seconds)
    useEffect(() => {
        if (loading) return;

        pollingIntervalRef.current = setInterval(() => {
            fetchSubmissions(false); // Silent fetch without loading state
        }, 10000); // Poll every 10 seconds

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [loading, fetchSubmissions]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (text, record, index) => <span className="text-gray-600 font-mono text-xs">#{index + 1}</span>
        },
        {
            title: 'Conference',
            dataIndex: ['conference', 'name'],
            key: 'conference_name',
            render: (text, record) => <span className="font-medium text-[#12b48b]">{text || 'N/A'}</span>
        },
        {
            title: 'Abstract File',
            dataIndex: 'abstract_file',
            key: 'abstract_file',
            render: (text) => (
                text ? (
                    <a href={`${scriptUrl}${text}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                        <FaDownload /> Download
                    </a>
                ) : <span className="text-gray-400">No File</span>
            )
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
            title: 'Submission Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('DD MMM YYYY, hh:mm A')
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    disabled={record.status !== 'Approved'}
                    onClick={() => navigate('/dashboard/conference/full-paper-submission')}
                    className={record.status === 'Approved' ? 'bg-[#12b48b] hover:bg-[#0f9d76]' : ''}
                >
                    Submit Full Paper
                </Button>
            )
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={<div className="flex items-center gap-2"><FaFileAlt className="text-[#12b48b]" /> My Abstract Submissions</div>}
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

export default AbstractSubmission;
