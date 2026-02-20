import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conferenceRegistrationApi } from '../../services/api';
import { Tag, Button, Spin, Row, Col, Divider, Card, Descriptions, Avatar } from 'antd';
import { ArrowLeftOutlined, UserOutlined, MailOutlined, MobileOutlined, BankOutlined, ClockCircleOutlined, AuditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FaUserTie, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const ConferenceRegistrationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [registration, setRegistration] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await conferenceRegistrationApi.getById(id);
                setRegistration(response.data.data || response.data);
            } catch (error) {
                console.error("Failed to fetch registration details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    if (!registration) return <div className="text-center mt-10">Registration not found</div>;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header / Banner Section */}
            <div className="mb-8">
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    className="mb-4 text-gray-500 hover:text-[#204066] pl-0 font-medium"
                >
                    Back to List
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="bg-gradient-to-br from-[#204066] to-[#0b1c2e] text-white p-5 rounded-xl shadow-lg">
                            <UserOutlined className="text-4xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 m-0">
                                {registration.title} {registration.firstName} {registration.lastName}
                            </h1>
                            <p className="text-gray-500 mt-2 flex items-center gap-2">
                                <MailOutlined /> {registration.email}
                                <span className="mx-2">•</span>
                                <MobileOutlined /> {registration.mobile}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                        <Tag color="cyan" className="px-3 py-1 text-sm rounded-full m-0 uppercase tracking-wide font-semibold border-0 bg-cyan-50 text-cyan-700">
                            ID: #{registration.id}
                        </Tag>
                        <Tag color={registration.presentingPaper === 'Online' ? 'blue' : registration.presentingPaper === 'Offline' ? 'green' : 'default'} className="px-4 py-1 text-base rounded-full m-0 mt-2 font-medium">
                            {registration.presentingPaper} Presentation
                        </Tag>
                    </div>
                </div>
            </div>

            <Row gutter={24}>
                {/* Left Column - Main Details */}
                <Col xs={24} lg={16}>
                    {/* Conference Context */}
                    <Card className="mb-6 shadow-sm rounded-xl border-0 overflow-hidden" bodyStyle={{ padding: 0 }}>
                        <div className="bg-gradient-to-r from-[#204066] to-[#3b5d87] p-4 text-white">
                            <h3 className="text-white m-0 text-lg font-semibold flex items-center gap-2">
                                <AuditOutlined /> Conference Details
                            </h3>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {registration.conference?.name || "Unknown Conference"}
                            </h2>
                            <p className="text-gray-500 mb-4">
                                Registration ID: <span className="font-mono text-gray-700 font-bold">{registration.conferenceId}</span>
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Registered On</span>
                                    <p className="text-gray-700 font-medium m-0 flex items-center gap-2">
                                        <ClockCircleOutlined /> {formatDate(registration.createdAt)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Terms Accepted</span>
                                    <p className="text-gray-700 font-medium m-0">
                                        <Tag color={registration.terms ? "success" : "error"}>{registration.terms ? "Yes" : "No"}</Tag>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Professional Info */}
                    <Card className="mb-6 shadow-sm rounded-xl border-0" title={<span className="font-bold text-[#204066] flex items-center gap-2"><BankOutlined /> Professional Information</span>}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Designation</label>
                                <div className="text-base text-gray-800 font-semibold">{registration.designation}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Department</label>
                                <div className="text-base text-gray-800 font-medium">{registration.department}</div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Institution</label>
                                <div className="text-lg text-[#204066] font-bold flex items-center gap-2">
                                    <FaBuilding className="text-gray-400" /> {registration.institution}
                                </div>
                            </div>
                        </div>
                        <Divider dashed className="my-6" />
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">Institution Address</label>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 leading-relaxed border border-gray-100 flex items-start gap-3">
                                    <FaMapMarkerAlt className="text-[#12b48b] mt-1 shrink-0" />
                                    <div>
                                        {registration.institutionAddress}<br />
                                        {registration.city}, {registration.state}<br />
                                        <span className="font-medium">Pincode: {registration.pincode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Right Column - Overview & Meta */}
                <Col xs={24} lg={8}>
                    <Card className="mb-6 shadow-sm rounded-xl border-0" title={<span className="font-bold text-[#204066]">Participation Status</span>}>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-600">Presenting Paper</span>
                                <Tag color={registration.presentingPaper === 'Online' ? 'blue' : registration.presentingPaper === 'Offline' ? 'green' : 'default'}>
                                    {registration.presentingPaper}
                                </Tag>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-600">Residential Delegate</span>
                                <span className="font-semibold text-gray-800">{registration.residentialDelegate}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-600">Payment Status</span>
                                <Tag color="warning">Pending</Tag>
                                {/* Placeholder for payment status if integrated later */}
                            </div>
                        </div>
                    </Card>

                    <Card className="shadow-sm rounded-xl border-0 bg-[#f8fafc]">
                        <h4 className="font-bold text-gray-700 mb-4">Internal Meta</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Record Created</span>
                                <span className="font-mono text-xs">{formatDate(registration.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Last Updated</span>
                                <span className="font-mono text-xs">{formatDate(registration.updatedAt)}</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ConferenceRegistrationDetails;
