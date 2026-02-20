import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Card, Typography, List, Divider, Breadcrumb, Row, Col, Space, Timeline, Button, Alert, Image, Tabs, Empty, Avatar } from 'antd';
import {
    CalendarOutlined, UserOutlined, EnvironmentOutlined, HomeOutlined,
    FileTextOutlined, TeamOutlined, TrophyOutlined, AppstoreOutlined,
    HistoryOutlined, AuditOutlined, BuildOutlined, DeploymentUnitOutlined,
    SmileOutlined
} from '@ant-design/icons';
import { FaFileAlt } from 'react-icons/fa';
import { conferenceTemplateApi } from '../../services/api';
import { ImageURl } from '../../services/serviceApi';
import { decryptId } from '../../utils/crypto';
import SubmittedAbstractsModal from '../../components/SubmittedAbstractsModal';
import ConferenceEditors from '../../components/Conference/ConferenceEditors';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const ConferenceTemplateDetails = () => {
    const { id: encryptedId } = useParams();
    const id = decryptId(encryptedId);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [abstractsModalOpen, setAbstractsModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTemplateDetails();
        }
    }, [id]);

    const fetchTemplateDetails = async () => {
        try {
            const response = await conferenceTemplateApi.getById(id);
            if (response.data && response.data.success) {
                setTemplate(response.data.success);
            }
        } catch (error) {
            console.error('Error fetching template details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to safely parse JSON if it's a string, or return as is if object/array
    const parseData = (data, defaultVal = []) => {
        if (!data) return defaultVal;
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                return defaultVal;
            }
        }
        return data;
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spin size="large" tip="Loading details..." /></div>;
    if (!template) return <div className="p-8 text-center"><Title level={3}>Template not found</Title><Link to="/dashboard/conference-templates"><Button type="primary">Go Back</Button></Link></div>;

    const {
        description, conference_objectives,
        call_for_papers, guidelines,
        venue, important_dates,
        organizer_image, partner_image, venue_image, organizer_logo,
        keynote_speakers,
        key_benefits, themes,
        organizing_committee, steering_committee, review_board, organisers,
        program_schedule, past_conferences, who_should_join
    } = template;

    // Parsed Data
    const parsedVenue = parseData(venue, {});
    const parsedDates = parseData(important_dates, {});
    const parsedSpeakers = parseData(keynote_speakers, []);

    // For rich text sections that might be returned as strings (already HTML)
    const renderHTML = (content) => {
        if (!content) return <Text type="secondary">No information provided.</Text>;
        return <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: content }} />;
    };

    // Helper to attempt to convert standard google maps link to embed link
    const getEmbedUrl = (url) => {
        if (!url) return '';

        // 1. If it's already an embed link, return as is
        if (url.includes('google.com/maps/embed') || url.includes('output=embed')) {
            return url;
        }

        let query = '';

        // 2. Handle 'dir' (Directions) links - Extract Destination (2nd path segment after /dir/)
        // Format: /maps/dir/Source/Destination/@...
        if (url.includes('/maps/dir/')) {
            const parts = url.split('/dir/');
            if (parts.length > 1) {
                const afterDir = parts[1].split('/');
                // index 0 is source, index 1 is destination (usually)
                // If source is empty or current location, it might be different, but usually format is source/dest
                if (afterDir.length >= 2) {
                    query = afterDir[1];
                } else if (afterDir.length === 1) {
                    // Sometimes just one if source omitted? Unlikely for /dir/. 
                    // Let's try to take the last non-empty segment before @
                    const segments = parts[1].split('@')[0].split('/').filter(s => s);
                    query = segments[segments.length - 1];
                }
            }
        }
        // 3. Handle 'place' links - Extract Place Name
        // Format: /maps/place/Place+Name/@...
        else if (url.includes('/maps/place/')) {
            const parts = url.split('/place/');
            if (parts.length > 1) {
                // Take everything before the coordinates (@...) or next slash
                query = parts[1].split('/')[0];
            }
        }
        // 4. Handle 'search' links
        else if (url.includes('/maps/search/')) {
            const parts = url.split('/search/');
            if (parts.length > 1) {
                query = parts[1].split('/')[0];
            }
        }

        // Clean up query (remove @ coordinates if they leaked in, though logic above tries to avoid)
        if (query) {
            // Decode and re-encode to be safe, ensuring + are treated as spaces or kept
            // URL path usually has + for spaces. Content might be encoded.
            return `https://maps.google.com/maps?q=${query}&output=embed`;
        }

        // 5. Fallback: If we couldn't parse, try using the entire URL as the query (might work for some formats?)
        // Or if parsing failed, maybe just return original (will fail) or empty.
        // Let's try standard embed with the original url as fallback (unlikely to work if blocked)
        // Better fallback: If we have venue name available in scope, we could use that, but function is pure.
        // Let's return a 'search' embed with something derived from the url? 
        // No, let's just try to pass the venue name as a prop or rely on the user to fix the link if it fails.
        // But to be helpful, let's try to extract *anything* that looks like text.

        return url;
    };

    return (
        <div className="min-h-screen bg-gray-200 pb-8">
            <div className="pt-4 px-6 pb-2">
                <Breadcrumb
                    items={[
                        { href: '/dashboard', title: <HomeOutlined className="text-gray-500" /> },
                        { href: '/dashboard/conference-templates', title: <span className="text-gray-500">Conference Templates</span> },
                        { title: <span className="text-blue-600 font-medium">Details</span> },
                    ]}
                />
            </div>

            {/* Header */}
            <div className="mx-6 mt-2 mb-6 bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                <div className="flex justify-between items-start">
                    <Title level={3} className="mb-2 mt-0 text-gray-800">{template.conference?.name || 'Conference Name Unavailable'}</Title>
                    <Button
                        type="primary"
                        icon={<FaFileAlt />}
                        onClick={() => setAbstractsModalOpen(true)}
                        className="bg-[#12b48b] hover:bg-[#0e9a77] border-none flex items-center gap-2"
                        size="large"
                    >
                        Submitted Abstracts
                    </Button>
                </div>
                <div className="flex flex-col gap-4">
                    {parsedVenue.name && (
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-600 w-max">
                            <EnvironmentOutlined className="text-blue-500" />
                            {parsedVenue.name}
                            {parsedVenue.map_link && <a href={parsedVenue.map_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-blue-500 underline">(Open Map)</a>}
                        </span>
                    )}
                    {parsedVenue.map_link && (
                        <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 mt-2">
                            <iframe
                                src={getEmbedUrl(parsedVenue.map_link, parsedVenue.name)}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Venue Map"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6">
                <Row gutter={[24, 24]}>
                    {/* Left Column */}
                    <Col xs={24} lg={17}>
                        {/* Description */}
                        <Card className="mb-6 shadow-sm rounded-lg" title={<Space><FileTextOutlined className="text-blue-500" />About Conference</Space>}>
                            {renderHTML(description)}
                        </Card>

                        {/* Objectives */}
                        {conference_objectives && (
                            <Card className="mb-6 shadow-sm rounded-lg" title={<Space><TrophyOutlined className="text-amber-500" />Objectives</Space>}>
                                {renderHTML(conference_objectives)}
                            </Card>
                        )}

                        {/* Tabs: CFP, Guidelines, Themes, Who Should Join */}
                        <Card className="mb-6 shadow-sm rounded-lg" tabList={[
                            { key: 'cfp', tab: 'Call for Papers' },
                            { key: 'guidelines', tab: 'Guidelines' },
                            { key: 'themes', tab: 'Themes' },
                            { key: 'who_join', tab: 'Who Should Join' }
                        ]}
                            activeTabKey={loading ? '' : undefined} // managed by Card internal state if not controlled? Antd Card tabs need controlled state usually.
                        >
                            {/* We need state for tabs if we use Card tabs. or use Tabs component inside. Using Tabs component inside is easier. */}
                            <Tabs defaultActiveKey="1" items={[
                                { label: 'Call for Papers', key: '1', children: renderHTML(call_for_papers), icon: <FileTextOutlined /> },
                                { label: 'Guidelines', key: '2', children: renderHTML(guidelines), icon: <AuditOutlined /> },
                                { label: 'Themes', key: '3', children: renderHTML(themes), icon: <AppstoreOutlined /> },
                                { label: 'Who Should Join', key: '4', children: renderHTML(who_should_join), icon: <SmileOutlined /> },
                            ]} />
                        </Card>

                        {/* Keynote Speakers */}
                        {parsedSpeakers.length > 0 && (
                            <Card title={<Space><UserOutlined className="text-purple-500" />Keynote Speakers</Space>} className="mb-6 shadow-sm rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {parsedSpeakers.map((speaker, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            {speaker.image ? (
                                                <Image src={`${ImageURl}${speaker.image}`} alt={speaker.name} width={64} height={64} className="rounded object-cover" />
                                            ) : (
                                                <Avatar size={64} icon={<UserOutlined />} />
                                            )}
                                            <div>
                                                <Title level={5} className="!mb-0">{speaker.name}</Title>
                                                <Text className="text-xs uppercase font-bold text-indigo-600 block mb-1">{speaker.designation}</Text>
                                                <Paragraph className="text-sm text-gray-500 !mb-0" ellipsis={{ rows: 3, expandable: true }}>{speaker.about}</Paragraph>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Program Schedule (Check if JSON list or HTML string? API says JSON string for program_schedule, typically list of {time, session}) */}
                        {/* But user might have text? If it's pure JSON array, render list. */}
                        {(() => {
                            const prog = parseData(program_schedule);
                            if (Array.isArray(prog) && prog.length > 0) {
                                return (
                                    <Card title={<Space><CalendarOutlined className="text-green-500" />Program Schedule</Space>} className="mb-6 shadow-sm rounded-lg">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={prog}
                                            renderItem={item => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        title={<span className="text-blue-600">{item.time}</span>}
                                                        description={item.session}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                );
                            }
                            return null;
                        })()}

                        {/* Committees Section (HTML content) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Card title="Organisers" className="shadow-sm">{renderHTML(organisers)}</Card>
                            <Card title="Organizing Committee" className="shadow-sm">{renderHTML(organizing_committee)}</Card>
                        </div>

                        {/* Lists Section */}
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            {/* Steering & Review - Arrays */}
                            {(() => {
                                const steering = parseData(steering_committee);
                                const review = parseData(review_board);
                                if ((Array.isArray(steering) && steering.length > 0) || (Array.isArray(review) && review.length > 0)) {
                                    return (
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <Card title="Steering Committee" size="small">
                                                    <List size="small" dataSource={steering} renderItem={item => <List.Item>{item.name}</List.Item>} />
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card title="Review Board" size="small">
                                                    <List size="small" dataSource={review} renderItem={item => <List.Item>{item.name}</List.Item>} />
                                                </Card>
                                            </Col>
                                        </Row>
                                    )
                                }
                            })()}
                        </div>

                    </Col>

                    {/* Right Column */}
                    <Col xs={24} lg={7}>
                        {/* Conference Editors */}
                        <Card
                            title={<Space><TeamOutlined className="text-indigo-500" />Assigned Editors</Space>}
                            size="small"
                            className="mb-4 shadow-sm border-t-2 border-indigo-500"
                        >
                            <ConferenceEditors conferenceId={id} />
                        </Card>

                        {/* Gallery */}
                        <Card title="Gallery" size="small" className="mb-4 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                                {organizer_image && <div className="text-center"><Image src={`${ImageURl}${organizer_image}`} className="rounded object-cover h-20 w-full" /><Text className="text-[10px] uppercase">Organizer Banner</Text></div>}
                                {organizer_logo && <div className="text-center"><Image src={`${ImageURl}${organizer_logo}`} className="rounded object-cover h-20 w-full" /><Text className="text-[10px] uppercase">Organizer Logo</Text></div>}
                                {partner_image && <div className="text-center"><Image src={`${ImageURl}${partner_image}`} className="rounded object-cover h-20 w-full" /><Text className="text-[10px] uppercase">Partner</Text></div>}
                                {venue_image && <div className="col-span-2 text-center"><Image src={`${ImageURl}${venue_image}`} className="rounded object-cover h-32 w-full" /><Text className="text-[10px] uppercase">Venue</Text></div>}
                            </div>
                            {!organizer_image && !partner_image && !venue_image && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No images" />}
                        </Card>

                        {/* Important Dates */}
                        {Object.keys(parsedDates).length > 0 && (
                            <Card title="Important Dates" size="small" className="mb-4 shadow-sm border-t-2 border-red-500">
                                <Timeline className="mt-4">
                                    {Object.entries(parsedDates).map(([key, val]) => (
                                        <Timeline.Item key={key} color="red">
                                            <Text strong className="block text-gray-700 capitalize">{key.replace(/_/g, ' ')}</Text>
                                            <div className="text-xs text-gray-500">
                                                {val.startDate && <span>{moment(val.startDate).format("MMM Do")} - </span>}
                                                {val.lastDate && <span>{moment(val.lastDate).format("MMM Do, YYYY")}</span>}
                                            </div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>
                        )}

                        {/* Key Benefits */}
                        {(() => {
                            const benefits = parseData(key_benefits);
                            if (Array.isArray(benefits) && benefits.length > 0) {
                                return (
                                    <Card title="Key Benefits" size="small" className="mb-4 shadow-sm">
                                        <List
                                            size="small"
                                            dataSource={benefits}
                                            renderItem={item => (
                                                <List.Item>
                                                    <Space><TrophyOutlined className="text-yellow-500" /> {item}</Space>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                )
                            }
                        })()}

                        {/* Past Conferences */}
                        {(() => {
                            const past = parseData(past_conferences);
                            if (Array.isArray(past) && past.length > 0) {
                                return (
                                    <Card title="Past Conferences" size="small" className="mb-4 shadow-sm">
                                        <List
                                            size="small"
                                            dataSource={past}
                                            renderItem={item => (
                                                <List.Item>
                                                    <Space><HistoryOutlined /> {item.year}: {item.location}</Space>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                )
                            }
                        })()}

                    </Col>
                </Row>
            </div>

            {/* Submitted Abstracts Modal */}
            <SubmittedAbstractsModal
                open={abstractsModalOpen}
                onCancel={() => setAbstractsModalOpen(false)}
                conferenceId={id}
                conferenceName={template.conference?.name}
            />
        </div>
    );
};

export default ConferenceTemplateDetails;
