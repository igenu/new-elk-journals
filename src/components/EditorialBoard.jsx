import React, { useState } from 'react';
import { Table, Button, Input, Select, Form, Modal, Space } from 'antd';
import { FaPlus, FaTrash } from 'react-icons/fa';

const { Option } = Select;

const EditorialBoard = ({ editors, onAddEditor, onDeleteEditor }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Profile Link',
            dataIndex: 'profileLink',
            key: 'profileLink',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">View Profile</a>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="text" danger icon={<FaTrash />} onClick={() => onDeleteEditor(record.id)} />
            ),
        },
    ];

    const handleAdd = (values) => {
        onAddEditor(values);
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Editorial Board</h3>
                <Button type="primary" icon={<FaPlus />} onClick={() => setIsModalVisible(true)}>
                    Add Editor
                </Button>
            </div>

            <Table columns={columns} dataSource={editors} rowKey={(record, index) => index} pagination={false} />

            <Modal
                title="Add New Editor"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                maskClosable={false}
            >
                <Form form={form} onFinish={handleAdd} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="position" label="Position" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Editor in Chief">Editor in Chief</Option>
                            <Option value="Editorial Advisory Board">Editorial Advisory Board</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="profileLink" label="Profile Link" rules={[{ required: true, type: 'url' }]}>
                        <Input />
                    </Form.Item>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Add</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default EditorialBoard;
