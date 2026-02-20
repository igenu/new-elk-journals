import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Modal, Tag, Input, Form, Select, Row, Col, message } from 'antd';
import { FaEye, FaEdit, FaSearch, FaFileExcel, FaTrash } from 'react-icons/fa';
import { conferenceRegistrationApi } from '../../services/api';
import useRefreshOnFocus from '../../hooks/useRefreshOnFocus';

const { Option } = Select;

const ConferenceRegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const response = await conferenceRegistrationApi.getAll();
            setRegistrations(response.data.data || []); // Adjust based on API structure
        } catch (error) {
            console.error('Error fetching registrations:', error);
            message.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    useRefreshOnFocus(fetchRegistrations);

    const navigate = useNavigate();

    const handleView = (record) => {
        navigate(`/dashboard/conference-registrations/${record.id}`);
    };

    const handleEdit = (record) => {
        setSelectedRegistration(record);
        form.setFieldsValue(record);
        setEditModalOpen(true);
    };

    const handleUpdate = async (values) => {
        setUpdating(true);
        try {
            await conferenceRegistrationApi.update(selectedRegistration.id, values);
            message.success('Registration updated successfully');
            setEditModalOpen(false);
            fetchRegistrations();
        } catch (error) {
            console.error('Update error:', error);
            message.error('Failed to update registration');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this registration?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await conferenceRegistrationApi.delete(id);
                    message.success('Registration deleted successfully');
                    fetchRegistrations();
                } catch (error) {
                    console.error('Delete error:', error);
                    message.error('Failed to delete registration');
                }
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + ', ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const columns = [
        {
            title: 'S.No',
            key: 'sno',
            render: (text, record, index) => index + 1,
            width: 70,
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => formatDate(text),
            width: 180,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Full Name',
            key: 'fullName',
            render: (text, record) => `${record.title} ${record.firstName} ${record.lastName}`,
            sorter: (a, b) => (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Paper Presenting',
            dataIndex: 'presentingPaper',
            key: 'presentingPaper',
            render: (text) => (
                <Tag color={text === 'Online' ? 'blue' : text === 'Offline' ? 'green' : 'default'}>
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<FaEye className="text-[#12b48b]" />}
                        onClick={() => handleView(record)}
                        className="hover:bg-green-50 rounded-full"
                    />
                    {/* <Button
                        type="text"
                        icon={<FaEdit className="text-blue-500" />}
                        onClick={() => handleEdit(record)}
                        className="hover:bg-blue-50 rounded-full"
                    /> */}
                    <Button
                        type="text"
                        icon={<FaTrash className="text-red-500" />}
                        onClick={() => handleDelete(record.id)}
                        className="hover:bg-red-50 rounded-full"
                    />

                </Space>
            ),
        },
    ];

    const filteredData = registrations.filter(item => {
        const searchLower = searchText.toLowerCase();
        return (
            item.firstName?.toLowerCase().includes(searchLower) ||
            item.lastName?.toLowerCase().includes(searchLower) ||
            item.email?.toLowerCase().includes(searchLower) ||
            item.institution?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 relative inline-block">
                    Conference Registrations
                    <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#12b48b] rounded-full"></span>
                </h1>
                {/* <div className="flex gap-3">
                    <Input
                        prefix={<FaSearch className="text-gray-400" />}
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-64"
                    />
                    
                </div> */}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>



            {/* Edit Modal */}
            <Modal
                title="Edit Registration"
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="designation" label="Designation">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="department" label="Department">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="institution" label="Institution">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={updating} className="bg-[#204066]">Update</Button>
                    </div>
                </Form>
            </Modal>
        </div >
    );
};

export default ConferenceRegistrationList;
