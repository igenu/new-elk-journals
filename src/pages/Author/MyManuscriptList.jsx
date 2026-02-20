import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table, Button, Space, Card, Tag, message } from 'antd';
import { FaEye, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { manuscriptApi } from '../../services/api';
import moment from 'moment';

const MyManuscriptList = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const pollingIntervalRef = useRef(null);

    const fetchManuscripts = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                if (showLoading) message.error('User information not found. Please login again.');
                return;
            }
            const user = JSON.parse(userStr);
            // Assuming the user object has an 'id' property. Adjust if it's 'userId' or similar.
            const userId = user.id || user.userId;

            if (!userId) {
                if (showLoading) message.error('Invalid user data.');
                return;
            }

            const response = await manuscriptApi.getByAuthor(userId);
            setManuscripts(response.data);
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
            if (showLoading) message.error('Failed to fetch manuscripts');
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

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
            title: 'Manuscript ID',
            dataIndex: 'manuscript_id',
            key: 'manuscript_id',
            render: (text) => <span className="text-gray-600 font-mono text-xs">{text}</span>
        },
        {
            title: 'Title',
            dataIndex: 'paper_title',
            key: 'paper_title',
            render: (text) => <span className="font-medium text-[#12b48b]">{text}</span>
        },
        {
            title: 'Journal',
            dataIndex: ['journal', 'title'],
            key: 'journal',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                const statusLower = status?.toLowerCase() || '';

                if (status === 'Submitted') color = 'blue';
                if (status === 'Under Review') color = 'orange';
                if (status === 'Accepted') color = 'green';
                if (status === 'Rejected') color = 'red';
                if (statusLower === 'pending') color = 'gold';
                if (statusLower === 'assigned to editor' || statusLower === 'assigned_to_editor') color = 'purple';
                if (statusLower === 'accepted by editor' || statusLower === 'accepted_by_editor') color = 'cyan';

                return (
                    <Tag color={color} key={status}>
                        {status?.toUpperCase() || 'N/A'}
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
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<FaEye />}
                        onClick={() => navigate(`/dashboard/submit-manuscript/${record?.manuscript_id}`)}
                        className="bg-[#12b48b] hover:bg-[#0e9f7a] border-none"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={<div className="flex items-center gap-2"><FaFileAlt className="text-[#12b48b]" /> My Manuscripts</div>}
                className="shadow-sm border-t-4 border-t-[#12b48b]"
                extra={
                    <Button
                        type="primary"
                        onClick={() => navigate('/dashboard/submit-manuscript/new')}
                        className="bg-[#12b48b] hover:bg-[#0e9f7a] border-none"
                    >
                        New Manuscript
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={manuscripts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default MyManuscriptList;
