import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tooltip, Breadcrumb } from 'antd';
import { EyeOutlined, PlusOutlined, HomeOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { conferenceTemplateApi, conferenceApi } from '../../services/api';
import { encryptId } from '../../utils/crypto';
import SubmittedAbstractsModal from '../../components/SubmittedAbstractsModal';
import Swal from 'sweetalert2';

const ConferenceTemplateList = () => {
    const [templates, setTemplates] = useState([]);
    const [conferences, setConferences] = useState({});
    const [loading, setLoading] = useState(false);
    const [abstractsModal, setAbstractsModal] = useState({ open: false, conferenceId: null, conferenceName: '' });
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await conferenceTemplateApi.getAll();
            if (response.data && response.data.success) {
                setTemplates(response.data.success);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            Swal.fire('Error', 'Failed to fetch conference templates', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchConferences = async () => {
        try {
            const response = await conferenceApi.getAll();
            if (response.data && response.data.success) {
                const confMap = {};
                response.data.success.forEach(conf => {
                    confMap[conf.id] = conf.name;
                });
                setConferences(confMap);
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
        }
    };

    useEffect(() => {
        fetchTemplates();
        fetchConferences();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await conferenceTemplateApi.delete(id);
                Swal.fire(
                    'Deleted!',
                    'Your conference template has been deleted.',
                    'success'
                );
                fetchTemplates(); // Refresh the list
            } catch (error) {
                console.error('Error deleting template:', error);
                Swal.fire(
                    'Error!',
                    'Failed to delete conference template.',
                    'error'
                );
            }
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 80,
        },
        {
            title: 'Conference',
            dataIndex: 'conference_id',
            key: 'conference_id',
            render: (text, record) => record?.conference?.name || `Conference ID: ${text}`,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => {
                if (!text) return 'N/A';
                const stripped = text.replace(/<[^>]+>/g, ''); // Strip HTML tags
                return stripped.length > 50 ? `${stripped.substring(0, 50)}...` : stripped;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/dashboard/conference-templates/${encryptId(record.conference_id)}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Submitted Abstracts">
                        <Button
                            type="default"
                            shape="circle"
                            icon={<FileTextOutlined />}
                            className="text-[#12b48b] border-[#12b48b] hover:text-[#0e9a77] hover:border-[#0e9a77]"
                            onClick={() => setAbstractsModal({ open: true, conferenceId: record.conference_id, conferenceName: record.conference?.name || '' })}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="default"
                            shape="circle"
                            icon={<EditOutlined />}
                            className="text-blue-500 border-blue-500 hover:text-blue-600 hover:border-blue-600"
                            onClick={() => navigate(`/dashboard/conference-templates/edit/${encryptId(record.conference_id)}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.conference_id)}
                        />
                    </Tooltip>
                </Space >
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        {
                            href: '/dashboard',
                            title: <HomeOutlined />,
                        },
                        {
                            title: 'Conference Templates',
                        },
                    ]}
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Conference Templates</h1>
                <Link to="/dashboard/add-conference-template">
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Add New Template
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <Table
                    columns={columns}
                    dataSource={templates}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>

            {/* Submitted Abstracts Modal */}
            <SubmittedAbstractsModal
                open={abstractsModal.open}
                onCancel={() => setAbstractsModal({ open: false, conferenceId: null, conferenceName: '' })}
                conferenceId={abstractsModal.conferenceId}
                conferenceName={abstractsModal.conferenceName}
            />
        </div>
    );
};

export default ConferenceTemplateList;
