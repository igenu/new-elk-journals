import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { proposalRequestApi } from '../../services/api';
import CodeEntryInput from '../../components/CodeEntryInput';
import {
    FaUser,
    FaEnvelope,
    FaBuilding,
    FaGlobe,
    FaPhone,
    FaCalendarAlt,
    FaFileUpload,
    FaUniversity,
    FaMapMarkerAlt,
    FaLongArrowAltRight,
    FaEye,
    FaTimes,
    FaRedo,
    FaFilePdf,
    FaFileImage,
} from 'react-icons/fa';

// ==================== REUSABLE FORM COMPONENTS ====================

const SectionHeader = ({ title }) => (
    <div className="bg-[#204066] py-2 px-4 mb-6 border-l-[5px] border-[#12b48b]">
        <h2 className="text-white text-[15px] font-semibold uppercase tracking-wide">{title}</h2>
    </div>
);

const IconInput = ({ icon: Icon, ...props }) => (
    <div className={`flex bg-white border rounded-lg overflow-hidden h-11 shadow-sm hover:shadow-md transition-shadow ${props.error ? 'border-red-400' : 'border-gray-300'}`}>
        <div className="w-10 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[#204066] border-r border-gray-300">
            <Icon className="text-sm" />
        </div>
        <input
            {...props}
            className="flex-1 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700 placeholder-gray-500"
        />
    </div>
);

const SelectInput = ({ icon: Icon, options, ...props }) => (
    <div className={`flex bg-white border rounded-lg overflow-hidden h-11 shadow-sm hover:shadow-md transition-shadow ${props.error ? 'border-red-400' : 'border-gray-300'}`}>
        <div className="w-10 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[#204066] border-r border-gray-300">
            <Icon className="text-sm" />
        </div>
        <select
            {...props}
            className="flex-1 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700 appearance-none cursor-pointer"
        >
            {props.children}
        </select>
    </div>
);

const DateInput = ({ icon: Icon, ...props }) => (
    <div className={`flex bg-white border rounded-lg overflow-hidden h-11 shadow-sm hover:shadow-md transition-shadow ${props.error ? 'border-red-400' : 'border-gray-300'}`}>
        <div className="w-10 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-[#204066] border-r border-gray-300">
            <Icon className="text-sm" />
        </div>
        <input
            type="date"
            {...props}
            className="flex-1 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700"
        />
    </div>
);

