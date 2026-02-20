/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message, Tooltip, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import Swal from 'sweetalert2';
import { conferenceApi } from '../../services/api';

const AddConference = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [viewingId, setViewingId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        setLoading(true);
        try {
            const response = await conferenceApi.getAll();
            if (response.data && Array.isArray(response.data)) {
                setData(response.data);
            } else if (response.data && response.data.success) {
                setData(response.data.success);
            } else {
                message.error('Failed to fetch conferences');
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
            message.error('Error fetching conferences');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingId(null);
        setViewingId(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        setViewingId(null);
        form.setFieldsValue({
            name: record.name,
            organized_by: record.organized_by,
            start_date: record.start_date ? moment(record.start_date) : null
        });
        setIsModalVisible(true);
    };

    const handleView = (record) => {
        setEditingId(null);
        setViewingId(record.id);
        form.setFieldsValue({
            name: record.name,
            organized_by: record.organized_by,
            start_date: record.start_date ? moment(record.start_date) : null
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await conferenceApi.delete(id);
                    Swal.fire(
                        'Deleted!',
                        'Conference has been deleted.',
                        'success'
                    );
                    fetchConferences();
                } catch (error) {
                    console.error('Error deleting conference:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to delete conference.',
                        'error'
                    );
                }
            }
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        setSubmitLoading(true);
        try {
            const payload = {
                ...values,
                start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null
            };

            if (editingId) {
                await conferenceApi.update(editingId, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Conference updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await conferenceApi.create(payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Conference added successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            setIsModalVisible(false);
            fetchConferences();
        } catch (error) {
            console.error('Error saving conference:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.error?.message || 'Something went wrong!',
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const columns = [
        {
            title: 'S.No',
            key: 'index',
            render: (text, record, index) => index + 1,
            width: 80,
        },
        {
            title: 'Conference Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Organized By',
            dataIndex: 'organized_by',
            key: 'organized_by',
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Button
                            type="default"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Conference Management</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700 border-none"
                >
                    Add Conference
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="bg-white shadow-md rounded-lg overflow-hidden"
                bordered
            />

            <Modal
                title={viewingId ? "View Conference" : (editingId ? "Edit Conference" : "Add Conference")}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Conference Name"
                        rules={[{ required: true, message: 'Please enter conference name' }]}
                    >
                        <Input placeholder="Enter conference name" disabled={!!viewingId} />
                    </Form.Item>

                    <Form.Item
                        name="organized_by"
                        label="Organized By"
                        rules={[{ required: true, message: 'Please enter organizer name' }]}
                    >
                        <Input placeholder="Enter organizer name" disabled={!!viewingId} />
                    </Form.Item>

                    <Form.Item
                        name="start_date"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} disabled={!!viewingId} />
                    </Form.Item>

                    {!viewingId && (
                        <Form.Item className="mb-0 text-right">
                            <Space>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button type="primary" htmlType="submit" loading={submitLoading}>
                                    {editingId ? "Update" : "Add"}
                                </Button>
                            </Space>
                        </Form.Item>
                    )}
                    {viewingId && (
                        <Form.Item className="mb-0 text-right">
                            <Button onClick={handleCancel}>Close</Button>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default AddConference;
