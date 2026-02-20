import React, { useState, useEffect } from 'react';
import { journalCategoryApi } from '../../services/api';
import { Table, Button, Modal, Form, Input, Tag, Space, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

const JournalCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await journalCategoryApi.getAll();
            // Ensure each category has a key for Antd Table
            const data = response.data.map(item => ({ ...item, key: item.id }));
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch categories',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (values) => {
        setSubmitting(true);
        try {
            await journalCategoryApi.create({ title: values.title });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Category added successfully',
                timer: 1500,
                showConfirmButton: false,
            });
            setIsAddModalOpen(false);
            form.resetFields();
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add category',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await journalCategoryApi.delete(id);
                Swal.fire(
                    'Deleted!',
                    'Category has been deleted.',
                    'success'
                );
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete category',
                });
            }
        }
    };

    const columns = [
        {
            title: 'Serial No',
            key: 'serial',
            render: (text, record, index) => index + 1,
            width: 100,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Delete">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteCategory(record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Journal Categories</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                    size="large"
                >
                    Add Category
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <Table
                    columns={columns}
                    dataSource={categories}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey="id"
                />
            </div>

            <Modal
                title="Add New Category"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddCategory}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter category title' }]}
                    >
                        <Input placeholder="Enter category title" />
                    </Form.Item>
                    <Form.Item className="flex justify-end mb-0">
                        <Space>
                            <Button onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Add Category
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default JournalCategories;
