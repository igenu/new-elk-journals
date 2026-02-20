import React, { useState, useEffect } from 'react';
import { contactUsApi } from '../../services/api';
import { Table, Modal, Button, Tag, Space, message } from 'antd';
import { FaEye, FaTrash } from 'react-icons/fa';
import useRefreshOnFocus from '../../hooks/useRefreshOnFocus';
import Swal from 'sweetalert2';

const AdminContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchContacts = async () => {
        try {
            const response = await contactUsApi.getAll();
            setContacts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch contact inquiries:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Auto-refresh when tab comes back into focus
    useRefreshOnFocus(fetchContacts);

    const handleDelete = async (id) => {
        try {
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
                await contactUsApi.delete(id);
                // Swal.fire(
                //     'Deleted!',
                //     'The inquiry has been deleted.',
                //     'success'
                // );
                message.success('Contact inquiry deleted successfully'); // Using message for consistency or keep Swal if requested strictly
                fetchContacts();
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                'Failed to delete contact inquiry.',
                'error'
            );
        }
    };

    const handleView = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
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
            key: 'serial',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text) => text || <span className="text-gray-400">N/A</span>,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => formatDate(text),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<FaEye className="text-[#12b48b]" />}
                        size="small"
                        onClick={() => handleView(record)}
                        shape="circle"
                        className="hover:bg-green-50"
                    />
                    <Button
                        type="text"
                        icon={<FaTrash className="text-red-500" />}
                        size="small"
                        shape="circle"
                        className="hover:bg-red-50"
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 relative inline-block">
                Contact Us Inquiries
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#12b48b] rounded-full"></span>
            </h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden p-4">
                <Table
                    columns={columns}
                    dataSource={contacts}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <Modal
                title={<span className="text-xl font-bold text-gray-800">Contact Inquiry Details</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                {selectedContact && (
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                                <p className="font-medium text-base">{selectedContact.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Email</p>
                                <p className="font-medium text-base">{selectedContact.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Phone</p>
                                <p className="font-medium text-base">{selectedContact.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">City</p>
                                <p className="font-medium text-base">{selectedContact.city}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Department</p>
                                <p className="font-medium text-base">{selectedContact.department || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Date Received</p>
                                <p className="font-medium text-base">{formatDate(selectedContact.createdAt)}</p>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4">
                            <p className="text-sm text-gray-500 font-medium mb-2">Message</p>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap border border-gray-100">
                                {selectedContact.message}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminContactList;
