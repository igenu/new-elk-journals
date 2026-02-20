import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, DatePicker, Card, Row, Col, Space, Typography, Select, message, Divider } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { conferenceTemplateApi, conferenceApi } from '../../services/api';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;
const { Option } = Select;

const AddConferenceTemplate = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [conferences, setConferences] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        try {
            const response = await conferenceApi.getAll();
            if (response.data && response.data.success) {
                setConferences(response.data.success);
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
            message.error('Failed to load conferences');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Simple text fields (handled by ReactQuill or Input)
            formData.append('conference_id', values.conference_id);
            formData.append('description', values.description || '');
            formData.append('conference_objectives', values.conference_objectives || '');
            formData.append('call_for_papers', values.call_for_papers || '');
            formData.append('guidelines', values.guidelines || '');
            formData.append('who_should_join', values.who_should_join || '');
            formData.append('themes', values.themes || '');
            formData.append('organisers', values.organisers || '');
            formData.append('organizing_committee', values.organizing_committee || '');
            formData.append('organizer_email', values.organizer_email || '');

            // Handle Venue (JSON: Name, Map Link)
            // Venue Image is handled separately as a file
            const venueData = {
                name: values.venue?.name || '',
                map_link: values.venue?.map_link || ''
            };
            formData.append('venue', JSON.stringify(venueData));

            // Append Images
            if (values.organizer_image && values.organizer_image.length > 0) {
                formData.append('organizer_image', values.organizer_image[0].originFileObj);
            }
            if (values.organizer_logo && values.organizer_logo.length > 0) {
                formData.append('organizer_logo', values.organizer_logo[0].originFileObj);
            }
            if (values.partner_image && values.partner_image.length > 0) {
                formData.append('partner_image', values.partner_image[0].originFileObj);
            }
            if (values.venue_image && values.venue_image.length > 0) {
                // ... existing venue_image logic ... (Wait, I need to match the replacement chunks carefully)
                formData.append('venue_image', values.venue_image[0].originFileObj);
            }

            // Append Keynote Speakers (JSON + Images)
            const keynoteSpeakersData = values.keynote_speakers || [];
            const speakersWithIndex = [];
            let imageIndexCounter = 0;

            keynoteSpeakersData.forEach((speaker) => {
                const speakerObj = {
                    name: speaker.name,
                    designation: speaker.designation,
                    about: speaker.about,
                };

                if (speaker.image && speaker.image.length > 0) {
                    formData.append('keynote_speaker_images', speaker.image[0].originFileObj);
                    speakerObj.image_index = imageIndexCounter;
                    imageIndexCounter++;
                } else {
                    speakerObj.image_index = -1;
                }
                speakersWithIndex.push(speakerObj);
            });
            formData.append('keynote_speakers', JSON.stringify(speakersWithIndex));


            // Handle Important Dates (Specific Keys)
            // API expects key: {startDate, lastDate}
            if (values.important_dates) {
                const dates = {};
                const formatDate = (date) => date ? date.format('YYYY-MM-DD') : null;

                ['abstract_submission', 'full_paper_submission', 'registration'].forEach(key => {
                    if (values.important_dates[key]) {
                        dates[key] = {
                            startDate: formatDate(values.important_dates[key].startDate),
                            lastDate: formatDate(values.important_dates[key].lastDate)
                        };
                    }
                });
                formData.append('important_dates', JSON.stringify(dates));
            }

            // Other JSON Arrays
            // key_benefits, past_conferences, steering_committee, review_board
            const jsonArrayFields = ['key_benefits', 'past_conferences', 'steering_committee', 'review_board'];
            jsonArrayFields.forEach(field => {
                if (values[field]) {
                    formData.append(field, JSON.stringify(values[field]));
                }
            });

            await conferenceTemplateApi.create(formData);
            Swal.fire({
                title: 'Success!',
                text: 'Conference Template created successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            navigate('/dashboard/conference-templates');
        } catch (error) {
            console.error('Error creating template:', error);
            Swal.fire('Error', 'Failed to create conference template. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Title level={2}>Create Conference Template</Title>
                    <Button onClick={() => navigate('/dashboard/conference-templates')}>
                        Cancel
                    </Button>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-6"
                >
                    {/* Basic Info */}
                    <Card title="Basic Information" className="shadow-sm">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item
                                    name="conference_id"
                                    label="Select Conference"
                                    rules={[{ required: true, message: 'Please select a conference' }]}
                                >
                                    <Select
                                        placeholder="Select a conference"
                                        loading={conferences.length === 0}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {conferences?.length > 0 && [...conferences].reverse().map(conf => (
                                            <Option key={conf.id} value={conf.id}>{conf.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="organizer_email"
                                    label="Organizer Email"
                                    rules={[
                                        { required: true, message: 'Please enter organizer email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input placeholder="organizer@example.com" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="description" label="Description">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                        <Form.Item name="conference_objectives" label="Conference Objectives">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                    </Card>

                    {/* Venue */}
                    <Card title="Venue Details" className="shadow-sm">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name={['venue', 'name']} label="Venue Name" rules={[{ required: true }]}>
                                    <Input placeholder="e.g. Grand Hall" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name={['venue', 'map_link']} label="Map Link (URL)">
                                    <Input placeholder="https://maps.google.com/..." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="venue_image"
                            label="Venue Image"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Venue Image</Button>
                            </Upload>
                        </Form.Item>
                    </Card>

                    {/* Important Dates */}
                    <Card title="Important Dates" className="shadow-sm">
                        <Row gutter={24}>
                            {['abstract_submission', 'full_paper_submission', 'registration'].map(key => (
                                <Col span={8} key={key}>
                                    <Card type="inner" title={key.replace(/_/g, ' ').toUpperCase()} size="small" className="bg-gray-50">
                                        <Form.Item name={['important_dates', key, 'startDate']} label="Start Date">
                                            <DatePicker className="w-full" />
                                        </Form.Item>
                                        <Form.Item name={['important_dates', key, 'lastDate']} label="Last Date">
                                            <DatePicker className="w-full" />
                                        </Form.Item>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>

                    {/* Keynote Speakers */}
                    <Card title="Keynote Speakers" className="shadow-sm">
                        <Form.List name="keynote_speakers">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields?.length > 0 && fields.map(({ key, name, ...restField }) => (
                                        <Card key={key} size="small" className="mb-4 bg-gray-50 border-dashed border-gray-300">
                                            <Row gutter={16}>
                                                <Col span={8}>
                                                    <Form.Item {...restField} name={[name, 'name']} label="Speaker Name" rules={[{ required: true }]}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item {...restField} name={[name, 'designation']} label="Designation">
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'image']}
                                                        label="Speaker Image"
                                                        valuePropName="fileList"
                                                        getValueFromEvent={normFile}
                                                    >
                                                        <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item {...restField} name={[name, 'about']} label="About Info">
                                                        <Input.TextArea rows={2} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} className="absolute top-2 right-2">
                                                Remove Speaker
                                            </Button>
                                        </Card>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Keynote Speaker
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Card>

                    {/* Rich Content Sections */}
                    <Card title="Details Content" className="shadow-sm">
                        <Form.Item name="who_should_join" label="Who Should Join">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                        <Form.Item name="themes" label="Themes">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                        <Form.Item name="organisers" label="Organisers">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                        <Form.Item name="organizing_committee" label="Organizing Committee">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                        <Form.Item name="call_for_papers" label="Call for Papers">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                        <Form.Item name="guidelines" label="Guidelines">
                            <ReactQuill theme="snow" modules={modules} />
                        </Form.Item>
                    </Card>

                    {/* Branding Images */}
                    <Card title="Branding Images" className="shadow-sm">
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    name="organizer_image"
                                    label="Organizer Banner"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                >
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Upload Organizer Banner</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="organizer_logo"
                                    label="Organizer Logo"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                >
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Upload Organizer Logo</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="partner_image"
                                    label="Partner Image"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                >
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Upload Partner Image</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Dynamic Lists */}
                    <Card title="Additional Information" className="shadow-sm">
                        <Text strong className="block mb-2">Key Benefits</Text>
                        <Form.List name="key_benefits">
                            {(fields, { add, remove }) => (
                                <div className="mb-6">
                                    {fields?.length > 0 && fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} className="flex mb-2" align="baseline">
                                            <Form.Item {...restField} name={name} rules={[{ required: true, message: 'Missing benefit' }]}>
                                                <Input placeholder="Benefit" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Add Benefit
                                    </Button>
                                </div>
                            )}
                        </Form.List>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Text strong>Steering Committee</Text>
                                <Form.List name="steering_committee">
                                    {(fields, { add, remove }) => (
                                        <div className="mt-2">
                                            {fields?.length > 0 && fields.map(({ key, name, ...restField }) => (
                                                <Space key={key} className="flex mb-2" align="baseline">
                                                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                                                        <Input placeholder="Member Name" />
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>Add Member</Button>
                                        </div>
                                    )}
                                </Form.List>
                            </Col>
                            <Col span={12}>
                                <Text strong>Review Board</Text>
                                <Form.List name="review_board">
                                    {(fields, { add, remove }) => (
                                        <div className="mt-2">
                                            {fields?.length > 0 && fields.map(({ key, name, ...restField }) => (
                                                <Space key={key} className="flex mb-2" align="baseline">
                                                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                                                        <Input placeholder="Member Name" />
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>Add Member</Button>
                                        </div>
                                    )}
                                </Form.List>
                            </Col>
                        </Row>
                        <Divider />
                        <div className="mt-4">
                            <Text strong>Past Conferences</Text>
                            <Form.List name="past_conferences">
                                {(fields, { add, remove }) => (
                                    <div className="mt-2">
                                        {fields?.length > 0 && fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} className="flex mb-2" align="baseline">
                                                <Form.Item {...restField} name={[name, 'year']} rules={[{ required: true }]}>
                                                    <Input placeholder="Year" />
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, 'location']} >
                                                    <Input placeholder="Location" />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>Add Past Conference</Button>
                                    </div>
                                )}
                            </Form.List>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button size="large" onClick={() => navigate('/dashboard/conference-templates')}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<SaveOutlined />}>
                            Save Template
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddConferenceTemplate;
