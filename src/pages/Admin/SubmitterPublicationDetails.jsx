import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Typography, Button, Tag, message, Row, Col, Descriptions, Divider } from 'antd';
import { FaArrowLeft, FaFilePdf, FaBook, FaCalendar, FaUser } from 'react-icons/fa';
import { publicationApi } from '../../services/api';
import { ImageURl, scriptUrl } from '../../services/serviceApi';
import { decryptId } from '../../utils/idEncryption';

const { Title, Text, Paragraph } = Typography;

const SubmitterPublicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [publication, setPublication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            const decId = decryptId(id);
            if (!decId) {
                message.error("Invalid Publication ID");
                navigate('/dashboard/view-submitter-publications');
                return;
            }

            try {
                const response = await publicationApi.getById(decId);
                setPublication(response.data.data);
            } catch (error) {
                console.error("Error fetching publication details:", error);
                message.error("Failed to fetch publication details.");
                // navigate('/dashboard/view-submitter-publications'); // Optional: redirect on error
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Spin size="large" tip="Loading publication details..." />
            </div>
        );
    }

    if (!publication) {
        return (
            <div className="p-12 text-center bg-gray-50 min-h-screen">
                <Title level={4}>Publication not found</Title>
                <Button onClick={() => navigate('/dashboard/view-submitter-publications')}>Back to List</Button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="mb-6 flex justify-between items-center">
                <Button
                    icon={<FaArrowLeft />}
                    onClick={() => navigate('/dashboard/view-submitter-publications')}
                    type="text"
                    className="hover:bg-gray-200"
                >
                    Back to List
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card className="shadow-sm border-0 mb-6 rounded-lg">
                        <div className="border-l-4 border-blue-500 pl-4 mb-4">
                            <Text type="secondary" className="block text-xs uppercase tracking-wider mb-1">
                                {publication.manuscript_id}
                            </Text>
                            <Title level={2} className="mt-0 mb-2 leading-tight text-[#204066]">
                                {publication.title}
                            </Title>
                            <div className="flex items-center gap-2 mt-2">
                                <FaUser className="text-gray-400" />
                                <Text className="text-gray-600 font-medium">{publication.author_name}</Text>
                            </div>
                        </div>

                        {publication.doi && (
                            <div className="mb-4">
                                <Text strong>DOI: </Text>
                                <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {publication.doi}
                                </a>
                            </div>
                        )}

                        <Divider />

                        <Title level={4}>Abstract</Title>
                        <Paragraph className="text-gray-700 leading-relaxed text-justify">
                            {publication.abstract_description || "No abstract available."}
                        </Paragraph>

                        {publication.abstract_keywords && (
                            <div className="mt-4">
                                <Text strong className="mr-2">Keywords:</Text>
                                {publication.abstract_keywords.split(',').map((kw, i) => (
                                    <Tag key={i}>{kw.trim()}</Tag>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card title="Author Affiliations" className="shadow-sm border-0 mb-6 rounded-lg">
                        <Paragraph>
                            {publication.author_affiliations || "N/A"}
                        </Paragraph>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card className="shadow-sm border-0 mb-6 rounded-lg bg-white">
                        <Title level={5} className="mb-4 text-[#204066] flex items-center gap-2">
                            <FaBook /> Journal Details
                        </Title>
                        <div className="space-y-3">
                            <div>
                                <Text type="secondary" className="block text-xs">Journal Title</Text>
                                <Text strong>{publication.journal?.title}</Text>
                            </div>
                            <div>
                                <Text type="secondary" className="block text-xs">ISSN</Text>
                                <Text>{publication.journal?.print_issn} (Print), {publication.journal?.e_issn} (Electronic)</Text>
                            </div>
                        </div>
                    </Card>

                    <Card className="shadow-sm border-0 mb-6 rounded-lg bg-white">
                        <Title level={5} className="mb-4 text-[#204066] flex items-center gap-2">
                            <FaCalendar /> Issue Details
                        </Title>
                        <div className="space-y-3">
                            <div>
                                <Text type="secondary" className="block text-xs">Volume & Issue</Text>
                                <Text strong>Vol {publication.issue?.volume}, Issue {publication.issue?.issue_no}</Text>
                            </div>
                            <div>
                                <Text type="secondary" className="block text-xs">Year</Text>
                                <Text>{publication.issue?.year}</Text>
                            </div>
                            {publication.pages && (
                                <div>
                                    <Text type="secondary" className="block text-xs">Pages</Text>
                                    <Text>{publication.pages}</Text>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="shadow-sm border-0 mb-6 rounded-lg">
                        <Title level={5} className="mb-4">Full Text</Title>
                        {publication.pdf_path ? (
                            <Button
                                type="primary"
                                block
                                icon={<FaFilePdf />}
                                href={`${ImageURl}${publication?.pdf_path}`}
                                target="_blank"
                                size="large"
                            >
                                Download PDF
                            </Button>
                        ) : (
                            <Text type="secondary">No PDF available</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SubmitterPublicationDetails;
