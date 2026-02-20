import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, DatePicker, Card, Row, Col, Space, Typography, Select, message, Divider } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { conferenceTemplateApi, conferenceApi } from '../../services/api';
import { ImageURl } from '../../services/serviceApi';
import { decryptId } from '../../utils/crypto';
import Swal from 'sweetalert2';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const EditConferenceTemplate = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [conferences, setConferences] = useState([]);
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const id = decryptId(encryptedId);

    // Store existing images to display previews
    const [existingImages, setExistingImages] = useState({
        organizer_image: null,
        organizer_logo: null,
        partner_image: null,
        venue_image: null
    });
    const [existingKeynoteImages, setExistingKeynoteImages] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Conferences for Dropdown
                const confResponse = await conferenceApi.getAll();
                if (confResponse.data && confResponse.data.success) {
                    setConferences(confResponse.data.success);
                }

                // Fetch Template Details
                const response = await conferenceTemplateApi.getById(id);
                if (response.data && response.data.success) {
                    const data = response.data.success;

                    // Parse JSON fields if they are strings
                    const parsedData = { ...data };
                    const jsonFields = [
                        'organizing_committee', 'key_benefits',
                        'who_should_join', 'program_schedule', 'themes',
                        'keynote_speakers', 'past_conferences', 'organisers',
                        'steering_committee', 'review_board', 'important_dates',
                        'venue'
                    ];

                    jsonFields.forEach(field => {
                        if (typeof parsedData[field] === 'string') {
                            try {
                                parsedData[field] = JSON.parse(parsedData[field]);
                            } catch (e) {
                                // console.error(`Error parsing ${field}`, e);
                                // For ReactQuill fields, if parse fails, it might be just a string (common for description), so keep it.
                                // But for arrays (benefits), fallback to [].
                                if (['key_benefits', 'past_conferences', 'program_schedule', 'keynote_speakers', 'steering_committee', 'review_board'].includes(field)) {
                                    parsedData[field] = [];
                                }
                            }
                        }
                    });

                    // Handle Dates: parsedData.important_dates is object { key: {startDate, lastDate} ... } or similar
                    // We need to convert strings to Moment objects for DatePicker
                    if (parsedData.important_dates) {
                        const dates = {};
                        Object.keys(parsedData.important_dates).forEach(key => {
                            if (parsedData.important_dates[key]) {
                                dates[key] = {
                                    startDate: parsedData.important_dates[key].startDate ? moment(parsedData.important_dates[key].startDate) : null,
                                    lastDate: parsedData.important_dates[key].lastDate ? moment(parsedData.important_dates[key].lastDate) : null
                                };
                            }
                        });
                        parsedData.important_dates = dates;
                    }

                    // Extract Existing Images and remove from parsedData to avoid Upload component error
                    setExistingImages({
                        organizer_image: parsedData.organizer_image,
                        organizer_logo: parsedData.organizer_logo,
                        partner_image: parsedData.partner_image,
                        venue_image: parsedData.venue_image
                    });
                    delete parsedData.organizer_image;
                    delete parsedData.organizer_logo;
                    delete parsedData.partner_image;
                    delete parsedData.venue_image;

                    // Handle Keynote Speakers Images
                    // Move 'image' string to 'existing_image' and delete 'image' key
                    if (Array.isArray(parsedData.keynote_speakers)) {
                        parsedData.keynote_speakers.forEach((s) => {
                            if (s.image) {
                                s.existing_image = s.image;
                                delete s.image; // Critical: remove string so Upload doesn't crash
                            }
                        });
                    }

                    form.setFieldsValue(parsedData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire('Error', 'Failed to fetch data', 'error');
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchData();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Simple Fields
            formData.append('conference_id', values.conference_id);
            formData.append('description', values.description || '');
            formData.append('conference_objectives', values.conference_objectives || '');
            formData.append('call_for_papers', values.call_for_papers || '');
            formData.append('guidelines', values.guidelines || '');
            formData.append('who_should_join', values.who_should_join || '');
            formData.append('themes', values.themes || '');
            formData.append('organisers', values.organisers || '');
            formData.append('organizing_committee', values.organizing_committee || '');

            // Venue
            const venueData = {
                name: values.venue?.name || '',
                map_link: values.venue?.map_link || ''
            };
            formData.append('venue', JSON.stringify(venueData));

            // Images (Only if new file uploaded)
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
                formData.append('venue_image', values.venue_image[0].originFileObj);
            }

            // Keynote Speakers
            const keynoteData = values.keynote_speakers || [];
            const speakersToSend = [];
            let imgIndex = 0;

            keynoteData.forEach((speaker, originalIndex) => {
                const sObj = {
                    name: speaker.name,
                    designation: speaker.designation,
                    about: speaker.about
                };

                // If new image
                if (speaker.image && speaker.image.length > 0 && speaker.image[0].originFileObj) {
                    formData.append('keynote_speaker_images', speaker.image[0].originFileObj);
                    sObj.image_index = imgIndex;
                    imgIndex++;
                    // Remove old image property to avoid confusion if we want to replace
                } else {
                    // Keep existing image if not replaced
                    // Check hidden field for existing image path
                    if (speaker.existing_image) {
                        sObj.image = speaker.existing_image;
                    }
                }
                speakersToSend.push(sObj);
            });
            formData.append('keynote_speakers', JSON.stringify(speakersToSend));

            // Important Dates
            if (values.important_dates) {
                const dates = {};
                const formatDate = (d) => d ? d.format('YYYY-MM-DD') : null;
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
            const jsonArrayFields = ['key_benefits', 'past_conferences', 'steering_committee', 'review_board'];
            jsonArrayFields.forEach(field => {
                if (values[field]) {
                    formData.append(field, JSON.stringify(values[field]));
                }
            });

            await conferenceTemplateApi.update(id, formData);
            Swal.fire('Success', 'Template updated successfully', 'success');
            navigate('/dashboard/conference-templates');

        } catch (error) {
            console.error('Error updating:', error);
            Swal.fire('Error', 'Failed to update template', 'error');
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

    if (fetching) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Title level={2}>Edit Conference Template</Title>
                    <Button onClick={() => navigate('/dashboard/conference-templates')}>Cancel</Button>
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
                                <Form.Item name="conference_id" label="Conference" rules={[{ required: true }]}>
                                    <Select placeholder="Select a conference">
                                        {conferences.map(conf => (
                                            <Option key={conf.id} value={conf.id}>{conf.name}</Option>
                                        ))}
                                    </Select>
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
                                <Form.Item name={['venue', 'name']} label="Venue Name">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name={['venue', 'map_link']} label="Map Link">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                {existingImages.venue_image && (
                                    <div className="mb-2">
                                        <Text type="secondary">Current Image:</Text>
                                        <img src={`${ImageURl}${existingImages.venue_image}`} alt="Venue" className="h-20 object-cover rounded block mt-1" />
                                    </div>
                                )}
                                <Form.Item
                                    name="venue_image"
                                    label="Replace Venue Image"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                >
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
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
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Card key={key} size="small" className="mb-4 bg-gray-50 border-dashed border-gray-300">
                                            <Row gutter={16}>
                                                <Col span={8}>
                                                    <Form.Item {...restField} name={[name, 'name']} label="Name" rules={[{ required: true }]}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item {...restField} name={[name, 'designation']} label="Designation">
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    {/* Hidden field to store existing image path for this item */}
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'existing_image']}
                                                        hidden
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                    {/* We can try to peek at the form value for this field to show preview? 
                                                        Antd doesn't easily let us read the value inside the map loop without `form.getFieldValue`.
                                                        But we can use a component to render preview.
                                                    */}
                                                    <Form.Item shouldUpdate>
                                                        {() => {
                                                            const imgPath = form.getFieldValue(['keynote_speakers', name, 'existing_image']);
                                                            // Also check if 'image' field has normal field "image" in api response
                                                            // When we setFieldsValue, we set 'image' key with the path string. 
                                                            // But now we bind 'image' to Upload.
                                                            // So we should have mapped api 'image' -> 'existing_image' before setFieldsValue.
                                                            return imgPath ? (
                                                                <div className="mb-2">
                                                                    <Text type="secondary" className="text-xs">Current:</Text>
                                                                    <img src={`${ImageURl}${imgPath}`} className="h-10 w-10 rounded-full object-cover ml-2" />
                                                                </div>
                                                            ) : null;
                                                        }}
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'image']}
                                                        label="Photo (Replace)"
                                                        valuePropName="fileList"
                                                        getValueFromEvent={normFile}
                                                    >
                                                        <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item {...restField} name={[name, 'about']} label="About">
                                                        <Input.TextArea rows={2} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} className="absolute top-2 right-2">
                                                Remove
                                            </Button>
                                        </Card>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Speaker</Button>
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
                                {existingImages.organizer_image && (
                                    <div className="mb-2"><img src={`${ImageURl}${existingImages.organizer_image}`} className="h-20 rounded" /></div>
                                )}
                                <Form.Item name="organizer_image" label="Organizer Banner" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}><Button icon={<UploadOutlined />}>Replace</Button></Upload>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {existingImages.organizer_logo && (
                                    <div className="mb-2"><img src={`${ImageURl}${existingImages.organizer_logo}`} className="h-20 rounded" /></div>
                                )}
                                <Form.Item name="organizer_logo" label="Organizer Logo" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}><Button icon={<UploadOutlined />}>Replace</Button></Upload>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {existingImages.partner_image && (
                                    <div className="mb-2"><img src={`${ImageURl}${existingImages.partner_image}`} className="h-20 rounded" /></div>
                                )}
                                <Form.Item name="partner_image" label="Partner Image" valuePropName="fileList" getValueFromEvent={normFile}>
                                    <Upload listType="picture" maxCount={1} beforeUpload={() => false}><Button icon={<UploadOutlined />}>Replace</Button></Upload>
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
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} className="flex mb-2" align="baseline">
                                            <Form.Item {...restField} name={name} rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add Benefit</Button>
                                </div>
                            )}
                        </Form.List>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Text strong>Steering Committee</Text>
                                <Form.List name="steering_committee">
                                    {(fields, { add, remove }) => (
                                        <div className="mt-2">
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space key={key} className="flex mb-2" align="baseline">
                                                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                                                        <Input placeholder="Name" />
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
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space key={key} className="flex mb-2" align="baseline">
                                                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                                                        <Input placeholder="Name" />
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
                                        {fields.map(({ key, name, ...restField }) => (
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
                        <Button size="large" onClick={() => navigate('/dashboard/conference-templates')}>Cancel</Button>
                        <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<SaveOutlined />}>Update Template</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditConferenceTemplate;
