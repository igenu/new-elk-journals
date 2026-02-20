import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Card, message, Typography } from 'antd';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { journalIssueApi, journalApi } from '../services/api';
import BackButton from '../components/BackButton';

const { Title } = Typography;
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

const AddJournalIssue = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJournals();
    }, []);

    const fetchJournals = async () => {
        try {
            const response = await journalApi.getAll();
            // Handle API response format
            const journalsData = response.data.data || response.data;
            setJournals(journalsData);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to fetch journals');
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await journalIssueApi.create(values);
            message.success(response.data.message || 'Journal issue added successfully');
            navigate('/dashboard/journal-issues');
        } catch (error) {
            // Handle validation errors
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => {
                    message.error(`${err.field}: ${err.message}`);
                });
            } else {
                message.error(error.response?.data?.message || 'Failed to add journal issue');
            }
        } finally {
            setLoading(false);
        }
    };

    // Generate year options (from 1900 to current year + 10)
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear + 10; year >= 1900; year--) {
        yearOptions.push(year);
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
            <Card className=" shadow-xl rounded-lg border-0">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <Title level={2} className="!mb-0 text-gray-800">
                        Add New Journal Issue
                    </Title>
                    <BackButton />
                </div>

                <Formik
                    initialValues={{
                        journal_id: '',
                        volume: '',
                        issue_no: '',
                        year: currentYear,
                    }}
                    validationSchema={JournalIssueSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Journal Title Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Journal Title <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    showSearch
                                    placeholder="Select a journal"
                                    value={values.journal_id || undefined}
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
                            </div>

                            {/* Volume and Issue Number Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Volume */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Volume <span className="text-red-500">*</span>
                                    </label>
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
                                </div>

                                {/* Issue Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Issue No. <span className="text-red-500">*</span>
                                    </label>
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
                                </div>
                            </div>

                            {/* Year Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Year <span className="text-red-500">*</span>
                                </label>
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
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Button
                                    size="large"
                                    icon={<FaTimes />}
                                    onClick={() => navigate('/dashboard/journal-issues')}
                                    className="px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    icon={<FaSave />}
                                    loading={loading}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 px-6"
                                >
                                    Save Issue
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default AddJournalIssue;
