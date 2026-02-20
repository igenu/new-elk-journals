import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Form, Upload, message } from 'antd';
import { Formik, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { journalCategoryApi } from '../services/api';

const { Option } = Select;

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
    image: Yup.mixed().required('Image is required'),
});

const AddJournalModal = ({ visible, onClose, onSubmit }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchCategories();
        }
    }, [visible]);

    const fetchCategories = async () => {
        try {
            const response = await journalCategoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to load journal categories');
        }
    };

    return (
        <Modal
            title="Add New Journal"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            maskClosable={false}
        >
            <Formik
                initialValues={{
                    title: '',
                    categoryId: '',
                    printIssn: '',
                    eIssn: '',
                    editors: '',
                    frequency: 'Monthly',
                    indexation: '',
                    startYear: new Date().getFullYear(),
                    endYear: new Date().getFullYear(),
                    mission: '',
                    aimsScope: '',
                    areasCovered: [''],
                    image: null,
                }}
                validationSchema={JournalSchema}
                onSubmit={(values, { resetForm }) => {
                    // Map categoryId to snake_case if needed by parent onSubmit or handle it there. 
                    // Usually onSubmit here just passes values. The parent likely handles API call.
                    // But wait, the previous code passed values directly to onSubmit prop.
                    // The user said "send the category id with the request body".
                    // I'll ensure categoryId is in values.
                    onSubmit(values);
                    resetForm();
                    onClose();
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Journal Title</label>
                                <Input name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} status={touched.title && errors.title ? 'error' : ''} />
                                {touched.title && errors.title && <div className="text-red-500 text-xs">{errors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Journal Category</label>
                                <Select
                                    name="categoryId"
                                    value={values.categoryId}
                                    onChange={(value) => setFieldValue('categoryId', value)}
                                    className="w-full"
                                    status={touched.categoryId && errors.categoryId ? 'error' : ''}
                                    placeholder="Select a category"
                                >
                                    {categories?.length > 0 && categories?.map(category => (
                                        <Option key={category.id} value={category.id}>{category.title}</Option>
                                    ))}
                                </Select>
                                {touched.categoryId && errors.categoryId && <div className="text-red-500 text-xs">{errors.categoryId}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Print ISSN</label>
                                <Input name="printIssn" value={values.printIssn} onChange={handleChange} onBlur={handleBlur} status={touched.printIssn && errors.printIssn ? 'error' : ''} />
                                {touched.printIssn && errors.printIssn && <div className="text-red-500 text-xs">{errors.printIssn}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">E ISSN</label>
                                <Input name="eIssn" value={values.eIssn} onChange={handleChange} onBlur={handleBlur} status={touched.eIssn && errors.eIssn ? 'error' : ''} />
                                {touched.eIssn && errors.eIssn && <div className="text-red-500 text-xs">{errors.eIssn}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Editors</label>
                                <Input name="editors" value={values.editors} onChange={handleChange} onBlur={handleBlur} status={touched.editors && errors.editors ? 'error' : ''} />
                                {touched.editors && errors.editors && <div className="text-red-500 text-xs">{errors.editors}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Frequency</label>
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Indexation</label>
                                <Input.TextArea name="indexation" value={values.indexation} onChange={handleChange} onBlur={handleBlur} />
                                {touched.indexation && errors.indexation && <div className="text-red-500 text-xs">{errors.indexation}</div>}
                            </div>
                            <div className="flex space-x-2">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">From Year</label>
                                    <Input type="number" name="startYear" value={values.startYear} onChange={handleChange} />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700">To Year</label>
                                    <Input type="number" name="endYear" value={values.endYear} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mission</label>
                            <ReactQuill theme="snow" value={values.mission} onChange={(content) => setFieldValue('mission', content)} />
                            {touched.mission && errors.mission && <div className="text-red-500 text-xs">{errors.mission}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Aims & Scope</label>
                            <ReactQuill theme="snow" value={values.aimsScope} onChange={(content) => setFieldValue('aimsScope', content)} />
                            {touched.aimsScope && errors.aimsScope && <div className="text-red-500 text-xs">{errors.aimsScope}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Areas Covered</label>
                            <FieldArray name="areasCovered">
                                {({ push, remove }) => (
                                    <div>
                                        {values?.areasCovered && values?.areasCovered.map((area, index) => (
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Journal Image</label>
                            <Upload
                                beforeUpload={(file) => {
                                    setFieldValue('image', file);
                                    return false; // Prevent automatic upload
                                }}
                                onRemove={() => setFieldValue('image', null)}
                                maxCount={1}
                                listType="picture"
                            >
                                <Button icon={<FaPlus />}>Upload Image</Button>
                            </Upload>
                            {touched.image && errors.image && <div className="text-red-500 text-xs">{errors.image}</div>}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Modal>
    );
};

export default AddJournalModal;
