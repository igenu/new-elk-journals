import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, message, Popconfirm, Tag } from 'antd';
import { FaPlus, FaPencilAlt, FaTrash, FaEye } from 'react-icons/fa';
import moment from 'moment';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { newsApi } from '../../services/api';
import { encryptId } from '../../utils/idEncryption';

const { TextArea } = Input;

const ManageNews = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await newsApi.getAll();
            // Handle structure: { success: true, count: X, data: [...] }
            let data = response.data.data || [];

            // Normalize tags
            data = data.map(item => {
                let parsedTags = item.tags;
                if (typeof parsedTags === 'string') {
                    try {
                        // Handle potential double escaping or just parse
                        parsedTags = JSON.parse(parsedTags);
                    } catch (e) {
                        // Fallback attempt: if it looks like a stringified array but failed standard parse, 
                        // or just wrap it if it's a simple string that shouldn't be parsed?
                        // For now, assume JSON.parse is enough for standard "[...]" strings.
                        console.error("Failed to parse tags for item", item.id, e);
                        parsedTags = [];
                    }
                }
                return { ...item, tags: Array.isArray(parsedTags) ? parsedTags : [] };
            });

            setNews(data);
        } catch (error) {
            console.error("Failed to fetch news", error);
            message.error("Failed to fetch news");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingNews(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingNews(record);
        // Pre-fill form
        form.setFieldsValue({
            title: record.title,
            description: record.description,
            // Handle date: API says "2025-01-15", Antd DatePicker needs object
            news_date: record.news_date ? dayjs(record.news_date) : null,
            tags: record.tags || []
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await newsApi.delete(id);
            message.success("News deleted successfully");
            fetchNews();
        } catch (error) {
            console.error("Failed to delete news", error);
            message.error("Failed to delete news");
        }
    };

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                title: values.title,
                description: values.description,
                news_date: values.news_date ? values.news_date.format('YYYY-MM-DD') : null,
                tags: values.tags || []
            };

            if (editingNews) {
                await newsApi.update(editingNews.id, payload);
                message.success("News updated successfully");
            } else {
                await newsApi.create(payload);
                message.success("News created successfully");
            }
            setIsModalOpen(false);
            fetchNews();
        } catch (error) {
            console.error("Submit error", error);
            message.error(error.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'S.No',
            key: 'sno',
            render: (text, record, index) => index + 1,
            width: 70,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <span className="font-semibold">{text}</span>
        },
        {
            title: 'Date',
            dataIndex: 'news_date',
            key: 'news_date',
            render: (date) => date ? moment(date).format('DD MMM YYYY') : '-'
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags) => (
                <>
                    {Array.isArray(tags) ? tags.map(tag => (
                        <Tag color="blue" key={tag}>{tag}</Tag>
                    )) : (typeof tags === 'string' ? <Tag color="blue">{tags}</Tag> : null)}
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<FaEye className="text-green-500" />}
                        onClick={() => navigate(`/dashboard/news/${encryptId(record.id)}`)}
                    />
                    <Button
                        type="text"
                        icon={<FaPencilAlt className="text-blue-500" />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Delete News"
                        description="Are you sure to delete this news?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<FaTrash className="text-red-500" />}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage News</h1>
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Add News
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={news}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <Modal
                title={editingNews ? "Edit News" : "Add News"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                maskClosable={false}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter title' }]}
                    >
                        <Input placeholder="News Title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter description' }]}
                    >
                        <ReactQuill theme="snow" modules={modules} />
                    </Form.Item>

                    <Form.Item
                        name="news_date"
                        label="News Date"
                        rules={[{ required: true, message: 'Please select date' }]}
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="tags"
                        label="Tags"
                        rules={[{ required: true, message: 'Please add at least one tag' }]}
                    >
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Type and press enter to add tags"
                            tokenSeparators={[',']}
                            open={false}
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitting} className="bg-blue-600">
                            {editingNews ? "Update" : "Create"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageNews;
