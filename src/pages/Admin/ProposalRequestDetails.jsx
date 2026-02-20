import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Spin,
    Descriptions,
    Typography,
    Card,
    Button,
    Tag,
    message,
    Divider,
    Space,
    Row,
    Col,
    Select,
    Input,
} from "antd";
import {
    FaArrowLeft,
    FaDownload,
    FaUser,
    FaBuilding,
    FaCalendar,
    FaBook,
    FaCheckCircle,
    FaEdit,
    FaGlobe,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";
import { proposalRequestApi } from "../../services/api";
import { scriptUrl } from "../../services/serviceApi";

const { Title, Text, Paragraph } = Typography;

const ProposalRequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState(null);
    const [adminNotes, setAdminNotes] = useState("");

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await proposalRequestApi.getById(id);
            setProposal(response.data.data);
            setAdminNotes(response.data.data.adminNotes || "");
        } catch (error) {
            console.error("Error fetching proposal details:", error);
            message.error("Failed to fetch proposal details.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id, fetchDetails]);

    const handleUpdateStatus = async () => {
        if (!newStatus) {
            message.error("Please select a status");
            return;
        }

        setUpdating(true);
        try {
            await proposalRequestApi.updateStatus(id, newStatus, adminNotes);
            message.success("Proposal status updated successfully");
            fetchDetails();
            setNewStatus(null);
        } catch (error) {
            console.error("Error updating status:", error);
            message.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "gold";
            case "approved":
                return "green";
            case "rejected":
                return "red";
            case "under review":
                return "blue";
            case "completed":
                return "purple";
            default:
                return "default";
        }
    };

    const getPublicationTypeLabel = (type) => {
        const labels = {
            'proceedings_edited': 'Proceedings & Edited Book',
            'proceedings_only': 'Proceedings Only',
            'edited_only': 'Edited Book Only'
        };
        return labels[type] || type;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Spin size="large" tip="Loading proposal details..." />
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="p-12 text-center bg-gray-50 min-h-screen">
                <Title level={4}>Proposal not found</Title>
                <Button onClick={() => navigate("/dashboard/proposal-requests")}>
                    Back to List
                </Button>
            </div>
        );
    }

    const selectedServices = proposal.selectedServices || {};

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header / Navigation */}
            <div className="mb-6 flex justify-between items-center">
                <Button
                    icon={<FaArrowLeft />}
                    onClick={() => navigate("/dashboard/proposal-requests")}
                    type="text"
                    className="hover:bg-gray-200"
                >
                    Back to List
                </Button>
                <Space>
                    <Tag
                        color={getStatusColor(proposal.status)}
                        className="px-3 py-1 text-sm font-medium uppercase tracking-wide"
                    >
                        {proposal.status || "Unknown Status"}
                    </Tag>
                </Space>
            </div>

            <Row gutter={[24, 24]}>
                {/* LEFT COLUMN: Main Content */}
                <Col xs={24} lg={16}>
                    {/* Header Card */}
                    <Card className="shadow-sm border-0 mb-6 rounded-lg overflow-hidden">
                        <div className="border-l-4 border-[#12b48b] pl-4">
                            <Text
                                type="secondary"
                                className="block text-xs uppercase tracking-wider mb-1"
                            >
                                {proposal.proposalId}
                            </Text>
                            <Title
                                level={2}
                                className="mt-0 mb-2 leading-tight text-[#204066]"
                            >
                                {proposal.conferenceTitle}
                            </Title>
                            <Text type="secondary">
                                Submitted on{" "}
                                <span className="text-gray-800 font-medium">
                                    {formatDate(proposal.createdAt)}
                                </span>
                            </Text>
                        </div>
                    </Card>

                    {/* Requestor Details */}
                    <Card
                        title={
                            <span className="text-[#204066] font-semibold flex items-center gap-2">
                                <FaUser /> Requestor Details
                            </span>
                        }
                        className="shadow-sm border-0 mb-6 rounded-lg"
                    >
                        <Descriptions
                            bordered
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                            size="small"
                        >
                            <Descriptions.Item label="Full Name">
                                {proposal.title} {proposal.firstName} {proposal.lastName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                <a href={`mailto:${proposal.email}`} className="text-blue-600">
                                    {proposal.email}
                                </a>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mobile Number">
                                {proposal.countryCode} {proposal.mobileNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="Country">
                                {proposal.country}
                            </Descriptions.Item>
                            <Descriptions.Item label="Institutional Affiliation" span={2}>
                                {proposal.institutionalAffiliation}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Conference Details */}
                    <Card
                        title={
                            <span className="text-[#204066] font-semibold flex items-center gap-2">
                                <FaBuilding /> Conference Details
                            </span>
                        }
                        className="shadow-sm border-0 mb-6 rounded-lg"
                    >
                        <Descriptions
                            bordered
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                            size="small"
                        >
                            <Descriptions.Item label="Conference Title" span={2}>
                                {proposal.conferenceTitle}
                            </Descriptions.Item>
                            <Descriptions.Item label="Institute Name">
                                {proposal.instituteName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Website/Address">
                                {proposal.instituteWebsite ? (
                                    <a
                                        href={proposal.instituteWebsite.startsWith('http') ? proposal.instituteWebsite : `https://${proposal.instituteWebsite}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600"
                                    >
                                        {proposal.instituteWebsite}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Start Date">
                                <Tag icon={<FaCalendar />} color="blue">
                                    {formatDate(proposal.startDate)}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="End Date">
                                <Tag icon={<FaCalendar />} color="blue">
                                    {formatDate(proposal.endDate)}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Publication Type & Services */}
                    <Card
                        title={
                            <span className="text-[#204066] font-semibold flex items-center gap-2">
                                <FaBook /> Publication Type & Services
                            </span>
                        }
                        className="shadow-sm border-0 mb-6 rounded-lg"
                    >
                        <div className="mb-4">
                            <Text type="secondary" className="block mb-2">Publication Type</Text>
                            <Tag color="geekblue" className="text-base px-4 py-1">
                                {getPublicationTypeLabel(proposal.publicationType)}
                            </Tag>
                        </div>

                        <Divider plain orientation="left" className="m-0 mb-3 text-xs text-gray-400">
                            OPTIONAL SERVICES
                        </Divider>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className={`flex items-center gap-2 p-3 rounded border ${selectedServices.eCertificate ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <FaCheckCircle className={selectedServices.eCertificate ? 'text-green-500' : 'text-gray-300'} />
                                <Text className={selectedServices.eCertificate ? 'text-green-700' : 'text-gray-400'}>
                                    E-Certificate
                                </Text>
                            </div>
                            <div className={`flex items-center gap-2 p-3 rounded border ${selectedServices.designing ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <FaCheckCircle className={selectedServices.designing ? 'text-green-500' : 'text-gray-300'} />
                                <Text className={selectedServices.designing ? 'text-green-700' : 'text-gray-400'}>
                                    Designing
                                </Text>
                            </div>
                            <div className={`flex items-center gap-2 p-3 rounded border ${selectedServices.plagiarism ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <FaCheckCircle className={selectedServices.plagiarism ? 'text-green-500' : 'text-gray-300'} />
                                <Text className={selectedServices.plagiarism ? 'text-green-700' : 'text-gray-400'}>
                                    Plagiarism Tool
                                </Text>
                            </div>
                            <div className={`flex items-center gap-2 p-3 rounded border ${selectedServices.doi ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <FaCheckCircle className={selectedServices.doi ? 'text-green-500' : 'text-gray-300'} />
                                <Text className={selectedServices.doi ? 'text-green-700' : 'text-gray-400'}>
                                    DOI Services
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* Additional Comments */}
                    {proposal.additionalComments && (
                        <Card
                            title={
                                <span className="text-[#204066] font-semibold flex items-center gap-2">
                                    <FaEdit /> Additional Comments
                                </span>
                            }
                            className="shadow-sm border-0 mb-6 rounded-lg"
                        >
                            <Paragraph className="text-gray-700 leading-relaxed text-justify mb-0">
                                {proposal.additionalComments}
                            </Paragraph>
                        </Card>
                    )}
                </Col>

                {/* RIGHT COLUMN: Sidebar */}
                <Col xs={24} lg={8}>
                    {/* Quick Info Card */}
                    <Card className="shadow-sm border-0 mb-6 rounded-lg bg-[#f8fafc]">
                        <Title level={5} className="mb-4 text-[#204066]">
                            Quick Information
                        </Title>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <Text type="secondary">Proposal ID</Text>
                                <Text strong className="text-blue-600">{proposal.proposalId}</Text>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <Text type="secondary">Status</Text>
                                <Tag color={getStatusColor(proposal.status)}>
                                    {proposal.status}
                                </Tag>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <Text type="secondary">Submitted</Text>
                                <Text>{formatDate(proposal.createdAt)}</Text>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <Text type="secondary">Last Updated</Text>
                                <Text>{formatDate(proposal.updatedAt)}</Text>
                            </div>
                        </div>
                    </Card>

                    {/* Contact Info Card */}
                    <Card className="shadow-sm border-0 mb-6 rounded-lg">
                        <Title level={5} className="mb-4 text-[#204066]">
                            Contact Information
                        </Title>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaUser size={12} />
                                </div>
                                <div>
                                    <Text className="block text-sm font-medium">
                                        {proposal.title} {proposal.firstName} {proposal.lastName}
                                    </Text>
                                    <Text type="secondary" className="text-xs">Requestor</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaEnvelope size={12} />
                                </div>
                                <div className="overflow-hidden">
                                    <Text className="block text-sm font-medium truncate">
                                        {proposal.email}
                                    </Text>
                                    <Text type="secondary" className="text-xs">Email</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaPhone size={12} />
                                </div>
                                <div>
                                    <Text className="block text-sm font-medium">
                                        {proposal.countryCode} {proposal.mobileNumber}
                                    </Text>
                                    <Text type="secondary" className="text-xs">Phone</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaGlobe size={12} />
                                </div>
                                <div>
                                    <Text className="block text-sm font-medium">
                                        {proposal.country}
                                    </Text>
                                    <Text type="secondary" className="text-xs">Country</Text>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Attachment Card */}
                    <Card className="shadow-sm border-0 mb-6 rounded-lg">
                        <Title level={5} className="mb-4 text-[#204066]">
                            Attachment
                        </Title>
                        {proposal.attachmentFilePath ? (
                            <Button
                                type="primary"
                                block
                                icon={<FaDownload />}
                                href={`${scriptUrl}${proposal.attachmentFilePath}`}
                                target="_blank"
                                className="bg-[#12b48b] border-[#12b48b] hover:bg-[#0e9470] h-10"
                            >
                                {proposal.attachmentOriginalName || 'Download Attachment'}
                            </Button>
                        ) : (
                            <Text type="secondary" className="text-center block italic">
                                No attachment uploaded.
                            </Text>
                        )}
                    </Card>

                    {/* Status Update Card */}
                    <Card
                        title={
                            <span className="text-[#204066] font-semibold flex items-center gap-2">
                                <FaEdit /> Update Status
                            </span>
                        }
                        className="shadow-sm border-0 mb-6 rounded-lg"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <Text type="secondary">Current Status</Text>
                                <Tag
                                    color={getStatusColor(proposal.status)}
                                    className="m-0 px-3 py-1 text-sm uppercase font-semibold"
                                >
                                    {proposal.status}
                                </Tag>
                            </div>

                            <div>
                                <Text className="block mb-1 text-sm font-medium">
                                    New Status
                                </Text>
                                <Select
                                    placeholder="Select new status"
                                    style={{ width: "100%" }}
                                    value={newStatus}
                                    onChange={setNewStatus}
                                    options={[
                                        { value: "Pending", label: "Pending" },
                                        { value: "Under Review", label: "Under Review" },
                                        { value: "Approved", label: "Approved" },
                                        { value: "Rejected", label: "Rejected" },
                                        { value: "Completed", label: "Completed" },
                                    ]}
                                />
                            </div>

                            <div>
                                <Text className="block mb-1 text-sm font-medium">
                                    Admin Notes
                                </Text>
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Enter admin notes..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                />
                            </div>

                            <Button
                                type="primary"
                                block
                                onClick={handleUpdateStatus}
                                loading={updating}
                                disabled={!newStatus}
                                className="bg-[#12b48b] border-[#12b48b] hover:bg-[#0e9470]"
                            >
                                Update Status
                            </Button>

                            {proposal.adminNotes && (
                                <div className="mt-4">
                                    <Text type="secondary" className="block mb-1 text-xs uppercase tracking-wide">
                                        Previous Admin Notes
                                    </Text>
                                    <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700 text-sm">
                                        {proposal.adminNotes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProposalRequestDetails;
