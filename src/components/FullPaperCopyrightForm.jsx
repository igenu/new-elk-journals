import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, message, Modal, Spin, Divider, Typography, Select, Card, Row, Col, Collapse } from 'antd';
import { FaPenNib, FaFileContract, FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaPlus, FaTrash, FaCity, FaGlobe, FaEye } from 'react-icons/fa';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment';
import { fullPaperCopyrightApi, journalApi } from '../services/api';
import FormRenderer from './DynamicForm/FormRenderer';

const { Title, Text } = Typography;
const { Option } = Select;

const FullPaperCopyrightForm = ({
    abstractId,
    abstractData,
    onCopyrightDataChange,
    onValidationChange
}) => {
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [journals, setJournals] = useState([]);
    const [journalsLoading, setJournalsLoading] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState(null);
    const [manuscriptTitle, setManuscriptTitle] = useState('');


    // Multiple authors support
    const [authors, setAuthors] = useState([{
        name: '',
        email: '',
        designation: '',
        institution: '',
        address: '',
        city: '',
        state: '',
        country: '',
        phone: '',
        signature: null,
        isPrefilledFrom: {} // Track which fields are pre-filled from backend
    }]);

    const [signModalVisible, setSignModalVisible] = useState(false);
    const [currentSigningAuthorIndex, setCurrentSigningAuthorIndex] = useState(null);
    const sigCanvasRef = useRef(null);

    useEffect(() => {
        loadTemplate();
        loadJournals();
    }, []);

    useEffect(() => {
        // Pre-fill first author info from abstractData
        if (abstractData?.author) {
            const author = abstractData.author;

            const prefilledAuthor = {
                name: `${author.firstName || ''} ${author.lastName || ''}`.trim(),
                email: author.email || '',
                designation: author.jobTitle || author.designation || '',
                institution: author.institute || author.organization || author.institution || '',
                address: author.address || '',
                city: author.city || '',
                state: author.state || '',
                country: author.country || '',
                phone: author.contactNumber || author.phone || '',
                signature: null,
                isPrefilledFrom: {
                    name: !!(author.firstName || author.lastName),
                    email: !!author.email,
                    designation: !!(author.jobTitle),
                    institution: !!(author.institute || author.organization),
                    address: !!author.address,
                    city: !!author.city,
                    state: !!author.state,
                    country: !!author.country,
                    phone: !!author.contactNumber,
                }
            };
            setAuthors([prefilledAuthor]);
        }

        // Pre-fill manuscript title from abstract
        if (abstractData?.title) {
            setManuscriptTitle(abstractData.title);
        }
    }, [abstractData]);

    useEffect(() => {
        // Notify parent of copyright data changes
        if (onCopyrightDataChange && template) {
            const signatures = {};
            authors.forEach((author, index) => {
                if (author.signature) {
                    signatures[index] = author.signature;
                }
            });

            onCopyrightDataChange({
                templateVersion: template.version,
                signatures,
                authors,
                journalId: selectedJournal?.id,
                journalName: selectedJournal?.title,
                manuscriptTitle,
            });
        }
    }, [authors, template, selectedJournal, manuscriptTitle]);

    useEffect(() => {
        // Validate and notify parent
        const hasAtLeastOneSignature = authors.some(a => a.signature !== null);
        const firstAuthorValid = authors[0]?.name?.trim() !== '' && authors[0]?.email?.trim() !== '';
        const hasJournal = selectedJournal !== null;
        const hasTitle = manuscriptTitle.trim() !== '';

        const isValid = hasAtLeastOneSignature && firstAuthorValid && hasJournal && hasTitle;

        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [authors, selectedJournal, manuscriptTitle]);

    const loadTemplate = async () => {
        setLoading(true);
        try {
            const response = await fullPaperCopyrightApi.getActiveTemplate();
            if (response.data.success) {
                const templateData = response.data.data;
                const schema = typeof templateData.schema === 'string'
                    ? JSON.parse(templateData.schema)
                    : templateData.schema;
                setTemplate({ ...templateData, schema });
            }
        } catch (error) {
            console.error('Failed to load copyright template:', error);
            message.error('Failed to load copyright form template');
        } finally {
            setLoading(false);
        }
    };

    const loadJournals = async () => {
        setJournalsLoading(true);
        try {
            const response = await journalApi.getAll();
            if (response.data) {
                setJournals(Array.isArray(response.data) ? response.data : response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to load journals:', error);
        } finally {
            setJournalsLoading(false);
        }
    };

    const handleAuthorChange = (index, field, value) => {
        setAuthors(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addAuthor = () => {
        setAuthors(prev => [...prev, {
            name: '',
            email: '',
            designation: '',
            institution: '',
            address: '',
            city: '',
            state: '',
            country: '',
            phone: '',
            signature: null,
            isPrefilledFrom: {} // New authors have no pre-filled fields
        }]);
    };

    const removeAuthor = (index) => {
        if (authors.length <= 1) {
            message.warning('At least one author is required');
            return;
        }
        setAuthors(prev => prev.filter((_, i) => i !== index));
    };

    const openSignModal = (index) => {
        setCurrentSigningAuthorIndex(index);
        setSignModalVisible(true);
    };

    const handleSignConfirm = () => {
        if (sigCanvasRef.current?.isEmpty()) {
            message.error('Please draw your signature');
            return;
        }
        const signatureImage = sigCanvasRef.current.getCanvas().toDataURL('image/png');

        setAuthors(prev => {
            const updated = [...prev];
            updated[currentSigningAuthorIndex] = {
                ...updated[currentSigningAuthorIndex],
                signature: {
                    signatureImage,
                    date: moment().format('DD/MM/YYYY'),
                    name: updated[currentSigningAuthorIndex].name,
                }
            };
            return updated;
        });

        setSignModalVisible(false);
        message.success('Signed successfully');
    };

    const clearSignature = (index) => {
        setAuthors(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], signature: null };
            return updated;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="full-paper-copyright-form">
            {/* Journal and Manuscript Title Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Title level={5} className="mb-4 flex items-center gap-2">
                    <FaFileContract className="text-[#12b48b]" />
                    Publication Details
                </Title>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To be published in the Journal <span className="text-red-500">*</span>
                            </label>
                            <Select
                                showSearch
                                placeholder="Select a journal"
                                optionFilterProp="children"
                                loading={journalsLoading}
                                value={selectedJournal?.id}
                                onChange={(value) => {
                                    const journal = journals.find(j => j.id === value);
                                    setSelectedJournal(journal);
                                }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                className="w-full"
                                size="large"
                            >
                                {journals.map(journal => (
                                    <Option key={journal.id} value={journal.id}>
                                        {journal.title}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title of the Manuscript <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={manuscriptTitle}
                                onChange={(e) => setManuscriptTitle(e.target.value)}
                                placeholder="Enter the title of your manuscript"
                                size="large"
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            <Divider />

            {/* Authors Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <Title level={5} className="m-0 flex items-center gap-2">
                        <FaUser className="text-[#12b48b]" />
                        Author Details
                    </Title>
                    <Button
                        type="dashed"
                        icon={<FaPlus />}
                        onClick={addAuthor}
                        className="flex items-center gap-1"
                    >
                        Add Author
                    </Button>
                </div>

                <Text type="secondary" className="block mb-4">
                    Please provide details for all authors. Each author must sign the copyright agreement.
                </Text>

                {authors.map((author, index) => (
                    <Card
                        key={index}
                        className="mb-4 border-l-4 border-l-[#12b48b]"
                        title={
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">
                                    Author {index + 1} {index === 0 && <span className="text-gray-400">(Primary)</span>}
                                </span>
                                {index > 0 && (
                                    <Button
                                        type="text"
                                        danger
                                        icon={<FaTrash />}
                                        onClick={() => removeAuthor(index)}
                                        size="small"
                                    />
                                )}
                            </div>
                        }
                        size="small"
                    >
                        <Row gutter={[16, 12]}>
                            <Col xs={24} md={12}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaUser className="inline mr-1" /> Full Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={author.name}
                                    onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                                    placeholder="Enter full name"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.name}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaEnvelope className="inline mr-1" /> Email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={author.email}
                                    onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                                    placeholder="Enter email"
                                    type="email"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.email}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaBuilding className="inline mr-1" /> Designation
                                </label>
                                <Input
                                    value={author.designation}
                                    onChange={(e) => handleAuthorChange(index, 'designation', e.target.value)}
                                    placeholder="e.g., Professor, Researcher"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.designation}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaBuilding className="inline mr-1" /> Institution/Organization
                                </label>
                                <Input
                                    value={author.institution}
                                    onChange={(e) => handleAuthorChange(index, 'institution', e.target.value)}
                                    placeholder="Enter institution"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.institution}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaCity className="inline mr-1" /> City
                                </label>
                                <Input
                                    value={author.city}
                                    onChange={(e) => handleAuthorChange(index, 'city', e.target.value)}
                                    placeholder="Enter city"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.city}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaMapMarkerAlt className="inline mr-1" /> State
                                </label>
                                <Input
                                    value={author.state}
                                    onChange={(e) => handleAuthorChange(index, 'state', e.target.value)}
                                    placeholder="Enter state"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.state}
                                />
                            </Col>
                            <Col xs={24} md={8}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaGlobe className="inline mr-1" /> Country
                                </label>
                                <Input
                                    value={author.country}
                                    onChange={(e) => handleAuthorChange(index, 'country', e.target.value)}
                                    placeholder="Enter country"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.country}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaPhone className="inline mr-1" /> Phone
                                </label>
                                <Input
                                    value={author.phone}
                                    onChange={(e) => handleAuthorChange(index, 'phone', e.target.value)}
                                    placeholder="Enter phone number"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.phone}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    <FaMapMarkerAlt className="inline mr-1" /> Address
                                </label>
                                <Input
                                    value={author.address}
                                    onChange={(e) => handleAuthorChange(index, 'address', e.target.value)}
                                    placeholder="Enter address"
                                    size="small"
                                    disabled={index === 0 && author.isPrefilledFrom?.address}
                                />
                            </Col>

                            {/* Inline Signature Section */}
                            <Col xs={24}>
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                        <FaPenNib className="inline mr-1" /> Signature <span className="text-red-500">*</span>
                                    </label>

                                    {author.signature ? (
                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-green-200">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={author.signature.signatureImage}
                                                    alt="Signature"
                                                    className="h-10 border border-gray-200 rounded"
                                                />
                                                <div>
                                                    <p className="text-xs font-medium text-green-700">Signed: {author.signature.name}</p>
                                                    <p className="text-xs text-gray-500">Date: {author.signature.date}</p>
                                                </div>
                                            </div>
                                            <Button size="small" danger onClick={() => clearSignature(index)}>
                                                Clear
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            type="primary"
                                            icon={<FaPenNib />}
                                            onClick={() => openSignModal(index)}
                                            className="bg-[#12b48b] hover:bg-[#0e9a77] border-none"
                                            size="small"
                                            disabled={!author.name.trim()}
                                        >
                                            Click to Sign
                                        </Button>
                                    )}
                                    {!author.name.trim() && !author.signature && (
                                        <p className="text-xs text-orange-500 mt-1">Please enter author name before signing</p>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>

            <Divider />

            {/* Copyright Agreement Preview Section */}
            <div className="mb-6">
                <Collapse
                    defaultActiveKey={['1']}
                    items={[
                        {
                            key: '1',
                            label: (
                                <div className="flex items-center gap-2">
                                    <FaEye className="text-[#12b48b]" />
                                    <span className="font-medium">Copyright Agreement Preview</span>
                                    <span className="text-xs text-gray-400 ml-2">(Live preview - updates as you fill the form)</span>
                                </div>
                            ),
                            children: (
                                <div className="border border-gray-200 rounded-lg p-4 bg-white max-h-[400px] overflow-y-auto">
                                    {template?.schema ? (
                                        <>
                                            {(() => {
                                                const previewData = {
                                                    paper_title: manuscriptTitle || 'Title of Manuscript',
                                                    journal: selectedJournal || { title: 'Journal Name' },
                                                    conference: selectedJournal?.title || abstractData?.conference?.name || 'Conference/Journal Name',
                                                    authors_formatted: authors.map(a => a.name || 'Author Name').join(', '),
                                                    authors: authors.map((a, idx) => ({
                                                        first_name: a.name?.split(' ')[0] || '',
                                                        last_name: a.name?.split(' ').slice(1).join(' ') || '',
                                                        full_name: a.name || `Author ${idx + 1}`,
                                                        email: a.email || '',
                                                        designation: a.designation || '',
                                                        institution: a.institution || '',
                                                        city: a.city || '',
                                                        state: a.state || '',
                                                        country: a.country || '',
                                                        phone: a.phone || '',
                                                        address: a.address || '',
                                                        is_corresponding_author: idx === 0, // Author 1 is corresponding author
                                                    })),
                                                };
                                                return null;
                                            })()}
                                            <FormRenderer
                                                schema={(() => {
                                                    // Create a modified schema that includes journal and manuscript title fields
                                                    const modifiedSchema = { ...template.schema };
                                                    modifiedSchema.sections = [...template.schema.sections];

                                                    // Check if we need to add journal/manuscript info section
                                                    const hasJournalField = template.schema.sections.some(section =>
                                                        section.type === 'key_value_grid' &&
                                                        section.fields?.some(field =>
                                                            field.key === 'journal' || field.key === 'conference' || field.key === 'paper_title'
                                                        )
                                                    );

                                                    if (!hasJournalField) {
                                                        // Add a new section at the beginning for journal and manuscript info
                                                        modifiedSchema.sections.unshift({
                                                            id: 'manuscript_info',
                                                            type: 'key_value_grid',
                                                            fields: [
                                                                {
                                                                    label: 'Title of the Manuscript',
                                                                    key: 'paper_title',
                                                                    boldValue: true
                                                                },
                                                                {
                                                                    label: 'To be published in the Journal',
                                                                    key: 'journal',
                                                                    boldValue: true,
                                                                    highlight: true
                                                                }
                                                            ]
                                                        });
                                                    }

                                                    return modifiedSchema;
                                                })()}
                                                data={{
                                                    paper_title: manuscriptTitle || 'Title of Manuscript',
                                                    journal: selectedJournal || { title: 'Journal Name' },
                                                    conference: selectedJournal?.title || abstractData?.conference?.name || 'Conference/Journal Name',
                                                    authors_formatted: authors.map(a => a.name || 'Author Name').join(', '),
                                                    authors: authors.map((a, idx) => ({
                                                        first_name: a.name?.split(' ')[0] || '',
                                                        last_name: a.name?.split(' ').slice(1).join(' ') || '',
                                                        full_name: a.name || `Author ${idx + 1}`,
                                                        email: a.email || '',
                                                        designation: a.designation || '',
                                                        institution: a.institution || '',
                                                        city: a.city || '',
                                                        state: a.state || '',
                                                        country: a.country || '',
                                                        phone: a.phone || '',
                                                        address: a.address || '',
                                                        is_corresponding_author: idx === 0, // Author 1 is corresponding author
                                                    })),
                                                }}
                                                signatures={authors.reduce((acc, author, idx) => {
                                                    if (author.signature) {
                                                        acc[idx] = author.signature;
                                                    }
                                                    return acc;
                                                }, {})}
                                                onSign={null}
                                            />
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FaFileContract className="text-5xl mb-4 mx-auto text-gray-300" />
                                            <Title level={5} className="text-gray-600">Copyright Transfer Agreement</Title>
                                            <div className="text-left mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 leading-relaxed">
                                                <p className="mb-4">
                                                    <strong>To be published in the Journal:</strong>{' '}
                                                    <span className="text-[#12b48b]">{selectedJournal?.title || '________________'}</span>
                                                </p>
                                                <p className="mb-4">
                                                    <strong>Title of the Manuscript:</strong>{' '}
                                                    <span className="text-[#12b48b]">{manuscriptTitle || '________________'}</span>
                                                </p>
                                                <Divider className="my-4" />
                                                <p className="mb-4 font-semibold">Author Details:</p>
                                                {authors.map((author, idx) => (
                                                    <div key={idx} className="mb-4 p-3 bg-white rounded border border-gray-200">
                                                        <p className="text-xs text-gray-500 mb-1">Author {idx + 1}</p>
                                                        <p><strong>Name:</strong> {author.name || '________________'}</p>
                                                        <p><strong>Email:</strong> {author.email || '________________'}</p>
                                                        <p><strong>Designation:</strong> {author.designation || '________________'}</p>
                                                        <p><strong>Institution:</strong> {author.institution || '________________'}</p>
                                                        <p><strong>City:</strong> {author.city || '____'}, <strong>State:</strong> {author.state || '____'}, <strong>Country:</strong> {author.country || '____'}</p>
                                                        <p><strong>Phone:</strong> {author.phone || '________________'}</p>
                                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                                            <p><strong>Signature:</strong></p>
                                                            {author.signature ? (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <img src={author.signature.signatureImage} alt="Signature" className="h-8 border rounded" />
                                                                    <span className="text-xs text-gray-500">Date: {author.signature.date}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">Not signed yet</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <Divider className="my-4" />
                                                <p className="text-xs text-gray-500 italic">
                                                    By signing this agreement, I/we hereby transfer the copyright of the above-mentioned
                                                    manuscript to the publisher. I/we confirm that the manuscript is original, has not been
                                                    published elsewhere, and is not under consideration for publication in any other journal.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Signature Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <FaPenNib className="text-[#12b48b]" />
                        <span>E-Sign Copyright Agreement</span>
                    </div>
                }
                open={signModalVisible}
                onOk={handleSignConfirm}
                onCancel={() => setSignModalVisible(false)}
                okText="Confirm Signature"
                okButtonProps={{ className: 'bg-[#12b48b] hover:bg-[#0e9f7a]' }}
                centered
                width={520}
            >
                <div className="py-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100 flex items-start gap-3">
                        <FaFileContract className="text-blue-500 text-xl mt-1" />
                        <div className="text-sm text-blue-800">
                            <strong>{authors[currentSigningAuthorIndex]?.name || 'Author'}</strong> is signing the copyright transfer agreement for:
                            <strong className="block mt-1">{manuscriptTitle || 'Full Paper'}</strong>
                        </div>
                    </div>

                    <p className="mb-2 font-semibold">Draw your signature below:</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-3">
                        <SignatureCanvas
                            ref={sigCanvasRef}
                            penColor="black"
                            canvasProps={{
                                width: 470,
                                height: 150,
                                className: 'signature-canvas w-full'
                            }}
                        />
                    </div>
                    <Button
                        onClick={() => sigCanvasRef.current?.clear()}
                        size="small"
                        className="mb-3"
                    >
                        Clear Signature
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                        This signature will be stamped with today's date: {moment().format('DD MMM, YYYY')}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default FullPaperCopyrightForm;
