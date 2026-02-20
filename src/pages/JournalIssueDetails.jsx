import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Input, Select, Button, message, Spin, Typography } from 'antd';
import { FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { journalIssueApi, journalApi } from '../services/api';
import BackButton from '../components/BackButton';

const { Title, Text } = Typography;
const { Option } = Select;

// Validation Schema
const JournalIssueSchema = Yup.object().shape({
    journal_id: Yup.number()
        .required('Journal Title is required')
        .positive('Please select a valid journal')
        .integer('Please select a valid journal'),
    volume: Yup.string()
        .required('Volume is required')
        .min(1, 'Volume must be at least 1 character')
        .max(50, 'Volume cannot exceed 50 characters'),
    issue_no: Yup.string()
        .required('Issue Number is required')
        .min(1, 'Issue Number must be at least 1 character')
        .max(50, 'Issue Number cannot exceed 50 characters'),
    year: Yup.number()
        .required('Year is required')
        .min(1900, 'Year must be 1900 or later')
        .max(2100, 'Year cannot be more than 2100')
        .integer('Year must be an integer'),
});

const JournalIssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const [journals, setJournals] = useState([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [issueResponse, journalsResponse] = await Promise.all([
                journalIssueApi.getById(id),
                journalApi.getAll(),
            ]);

            // Handle API response format { success: true, data: {...} }
            const issueData = issueResponse.data.data || issueResponse.data;
            const journalsData = journalsResponse.data.data || journalsResponse.data;

            setInitialValues({
                journal_id: issueData.journal_id,
                volume: issueData.volume,
                issue_no: issueData.issue_no,
                year: issueData.year,
                journal_title: issueData.journal?.title || 'N/A', // From association
            });
            setJournals(journalsData);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to fetch journal issue details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values) => {
        try {
            const updateData = {
                journal_id: values.journal_id,
                volume: values.volume,
                issue_no: values.issue_no,
                year: values.year,
            };

            const response = await journalIssueApi.update(id, updateData);
            message.success(response.data.message || 'Journal issue updated successfully');
            setIsEditing(false);
            fetchData(); // Refresh data
        } catch (error) {
            // Handle validation errors
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => {
                    message.error(`${err.field}: ${err.message}`);
                });
            } else {
                message.error(error.response?.data?.message || 'Failed to update journal issue');
            }
        }
    };

    // Generate year options
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear + 10; year >= 1900; year--) {
        yearOptions.push(year);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!initialValues) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Text type="danger">Error loading journal issue details</Text>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
            <Card className=" shadow-xl rounded-lg border-0">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <Title level={2} className="!mb-0 text-gray-800">
                        Journal Issue Details
                    </Title>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button
                                type="primary"
                                icon={<FaPencilAlt />}
                                onClick={() => setIsEditing(true)}
                                size="large"
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                Edit Issue
                            </Button>
                        ) : (
                            <Button
                                danger
                                icon={<FaTimes />}
                                onClick={() => setIsEditing(false)}
                                size="large"
                            >
                                Cancel Edit
                            </Button>
                        )}
                        <BackButton />
                    </div>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={JournalIssueSchema}
                    onSubmit={handleUpdate}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Journal Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Journal Title <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <>
                                        <Select
                                            showSearch
                                            placeholder="Select a journal"
                                            value={values.journal_id}
                                            onChange={(value) => setFieldValue('journal_id', value)}
                                            onBlur={handleBlur}
                                            className="w-full"
                                            size="large"
                                            status={touched.journal_id && errors.journal_id ? 'error' : ''}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {journals?.length > 0 && journals.map((journal) => (
                                                <Option key={journal.id} value={journal.id}>
                                                    {journal.title}
                                                </Option>
                                            ))}
                                        </Select>
                                        {touched.journal_id && errors.journal_id && (
                                            <div className="text-red-500 text-xs mt-1">{errors.journal_id}</div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <Text strong className="text-base">{values.journal_title}</Text>
                                    </div>
                                )}
                            </div>

                            {/* Volume and Issue Number Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Volume */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Volume <span className="text-red-500">*</span>
                                    </label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                name="volume"
                                                type="text"
                                                placeholder="e.g., 10, 1-2, Special Issue"
                                                value={values.volume}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                size="large"
                                                status={touched.volume && errors.volume ? 'error' : ''}
                                            />
                                            {touched.volume && errors.volume && (
                                                <div className="text-red-500 text-xs mt-1">{errors.volume}</div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <Text className="text-base">{values.volume}</Text>
                                        </div>
                                    )}
                                </div>

                                {/* Issue Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Issue No. <span className="text-red-500">*</span>
                                    </label>
                                    {isEditing ? (
                                        <>
                                            <Input
                                                name="issue_no"
                                                type="text"
                                                placeholder="e.g., 1, 2, 1-2"
                                                value={values.issue_no}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                size="large"
                                                status={touched.issue_no && errors.issue_no ? 'error' : ''}
                                            />
                                            {touched.issue_no && errors.issue_no && (
                                                <div className="text-red-500 text-xs mt-1">{errors.issue_no}</div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <Text className="text-base">{values.issue_no}</Text>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Year <span className="text-red-500">*</span>
                                </label>
                                {isEditing ? (
                                    <>
                                        <Select
                                            showSearch
                                            placeholder="Select year"
                                            value={values.year}
                                            onChange={(value) => setFieldValue('year', value)}
                                            onBlur={handleBlur}
                                            className="w-full"
                                            size="large"
                                            status={touched.year && errors.year ? 'error' : ''}
                                        >
                                            {yearOptions?.length > 0 && yearOptions.map((year) => (
                                                <Option key={year} value={year}>
                                                    {year}
                                                </Option>
                                            ))}
                                        </Select>
                                        {touched.year && errors.year && (
                                            <div className="text-red-500 text-xs mt-1">{errors.year}</div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <Text className="text-base">{values.year}</Text>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons - Only show when editing */}
                            {isEditing && (
                                <div className="flex justify-end pt-6 border-t border-gray-200">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        icon={<FaSave />}
                                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 px-6"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default JournalIssueDetails;
