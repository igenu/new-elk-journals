import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table, Button, message, Space, Tooltip, Tag, Input, Select } from 'antd';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { proposalRequestApi } from '../../services/api';

const { Option } = Select;

const ProposalRequestList = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ status: '', search: '' });
    const navigate = useNavigate();
    const pollingIntervalRef = useRef(null);

    const fetchProposals = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const response = await proposalRequestApi.getAll(params);
            setProposals(response.data.data);
        } catch (error) {
            console.error("Failed to fetch proposals:", error);
            if (showLoading) message.error("Failed to load proposal requests.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    useEffect(() => {
        if (loading) return;

        pollingIntervalRef.current = setInterval(() => {
            fetchProposals(false);
        }, 30000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [loading, fetchProposals]);

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'approved') return 'green';
        if (statusLower === 'rejected') return 'red';
        if (statusLower === 'pending') return 'gold';
        if (statusLower === 'under review') return 'blue';
        if (statusLower === 'completed') return 'purple';
        return 'default';
    };

    const getPublicationTypeLabel = (type) => {
        const labels = {
            'proceedings_edited': 'Proceedings & Edited Book',
            'proceedings_only': 'Proceedings Only',
            'edited_only': 'Edited Book Only'
        };
        return labels[type] || type;
    };

    const columns = [
        {
            title: 'S.No',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 70,
        },
        {
            title: 'Proposal ID',
            dataIndex: 'proposalId',
            key: 'proposalId',
            width: 140,
            ellipsis: { showTitle: false },
            render: (id) => (
                <Tooltip placement="topLeft" title={id}>
                    <span className="font-medium text-blue-600">{id}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Requestor Name',
            key: 'requestorName',
            width: 180,
            ellipsis: { showTitle: false },
            render: (_, record) => {
                const name = `${record.title} ${record.firstName} ${record.lastName}`;
                return (
                    <Tooltip placement="topLeft" title={name}>
                        {name}
                    </Tooltip>
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: { showTitle: false },
            render: (email) => (
                <Tooltip placement="topLeft" title={email}>
                    {email}
                </Tooltip>
            ),
        },
        {
            title: 'Conference Title',
            dataIndex: 'conferenceTitle',
            key: 'conferenceTitle',
            width: 250,
            ellipsis: { showTitle: false },
            render: (title) => (
                <Tooltip placement="topLeft" title={title}>
                    {title}
                </Tooltip>
            ),
        },
        {
            title: 'Publication Type',
            dataIndex: 'publicationType',
            key: 'publicationType',
            width: 180,
            render: (type) => (
                <Tag color="geekblue">{getPublicationTypeLabel(type)}</Tag>
            ),
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
            width: 130,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status?.toUpperCase() || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<FaEye className="text-gray-600 text-lg" />}
                            onClick={() => navigate(`/dashboard/proposal-requests/${record.id}`)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleSearch = (value) => {
        setFilters(prev => ({ ...prev, search: value }));
    };

    const handleStatusFilter = (value) => {
        setFilters(prev => ({ ...prev, status: value || '' }));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Proposal Requests</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <div className="flex flex-wrap gap-4 mb-4">
                    <Input
                        placeholder="Search by name, email, or conference..."
                        prefix={<FaSearch className="text-gray-400" />}
                        allowClear
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Select
                        placeholder="Filter by Status"
                        allowClear
                        onChange={handleStatusFilter}
                        style={{ width: 180 }}
                    >
                        <Option value="Pending">Pending</Option>
                        <Option value="Under Review">Under Review</Option>
                        <Option value="Approved">Approved</Option>
                        <Option value="Rejected">Rejected</Option>
                        <Option value="Completed">Completed</Option>
                    </Select>
                </div>

                <Table
                    columns={columns}
                    dataSource={proposals}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: 1400 }}
                />
            </div>
        </div>
    );
};

export default ProposalRequestList;