const FileInput = ({
    helpText,
    accept,
    onChange,
    error,
    file,
    onRemove,
    onView,
    fileInputRef
}) => {
    const getFileIcon = (fileName) => {
        if (!fileName) return null;
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return <FaFilePdf className="text-red-500" />;
        return <FaFileImage className="text-blue-500" />;
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className={`bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${error ? 'border-red-400' : 'border-gray-300'}`}>
            {!file ? (
                // No file selected - show browse button
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 bg-[#204066] hover:bg-[#152943] text-white px-4 py-2 rounded cursor-pointer transition-colors text-sm font-medium">
                        <FaFileUpload />
                        Browse
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={onChange}
                            className="hidden"
                        />
                    </label>
                    <span className="text-sm text-gray-500">No file selected</span>
                </div>
            ) : (
                // File selected - show file info with actions
                <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                        <div className="flex-shrink-0 text-lg">
                            {getFileIcon(file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* View Button */}
                            <button
                                type="button"
                                onClick={onView}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                title="View file"
                            >
                                <FaEye className="text-sm" />
                            </button>
                            {/* Re-choose Button */}
                            <label
                                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors cursor-pointer"
                                title="Choose different file"
                            >
                                <FaRedo className="text-sm" />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={accept}
                                    onChange={onChange}
                                    className="hidden"
                                />
                            </label>
                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={onRemove}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                title="Remove file"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            {helpText && !error && <p className="text-xs text-gray-500 mt-2">{helpText}</p>}
        </div>
    );
};

const ToggleButton = ({ label, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded border font-medium text-sm transition-all ${selected
            ? 'bg-[#12b48b] text-white border-[#12b48b] shadow-md'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
    >
        {label}
    </button>
);

const ServiceCard = ({ title, description, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selected
            ? 'border-[#12b48b] bg-[#12b48b]/5 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
    >
        <h4 className={`font-semibold text-sm mb-1 ${selected ? 'text-[#12b48b]' : 'text-[#204066]'}`}>
            {title}
        </h4>
        <p className="text-xs text-gray-500">{description}</p>
    </div>
);

// ==================== VALIDATION SCHEMA ====================

const ProposalSchema = Yup.object().shape({
    // Requestor Details
    title: Yup.string().required('Title is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    confirmEmail: Yup.string()
        .oneOf([Yup.ref('email'), null], 'Emails must match')
        .required('Confirm email is required'),
    institutionalAffiliation: Yup.string().required('Institutional affiliation is required'),
    country: Yup.string().required('Country is required'),
    countryCode: Yup.string().required('Country code is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),

    // Conference Details
    conferenceTitle: Yup.string().required('Conference title is required'),
    instituteName: Yup.string().required('Institute name is required'),
    instituteWebsite: Yup.string().url('Invalid URL format'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),

    // Captcha
    captchaInput: Yup.string().required('Verification code is required'),
});

// ==================== COUNTRY DATA ====================

const countries = [
    { name: 'India', code: '+91' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Australia', code: '+61' },
    { name: 'Canada', code: '+1' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'China', code: '+86' },
    { name: 'Japan', code: '+81' },
    { name: 'Singapore', code: '+65' },
    { name: 'UAE', code: '+971' },
    { name: 'Other', code: '' },
];

// ==================== MAIN COMPONENT ====================

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

const ProposalRequestForm = () => {
    const [captchaCode, setCaptchaCode] = useState('');
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [publicationType, setPublicationType] = useState('proceedings_edited');
    const [selectedServices, setSelectedServices] = useState({
        eCertificate: false,
        designing: false,
        plagiarism: false,
        doi: false,
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        generateCaptcha();
    }, []);

    // Cleanup file preview URL on unmount or file change
    useEffect(() => {
        return () => {
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, [filePreviewUrl]);

    const generateCaptcha = () => {
        setCaptchaCode(Math.floor(1000 + Math.random() * 9000).toString());
    };

    const handleServiceToggle = (service) => {
        setSelectedServices(prev => ({
            ...prev,
            [service]: !prev[service],
        }));
    };

    // File validation function
    const validateFile = (file) => {
        if (!file) return '';

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File size exceeds 5MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
        }

        // Check file type
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return `Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.`;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return `Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.`;
        }

        return '';
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            setFileError(error);
            setAttachmentFile(null);
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
                setFilePreviewUrl(null);
            }
            // Reset the input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setFileError('');
        setAttachmentFile(file);

        // Create preview URL for images
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setFilePreviewUrl(url);
        } else {
            setFilePreviewUrl(null);
        }
    };

    // Handle file removal
    const handleFileRemove = () => {
        setAttachmentFile(null);
        setFileError('');
        if (filePreviewUrl) {
            URL.revokeObjectURL(filePreviewUrl);
            setFilePreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle file view
    const handleFileView = () => {
        if (!attachmentFile) return;

        if (attachmentFile.type === 'application/pdf') {
            // Open PDF in new tab
            const url = URL.createObjectURL(attachmentFile);
            window.open(url, '_blank');
            // Clean up after a delay
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else if (attachmentFile.type.startsWith('image/')) {
            // Show image in SweetAlert modal
            const url = filePreviewUrl || URL.createObjectURL(attachmentFile);
            Swal.fire({
                title: attachmentFile.name,
                imageUrl: url,
                imageAlt: 'Attachment preview',
                showCloseButton: true,
                showConfirmButton: false,
                width: 'auto',
                customClass: {
                    image: 'max-h-[70vh] object-contain'
                }
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            institutionalAffiliation: '',
            country: '',
            countryCode: '',
            mobileNumber: '',
            conferenceTitle: '',
            instituteName: '',
            instituteWebsite: '',
            startDate: '',
            endDate: '',
            additionalComments: '',
            captchaInput: '',
        },
        validationSchema: ProposalSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            // Validate captcha
            if (values.captchaInput !== captchaCode) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Code',
                    text: 'The verification code does not match. Please try again.',
                    confirmButtonColor: '#12b48b',
                });
                setSubmitting(false);
                return;
            }

            // Validate file if selected
            if (attachmentFile && fileError) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File',
                    text: fileError,
                    confirmButtonColor: '#12b48b',
                });
                setSubmitting(false);
                return;
            }

            try {
                // Create FormData for file upload
                const formData = new FormData();

                // Add form fields
                formData.append('title', values.title);
                formData.append('firstName', values.firstName);
                formData.append('lastName', values.lastName);
                formData.append('email', values.email);
                formData.append('confirmEmail', values.confirmEmail);
                formData.append('institutionalAffiliation', values.institutionalAffiliation);
                formData.append('country', values.country);
                formData.append('countryCode', values.countryCode);
                formData.append('mobileNumber', values.mobileNumber);
                formData.append('conferenceTitle', values.conferenceTitle);
                formData.append('instituteName', values.instituteName);
                formData.append('instituteWebsite', values.instituteWebsite || '');
                formData.append('startDate', values.startDate);
                formData.append('endDate', values.endDate);
                formData.append('publicationType', publicationType);
                formData.append('selectedServices', JSON.stringify(selectedServices));
                formData.append('additionalComments', values.additionalComments || '');

                // Add file if present
                if (attachmentFile) {
                    formData.append('attachmentFile', attachmentFile);
                }

                const response = await proposalRequestApi.submit(formData);

                Swal.fire({
                    icon: 'success',
                    title: 'Submitted Successfully!',
                    html: `
                        <p class="text-center">Your proposal request has been submitted.</p>
                        <p class="mt-2 text-center"><strong>Proposal ID:</strong> ${response.data.proposalId}</p>
                        <p class="text-sm text-gray-600 mt-2 text-center">Our team will reach out to you at the earliest.</p>
                    `,
                    confirmButtonColor: '#12b48b',
                });

                // Reset form
                resetForm();
                handleFileRemove();
                setPublicationType('proceedings_edited');
                setSelectedServices({
                    eCertificate: false,
                    designing: false,
                    plagiarism: false,
                    doi: false,
                });
                generateCaptcha();
            } catch (error) {
                console.error('Submission error:', error);
                const errorMessage = error.response?.data?.message
                    || error.response?.data?.errors?.[0]?.msg
                    || error.message
                    || 'Please try again later.';
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: errorMessage,
                    confirmButtonColor: '#12b48b',
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Auto-fill country code when country changes
    useEffect(() => {
        const selectedCountry = countries.find(c => c.name === formik.values.country);
        if (selectedCountry) {
            formik.setFieldValue('countryCode', selectedCountry.code);
        }
    }, [formik.values.country]);

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#204066] to-[#2c4a6e] py-4 px-6 text-center">
                <h1 className="text-xl font-bold text-white uppercase tracking-wider">Proposal Request Form</h1>
                <p className="text-gray-300 text-sm mt-1 text-center">
                    Fill out the form below and our team will reach out to you at the earliest.
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
                {/* ==================== REQUESTOR DETAILS ==================== */}
                <div>
                    <SectionHeader title="Requestor Details" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Title */}
                        <div>
                            <SelectInput
                                icon={FaUser}
                                name="title"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.title}
                                error={formik.touched.title && formik.errors.title}
                            >
                                <option value="">Title *</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Dr">Dr</option>
                                <option value="Prof">Prof</option>
                            </SelectInput>
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.title}</div>
                            )}
                        </div>

                        {/* First Name */}
                        <div>
                            <IconInput
                                icon={FaUser}
                                name="firstName"
                                placeholder="First Name *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.firstName}
                                error={formik.touched.firstName && formik.errors.firstName}
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.firstName}</div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <IconInput
                                icon={FaUser}
                                name="lastName"
                                placeholder="Last Name *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastName}
                                error={formik.touched.lastName && formik.errors.lastName}
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.lastName}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <IconInput
                                icon={FaEnvelope}
                                name="email"
                                type="email"
                                placeholder="Institution Email (Preferred) *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                error={formik.touched.email && formik.errors.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        {/* Confirm Email */}
                        <div>
                            <IconInput
                                icon={FaEnvelope}
                                name="confirmEmail"
                                type="email"
                                placeholder="Confirm E-mail *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmEmail}
                                error={formik.touched.confirmEmail && formik.errors.confirmEmail}
                            />
                            {formik.touched.confirmEmail && formik.errors.confirmEmail && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.confirmEmail}</div>
                            )}
                        </div>

                        {/* Institutional Affiliation */}
                        <div>
                            <IconInput
                                icon={FaBuilding}
                                name="institutionalAffiliation"
                                placeholder="Institutional Affiliation *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.institutionalAffiliation}
                                error={formik.touched.institutionalAffiliation && formik.errors.institutionalAffiliation}
                            />
                            {formik.touched.institutionalAffiliation && formik.errors.institutionalAffiliation && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.institutionalAffiliation}</div>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <SelectInput
                                icon={FaGlobe}
                                name="country"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.country}
                                error={formik.touched.country && formik.errors.country}
                            >
                                <option value="">Select Country *</option>
                                {countries.map(c => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                            </SelectInput>
                            {formik.touched.country && formik.errors.country && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.country}</div>
                            )}
                        </div>

                        {/* Country Code (Auto-filled) */}
                        <div>
                            <IconInput
                                icon={FaPhone}
                                name="countryCode"
                                placeholder="Country Code"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.countryCode}
                                error={formik.touched.countryCode && formik.errors.countryCode}
                                readOnly
                                className="bg-gray-100"
                            />
                            {formik.touched.countryCode && formik.errors.countryCode && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.countryCode}</div>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <IconInput
                                icon={FaPhone}
                                name="mobileNumber"
                                placeholder="Mobile Number *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.mobileNumber}
                                error={formik.touched.mobileNumber && formik.errors.mobileNumber}
                            />
                            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.mobileNumber}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ==================== CONFERENCE DETAILS ==================== */}
                <div>
                    <SectionHeader title="Conference Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Conference Title */}
                        <div className="md:col-span-2">
                            <IconInput
                                icon={FaUniversity}
                                name="conferenceTitle"
                                placeholder="Conference Title *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.conferenceTitle}
                                error={formik.touched.conferenceTitle && formik.errors.conferenceTitle}
                            />
                            {formik.touched.conferenceTitle && formik.errors.conferenceTitle && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.conferenceTitle}</div>
                            )}
                        </div>

                        {/* Institute Name */}
                        <div>
                            <IconInput
                                icon={FaBuilding}
                                name="instituteName"
                                placeholder="Institute Name *"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.instituteName}
                                error={formik.touched.instituteName && formik.errors.instituteName}
                            />
                            {formik.touched.instituteName && formik.errors.instituteName && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.instituteName}</div>
                            )}
                        </div>

                        {/* Institute Website */}
                        <div>
                            <IconInput
                                icon={FaMapMarkerAlt}
                                name="instituteWebsite"
                                placeholder="Institute Website (Preferred) or Address"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.instituteWebsite}
                                error={formik.touched.instituteWebsite && formik.errors.instituteWebsite}
                            />
                            {formik.touched.instituteWebsite && formik.errors.instituteWebsite && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.instituteWebsite}</div>
                            )}
                        </div>
                    </div>

                    {/* Dates and Attachment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Dates Section */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-center text-sm font-semibold text-[#204066] mb-3 bg-[#2c4a6e] text-white py-1 rounded">
                                Confirmed / Tentative Dates
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                                    <DateInput
                                        icon={FaCalendarAlt}
                                        name="startDate"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.startDate}
                                        error={formik.touched.startDate && formik.errors.startDate}
                                    />
                                    {formik.touched.startDate && formik.errors.startDate && (
                                        <div className="text-red-500 text-xs mt-1">{formik.errors.startDate}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                                    <DateInput
                                        icon={FaCalendarAlt}
                                        name="endDate"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.endDate}
                                        error={formik.touched.endDate && formik.errors.endDate}
                                    />
                                    {formik.touched.endDate && formik.errors.endDate && (
                                        <div className="text-red-500 text-xs mt-1">{formik.errors.endDate}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Attachment Section */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-center text-sm font-semibold text-[#204066] mb-3 bg-[#2c4a6e] text-white py-1 rounded">
                                Attachment (Brochure/Flyer/Concept Note)
                            </div>
                            <FileInput
                                accept=".pdf,.jpg,.jpeg,.png"
                                helpText="Allowed only PDF/JPG/PNG [ Maximum 5 Mb ]*"
                                onChange={(e) => setAttachmentFile(e.target.files[0])}
                                fileName={attachmentFile?.name}
                            />
                        </div>
                    </div>
                </div>

                {/* ==================== PUBLICATION TYPE ==================== */}
                <div>
                    <SectionHeader title="Publication with ISBN & DOI" />
                    <div className="flex flex-wrap gap-3 justify-center">
                        <ToggleButton
                            label="Proceedings & Edited Book"
                            selected={publicationType === 'proceedings_edited'}
                            onClick={() => setPublicationType('proceedings_edited')}
                        />
                        <ToggleButton
                            label="Proceedings Only"
                            selected={publicationType === 'proceedings_only'}
                            onClick={() => setPublicationType('proceedings_only')}
                        />
                        <ToggleButton
                            label="Edited Book Only"
                            selected={publicationType === 'edited_only'}
                            onClick={() => setPublicationType('edited_only')}
                        />
                    </div>
                </div>

                {/* ==================== OPTIONAL SERVICES ==================== */}
                <div>
                    <SectionHeader title="Optional Additional Services (Click to select)" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ServiceCard
                            title="E-Certificate Services"
                            description="Participants/ Presentations/ Publications"
                            selected={selectedServices.eCertificate}
                            onClick={() => handleServiceToggle('eCertificate')}
                        />
                        <ServiceCard
                            title="Designing Services"
                            description="Conference Brochure/ Flyer etc."
                            selected={selectedServices.designing}
                            onClick={() => handleServiceToggle('designing')}
                        />
                        <ServiceCard
                            title="Plagiarism/Similarity Tool"
                            description="To check Similarity for submissions"
                            selected={selectedServices.plagiarism}
                            onClick={() => handleServiceToggle('plagiarism')}
                        />
                        <ServiceCard
                            title="DOI Services"
                            description="Article level DOIs for e publications"
                            selected={selectedServices.doi}
                            onClick={() => handleServiceToggle('doi')}
                        />
                    </div>
                </div>

                {/* ==================== ADDITIONAL COMMENTS ==================== */}
                <div>
                    <SectionHeader title="Additional Comments (Optional)" />
                    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <textarea
                            name="additionalComments"
                            rows="4"
                            placeholder="Type your comments here in maximum 100 words"
                            className="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-[#12b48b]/30 text-sm text-gray-700 placeholder-gray-500 resize-y rounded-lg"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.additionalComments}
                        />
                    </div>
                </div>

                {/* ==================== CAPTCHA & SUBMIT ==================== */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-2 items-center">
                            <CodeEntryInput
                                length={4}
                                onChange={(code) => formik.setFieldValue('captchaInput', code)}
                            />
                        </div>
                        <div className="bg-gradient-to-br from-[#48637c] to-[#3a4d5f] text-white h-11 flex items-center px-6 text-xl font-bold tracking-widest min-w-[90px] justify-center shadow-lg rounded-lg">
                            {captchaCode}
                        </div>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="ml-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#12b48b] to-[#0e9673] hover:from-[#0e9673] hover:to-[#0a7857] text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-11"
                        >
                            {formik.isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                            <FaLongArrowAltRight className="text-base" />
                        </button>
                    </div>
                    {formik.touched.captchaInput && formik.errors.captchaInput && (
                        <div className="text-red-500 text-xs mt-2">{formik.errors.captchaInput}</div>
                    )}
                    <p className="text-red-600 text-sm font-medium mt-3">(*) represents mandatory fields</p>
                </div>
            </form>
        </div>
    );
};

export default ProposalRequestForm;
