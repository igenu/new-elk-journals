import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Form, Input, Button, Select, Upload, message, Spin, Typography, Modal, Popconfirm } from 'antd';
import { Formik, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FaPlus, FaTrash, FaSave, FaPencilAlt, FaTimes } from 'react-icons/fa';
import EditorialBoard from '../components/EditorialBoard';
import BackButton from '../components/BackButton';
import { journalApi, journalCategoryApi, impactFactorApi } from '../services/api';
import { ImageURl } from '../services/serviceApi';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const JournalSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    categoryId: Yup.string().required('Required'),
    printIssn: Yup.string().required('Required'),
    eIssn: Yup.string().required('Required'),
    editors: Yup.string().required('Required'),
    frequency: Yup.string().required('Required'),
    indexation: Yup.string().required('Required'),
    startYear: Yup.number().required('Required'),
    endYear: Yup.number().required('Required'),
    mission: Yup.string().required('Required'),
    aimsScope: Yup.string().required('Required'),
    areasCovered: Yup.array().of(Yup.string().required('Required')).min(1, 'At least one area is required'),
    // image validation is optional on edit
});

const JournalDetails = () => {
    const { id } = useParams();
    const [journalId, setJournalId] = useState(null);
    const [editors, setEditors] = useState([]);
    const [impactFactors, setImpactFactors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [imageError, setImageError] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await journalCategoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchImpactFactors = async () => {
        if (!journalId) return;
        try {
            const response = await impactFactorApi.getByJournal(journalId);
            setImpactFactors(response.data);
        } catch (error) {
            console.error('Error fetching impact factors:', error);
        }
    };

    const fetchJournalDetails = async () => {
        try {
            const response = await journalApi.getById(id);
            const data = response.data;
            setJournalId(data.id);

            setInitialValues({
                title: data.title,
                categoryId: data.category_id || '', // Map backend snake_case to camelCase
                printIssn: data.print_issn,
                eIssn: data.e_issn,
                editors: data.editors || '',
                frequency: data.frequency,
                indexation: data.indexation || '',
                startYear: data.start_year,
                endYear: data.end_year,
                mission: data.mission || '',
                aimsScope: data.aims_scope || '',
                areasCovered: Array.isArray(data.areas_covered)
                    ? data.areas_covered
                    : (typeof data.areas_covered === 'string'
                        ? (data.areas_covered.startsWith('[')
                            ? JSON.parse(data.areas_covered)
                            : data.areas_covered.split(',').map(item => item.trim()))
                        : []),
                image: null, // Reset image field
            });
            setEditors(data.editorial_board || []);

            if (data.image) {
                // Construct server URL for image
                setImagePreview(`${ImageURl}${data.image}`);
                setImageError(false);
            }
        } catch (error) {
            message.error('Failed to fetch journal details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchJournalDetails();
    }, [id]);

    useEffect(() => {
        if (journalId) {
            fetchImpactFactors();
        }
    }, [journalId]);

    const handleUpdate = async (values, currentEditors) => {
        try {
            const formData = new FormData();

            // Append simple fields
            formData.append('title', values.title);
            formData.append('category_id', values.categoryId);
            formData.append('print_issn', values.printIssn);
            formData.append('e_issn', values.eIssn);
            formData.append('editors', values.editors);
            formData.append('frequency', values.frequency);
            formData.append('indexation', values.indexation);
            formData.append('start_year', values.startYear);
            formData.append('end_year', values.endYear);
            formData.append('mission', values.mission);
            formData.append('aims_scope', values.aimsScope);

            // Append array fields
            if (values.areasCovered) {
                values.areasCovered.forEach(area => formData.append('areas_covered[]', area));
            }

            // Append image if it's a File (new upload)
            if (values.image instanceof File) {
                formData.append('image', values.image);
            }

            await journalApi.update(id, formData);
            message.success('Journal updated successfully');
            setIsEditing(false); // Exit edit mode on success
            fetchJournalDetails(); // Refresh data
        } catch (error) {
            message.error('Failed to update journal');
        }
    };

    const handleSaveInfo = (values) => {
        handleUpdate(values, editors);
    };

    const handleAddEditor = async (editor) => {
        try {
            await journalApi.addEditor(id, editor);
            message.success('Editor added successfully');
            fetchJournalDetails(); // Refresh list from server
        } catch (error) {
            message.error('Failed to add editor');
        }
    };

    const handleDeleteEditor = async (editorId) => {
        try {
            await journalApi.deleteEditor(id, editorId);
            message.success('Editor removed successfully');
            fetchJournalDetails();
        } catch (error) {
            message.error('Failed to remove editor');
        }
    };

    const handleSaveEditors = (values) => {
        handleUpdate(values, editors);
    };

    const handleAddImpactFactor = async (values, { resetForm }) => {
        try {
            await impactFactorApi.add({
                journal_id: journalId,
                factors: values.factors
            });
            message.success('Impact factors added successfully');
            resetForm();
            setIsImpactModalOpen(false);
            fetchImpactFactors();
        } catch (error) {
            console.error(error);
            message.error('Failed to add impact factors');
        }
    };

    const handleDeleteImpactFactor = async (factorId) => {
        try {
            await impactFactorApi.delete(factorId);
            message.success('Impact factor deleted');
            fetchImpactFactors();
        } catch (error) {
            message.error('Failed to delete impact factor');
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.title : 'N/A';
    };

    if (loading) return <Spin className="flex justify-center mt-10" />;
    if (!initialValues) return <div>Error loading data</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Journal Details: {initialValues.title}</h1>
                <div className="flex gap-2">
                    {activeTab === '1' && (
                        !isEditing ? (
                            <Button type="primary" icon={<FaPencilAlt />} onClick={() => setIsEditing(true)}>
                                Edit Journal
                            </Button>
                        ) : (
                            <Button danger icon={<FaTimes />} onClick={() => setIsEditing(false)}>
                                Cancel Edit
                            </Button>
                        )
                    )}
                    <BackButton />
                </div>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={JournalSchema}
                onSubmit={handleSaveInfo}
                enableReinitialize
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                        <TabPane tab="Journal Information" key="1">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Journal Title</label>
                                        {isEditing ? (
                                            <>
                                                <Input name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} status={touched.title && errors.title ? 'error' : ''} />
                                                {touched.title && errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
                                            </>
                                        ) : (
                                            <Text strong>{values.title}</Text>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Journal Category</label>
                                        {isEditing ? (
                                            <>
                                                <Select
                                                    name="categoryId"
                                                    value={values.categoryId}
                                                    onChange={(value) => setFieldValue('categoryId', value)}
                                                    className="w-full"
                                                    status={touched.categoryId && errors.categoryId ? 'error' : ''}
                                                >
                                                    {categories?.length > 0 && categories.map(category => (
                                                        <Option key={category.id} value={category.id}>{category.title}</Option>
                                                    ))}
                                                </Select>
                                                {touched.categoryId && errors.categoryId && <div className="text-red-500 text-xs">{errors.categoryId}</div>}
                                            </>
                                        ) : (
                                            <Text>{getCategoryName(values.categoryId)}</Text>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Print ISSN</label>
                                        {isEditing ? (
                                            <>
                                                <Input name="printIssn" value={values.printIssn} onChange={handleChange} onBlur={handleBlur} status={touched.printIssn && errors.printIssn ? 'error' : ''} />
                                                {touched.printIssn && errors.printIssn && <div className="text-red-500 text-xs">{errors.printIssn}</div>}
                                            </>
                                        ) : (
                                            <Text>{values.printIssn}</Text>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">E ISSN</label>
                                        {isEditing ? (
                                            <>
                                                <Input name="eIssn" value={values.eIssn} onChange={handleChange} onBlur={handleBlur} status={touched.eIssn && errors.eIssn ? 'error' : ''} />
                                                {touched.eIssn && errors.eIssn && <div className="text-red-500 text-xs">{errors.eIssn}</div>}
                                            </>
                                        ) : (
                                            <Text>{values.eIssn}</Text>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Editors</label>
                                        {isEditing ? (
                                            <>
                                                <Input name="editors" value={values.editors} onChange={handleChange} onBlur={handleBlur} status={touched.editors && errors.editors ? 'error' : ''} />
                                                {touched.editors && errors.editors && <div className="text-red-500 text-xs">{errors.editors}</div>}
                                            </>
                                        ) : (
                                            <Text>{values.editors}</Text>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                                        {isEditing ? (
                                            <Select
                                                name="frequency"
                                                value={values.frequency}
                                                onChange={(value) => setFieldValue('frequency', value)}
                                                className="w-full"
                                            >
                                                {['Annual', 'Bi-annual', 'Tri-annual', 'Quarterly', 'Monthly', 'Bi-monthly'].map(freq => (
                                                    <Option key={freq} value={freq}>{freq}</Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Text>{values.frequency}</Text>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Indexation</label>
                                        {isEditing ? (
                                            <>
                                                <Input.TextArea name="indexation" value={values.indexation} onChange={handleChange} onBlur={handleBlur} />
                                                {touched.indexation && errors.indexation && <div className="text-red-500 text-xs">{errors.indexation}</div>}
                                            </>
                                        ) : (
                                            <Text>{values.indexation}</Text>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium text-gray-700">From Year</label>
                                            {isEditing ? (
                                                <Input type="number" name="startYear" value={values.startYear} onChange={handleChange} />
                                            ) : (
                                                <Text>{values.startYear}</Text>
                                            )}
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium text-gray-700">To Year</label>
                                            {isEditing ? (
                                                <Input type="number" name="endYear" value={values.endYear} onChange={handleChange} />
                                            ) : (
                                                <Text>{values.endYear}</Text>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mission</label>
                                    {isEditing ? (
                                        <>
                                            <ReactQuill theme="snow" value={values.mission} onChange={(content) => setFieldValue('mission', content)} />
                                            {touched.mission && errors.mission && <div className="text-red-500 text-xs">{errors.mission}</div>}
                                        </>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: values.mission }} className="border p-2 rounded bg-gray-50" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Aims & Scope</label>
                                    {isEditing ? (
                                        <>
                                            <ReactQuill theme="snow" value={values.aimsScope} onChange={(content) => setFieldValue('aimsScope', content)} />
                                            {touched.aimsScope && errors.aimsScope && <div className="text-red-500 text-xs">{errors.aimsScope}</div>}
                                        </>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: values.aimsScope }} className="border p-2 rounded bg-gray-50" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Areas Covered</label>
                                    {isEditing ? (
                                        <FieldArray name="areasCovered">
                                            {({ push, remove }) => (
                                                <div>
                                                    {values?.areasCovered?.length > 0 && values.areasCovered.map((area, index) => (
                                                        <div key={index} className="flex space-x-2 mb-2">
                                                            <Input
                                                                name={`areasCovered.${index}`}
                                                                value={area}
                                                                onChange={handleChange}
                                                            />
                                                            <Button type="dashed" danger icon={<FaTrash />} onClick={() => remove(index)} />
                                                        </div>
                                                    ))}
                                                    <Button type="dashed" icon={<FaPlus />} onClick={() => push('')} block>
                                                        Add Area
                                                    </Button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    ) : (
                                        <ul className="list-disc list-inside">
                                            {values?.areasCovered?.length > 0 && values.areasCovered.map((area, index) => (
                                                <li key={index}>{area}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Journal Image</label>
                                    {isEditing ? (
                                        <Upload
                                            beforeUpload={(file) => {
                                                setFieldValue('image', file);
                                                // Create local preview
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    setImagePreview(e.target.result);
                                                    setImageError(false);
                                                };
                                                reader.readAsDataURL(file);
                                                return false;
                                            }}
                                            onRemove={() => {
                                                setFieldValue('image', null);
                                                setImagePreview(null);
                                                setImageError(false);
                                            }}
                                            maxCount={1}
                                            listType="picture"
                                            showUploadList={false}
                                        >
                                            <Button icon={<FaPlus />}>Upload New Image</Button>
                                        </Upload>
                                    ) : null}
                                    {imagePreview && !imageError && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                                            <img
                                                src={imagePreview}
                                                alt="Journal Preview"
                                                className="max-w-xs h-auto rounded shadow-md border"
                                                onError={() => setImageError(true)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end mt-4">
                                        <Button type="primary" htmlType="submit" icon={<FaSave />}>Save Changes</Button>
                                    </div>
                                )}
                            </form>
                        </TabPane>
                        <TabPane tab="Editorial Board" key="2">
                            <EditorialBoard
                                editors={editors}
                                onAddEditor={handleAddEditor}
                                onDeleteEditor={handleDeleteEditor}
                                readOnly={!isEditing}
                            />
                        </TabPane>
                        <TabPane tab="Impact Factor" key="3">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                                    <h3 className="font-bold text-gray-700 m-0">Impact Factor History</h3>
                                    <Button type="primary" icon={<FaPlus />} onClick={() => setIsImpactModalOpen(true)}>
                                        Add Impact Factor
                                    </Button>
                                </div>

                                <div>
                                    {impactFactors.length === 0 ? (
                                        <div className="text-gray-500 italic text-center p-8 bg-gray-50 rounded">No impact factors recorded.</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {impactFactors.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded shadow-sm border border-l-4 border-l-[#12b48b] hover:shadow-md transition-shadow">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Year: <span className="font-bold text-[#204066] text-lg">{item.year}</span></div>
                                                        <div className="text-sm text-gray-500">Factor: <span className="text-[#12b48b] font-bold text-lg">{item.impact_factor}</span></div>
                                                    </div>
                                                    <Popconfirm
                                                        title="Are you sure you want to delete this impact factor?"
                                                        onConfirm={() => handleDeleteImpactFactor(item.id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button type="text" danger icon={<FaTrash />} className="hover:bg-red-50" />
                                                    </Popconfirm>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add Impact Factor Modal */}
                            <Modal
                                title="Add Impact Factors"
                                open={isImpactModalOpen}
                                onCancel={() => setIsImpactModalOpen(false)}
                                footer={null}
                                width={600}
                            >
                                <Formik
                                    initialValues={{ factors: [{ year: new Date().getFullYear(), impact_factor: '' }] }}
                                    validationSchema={Yup.object({
                                        factors: Yup.array().of(
                                            Yup.object().shape({
                                                year: Yup.number().required('Required').min(2011).max(2031),
                                                impact_factor: Yup.number().required('Required')
                                            })
                                        )
                                    })}
                                    onSubmit={handleAddImpactFactor}
                                >
                                    {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
                                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                            <FieldArray name="factors">
                                                {({ push, remove }) => (
                                                    <div className="space-y-4">
                                                        {values?.factors?.length > 0 && values.factors.map((factor, index) => (
                                                            <div key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded border">
                                                                <div className="flex-1">
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Year</label>
                                                                    <Select
                                                                        value={factor.year}
                                                                        onChange={(val) => setFieldValue(`factors.${index}.year`, val)}
                                                                        className="w-full"
                                                                        status={touched.factors?.[index]?.year && errors.factors?.[index]?.year ? 'error' : ''}
                                                                    >
                                                                        {Array.from({ length: 21 }, (_, i) => 2011 + i).map(year => (
                                                                            <Option key={year} value={year}>{year}</Option>
                                                                        ))}
                                                                    </Select>
                                                                    {touched.factors?.[index]?.year && errors.factors?.[index]?.year && (
                                                                        <div className="text-red-500 text-xs mt-1">{errors.factors[index].year}</div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="block text-xs font-bold text-gray-500 mb-1">Impact Factor</label>
                                                                    <Input
                                                                        name={`factors.${index}.impact_factor`}
                                                                        placeholder="e.g. 2.5"
                                                                        value={factor.impact_factor}
                                                                        onChange={handleChange}
                                                                        status={touched.factors?.[index]?.impact_factor && errors.factors?.[index]?.impact_factor ? 'error' : ''}
                                                                    />
                                                                    {touched.factors?.[index]?.impact_factor && errors.factors?.[index]?.impact_factor && (
                                                                        <div className="text-red-500 text-xs mt-1">{errors.factors[index].impact_factor}</div>
                                                                    )}
                                                                </div>
                                                                {values.factors.length > 1 && (
                                                                    <div className="mt-6">
                                                                        <Button type="text" danger icon={<FaTrash />} onClick={() => remove(index)} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                        <Button
                                                            type="dashed"
                                                            block
                                                            icon={<FaPlus />}
                                                            onClick={() => {
                                                                // Simple check to ensure last row has data before adding new
                                                                const lastRow = values.factors[values.factors.length - 1];
                                                                if (lastRow.year && lastRow.impact_factor) {
                                                                    push({ year: '', impact_factor: '' });
                                                                } else {
                                                                    message.warning('Please fill the current row before adding more.');
                                                                }
                                                            }}
                                                        >
                                                            Add Another Year
                                                        </Button>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            <div className="flex justify-end gap-2 pt-4 border-t">
                                                <Button onClick={() => setIsImpactModalOpen(false)}>Cancel</Button>
                                                <Button type="primary" htmlType="submit">Save Impact Factors</Button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            </Modal>
                        </TabPane>
                    </Tabs>
                )}
            </Formik>
        </div >
    );
};

export default JournalDetails;
