import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUniversity, FaBuilding, FaFile, FaKeyboard, FaPencilAlt, FaCheckSquare, FaPlus, FaLongArrowAltRight, FaCity, FaTrash, FaCloudUploadAlt, FaArrowLeft, FaCheck, FaTimes, FaSpinner, FaPenNib, FaFileContract } from "react-icons/fa";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { otpApi, manuscriptApi, authApi, copyrightApi } from '../../services/api';
import { message, Modal, Button } from "antd";
import { numberToWords } from '../../utils/numberToWords';
import SignatureCanvas from 'react-signature-canvas';
import FormRenderer from '../DynamicForm/FormRenderer';
import moment from 'moment';

const countries = [
    "Select Country", "United Kingdom", "United States", "India", "Australia", "Canada", "Germany", "France", "other"
];

const manuscriptTypes = [
    "Research paper",
    "Case study",
    "Book review",
    "Review paper",
    "Perspective",
    "Report",
    "Invited article"
];

const IconInput = ({ icon: Icon, disabled, ...props }) => (
    <div className="flex flex-col">
        <div className={`flex border border-gray-300 rounded overflow-hidden ${disabled ? 'bg-gray-200' : 'bg-gray-100'} ${props.className}`}>
            <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                <Icon className="text-sm" />
            </div>
            <Field
                {...props}
                disabled={disabled}
                className={`flex-1 px-3 py-2 focus:outline-none text-sm placeholder-gray-500 ${disabled ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-gray-100 focus:bg-white text-gray-700'}`}
            />
        </div>
        <ErrorMessage name={props.name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
);

const FormSection = ({ legend, children, className = "" }) => (
    <div className={`relative border border-gray-300 mt-6 p-6 pt-8 ${className}`}>
        <span className="absolute -top-3 right-4 bg-white px-2 text-[#204066] text-sm font-normal">
            {legend}
        </span>
        {children}
    </div>
);

const ManuscriptFormSteps = ({ fetchedJournalOptions, isDashboard }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [personalDetails, setPersonalDetails] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [wordCountText, setWordCountText] = useState("");
    const [abstractWordCount, setAbstractWordCount] = useState(0);
    const [titleWordCount, setTitleWordCount] = useState(0);
    const [otpTimer, setOtpTimer] = useState(0);
    const [verifyOtpError, setVerifyOtpError] = useState("");
    const [sendOtpError, setSendOtpError] = useState("");
    const [verificationRequiredError, setVerificationRequiredError] = useState("");

    // Loading states
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authorProfile, setAuthorProfile] = useState(null);
    const [submitterIpAddress, setSubmitterIpAddress] = useState(null);

    // Copyright Form States
    const [copyrightTemplate, setCopyrightTemplate] = useState(null);
    const [copyrightSignatures, setCopyrightSignatures] = useState({});
    const [signModalVisible, setSignModalVisible] = useState(false);
    const [currentSignIndex, setCurrentSignIndex] = useState(null);
    const [copyrightLoading, setCopyrightLoading] = useState(false);
    const sigCanvasRef = useRef(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (isDashboard && userStr && token) {
                try {
                    const user = JSON.parse(userStr);
                    const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
                    const email = user.email || '';
                    const phone = user.phone || user.contactNumber || '';

                    setPersonalDetails({ name, email, phone });
                    setOtpVerified(true);
                    setOtpSent(true);
                    setCurrentStep(2);
                    setIsLoggedIn(true);

                    // Fetch full author profile for auto-filling Step 3
                    try {
                        const response = await authApi.getProfile();
                        if (response.data?.success && response.data?.profile) {
                            setAuthorProfile(response.data.profile);
                        }
                    } catch (profileError) {
                        console.error("Error fetching author profile", profileError);
                    }
                } catch (e) {
                    console.error("Error parsing user data", e);
                }
            }
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    // Fetch IP address when component mounts
    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setSubmitterIpAddress(data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
                setSubmitterIpAddress('Unable to detect');
            }
        };
        fetchIpAddress();
    }, []);

    const totalSteps = 9;

    const getTouchedFromErrors = (errors) => {
        const touched = {};
        Object.keys(errors).forEach((key) => {
            if (typeof errors[key] === 'object' && errors[key] !== null) {
                touched[key] = getTouchedFromErrors(errors[key]);
            } else {
                touched[key] = true;
            }
        });
        return touched;
    };

    const getStepValidationSchema = (step) => {
        switch (step) {
            case 1:
                return Yup.object().shape({
                    name: Yup.string().required('Name is required'),
                    email: Yup.string().email('Invalid email').required('Email is required'),
                    phone: Yup.string()
                        .matches(/^[0-9]+$/, "Must be only digits")
                        .min(10, 'Must be at least 10 digits')
                        .required('Phone is required'),
                });
            case 2:
                return Yup.object().shape({
                    journalId: Yup.string().required('Journal selection is required'),
                    manuscriptType: Yup.string().required('Manuscript type is required'),
                    paperTitle: Yup.string()
                        .required('Manuscript title is required')
                        .test('word-count', 'Title must not exceed 50 words', function (value) {
                            if (!value) return true;
                            const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
                            return wordCount <= 50;
                        }),
                    abstract: Yup.string().required('Abstract is required'),
                    wordCount: Yup.number().required('Word count is required').positive('Must be positive'),
                });
            case 3:
                return Yup.object().shape({
                    primaryAuthor: Yup.object().shape({
                        firstName: Yup.string().required('First name is required'),
                        lastName: Yup.string().required('Last name is required'),
                        email: Yup.string().email('Invalid email').required('Email is required'),
                        confirmEmail: Yup.string()
                            .oneOf([Yup.ref('email'), null], 'Emails must match')
                            .required('Confirm email is required'),
                        phone: Yup.string().matches(/^[0-9]+$/, "Must be only digits").required('Phone is required'),
                        country: Yup.string().required('Country is required').notOneOf(['Select Country'], 'Please select a country'),
                        institution: Yup.string().required('Institution is required'),
                        department: Yup.string().required('Department is required'),
                        state: Yup.string().required('State is required'),
                        city: Yup.string().required('City is required'),
                        address: Yup.string().required('Address is required'),
                    })
                });
            case 4:
                return Yup.object().shape({
                    authors: Yup.array().of(
                        Yup.object().shape({
                            firstName: Yup.string().required('First name is required'),
                            lastName: Yup.string().required('Last name is required'),
                            email: Yup.string().email('Invalid email').required('Email is required'),
                            confirmEmail: Yup.string()
                                .oneOf([Yup.ref('email'), null], 'Emails must match')
                                .required('Confirm email is required'),
                            phone: Yup.string().matches(/^[0-9]+$/, "Must be only digits").required('Phone is required'),
                            country: Yup.string().required('Country is required').notOneOf(['Select Country'], 'Please select a country'),
                            institution: Yup.string().required('Institution is required'),
                            designation: Yup.string().required('Designation is required'),
                            department: Yup.string().required('Department is required'),
                            state: Yup.string().required('State is required'),
                            city: Yup.string().required('City is required'),
                            address: Yup.string().required('Address is required'),
                        })
                    )
                });
            case 5:
                return Yup.object().shape({
                    checklist: Yup.object().shape({
                        isSoleSubmission: Yup.boolean().oneOf([true], 'You must confirm this'),
                        isNotPublished: Yup.boolean().oneOf([true], 'You must confirm this'),
                        isOriginalWork: Yup.boolean().oneOf([true], 'You must confirm this'),
                        hasDeclaredConflicts: Yup.boolean().oneOf([true], 'You must confirm this'),
                        hasAcknowledgedSupport: Yup.boolean().oneOf([true], 'You must confirm this'),
                        hasAcknowledgedFunding: Yup.boolean().oneOf([true], 'You must confirm this'),
                        followsGuidelines: Yup.boolean().oneOf([true], 'You must confirm this'),
                    })
                });
            case 6:
                return Yup.object().shape({
                    manuscriptFile: Yup.mixed().required('Manuscript file is required'),
                });
            case 7:
                // Step 7 is optional - no required fields
                return Yup.object().shape({
                    reviewerEmail: Yup.string().email('Invalid email format'),
                    reviewerPhone: Yup.string().matches(/^[0-9]*$/, "Must be only digits"),
                });
            default:
                return Yup.object().shape({});
        }
    };

    const initialValues = useMemo(() => ({
        // Step 1: Personal Details
        name: personalDetails?.name || "",
        email: personalDetails?.email || "",
        phone: personalDetails?.phone || "",

        // Step 2: Manuscript Information
        journalId: "",
        manuscriptType: "",
        paperTitle: "",
        abstract: "",
        wordCount: "",

        // Step 3: Primary Author (auto-filled from author profile when logged in)
        primaryAuthor: {
            firstName: authorProfile?.firstName || "",
            lastName: authorProfile?.lastName || "",
            email: authorProfile?.email || "",
            confirmEmail: authorProfile?.email || "",
            phone: authorProfile?.contactNumber || "",
            country: authorProfile?.country || "",
            institution: authorProfile?.institute || "",
            department: "",
            designation: "",
            state: authorProfile?.state || "",
            city: authorProfile?.city || "",
            address: authorProfile?.address || "",
            isCorrespondingAuthor: true
        },

        // Step 4: Additional Authors
        authors: [],

        // Step 5: Submission Checklist
        checklist: {
            isSoleSubmission: false,
            isNotPublished: false,
            isOriginalWork: false,
            hasDeclaredConflicts: false,
            hasAcknowledgedSupport: false,
            hasAcknowledgedFunding: false,
            followsGuidelines: false,
        },

        // Step 6: File Uploads
        manuscriptFile: null,
        coverLetter: null,

        // Step 7: Suggested Reviewer
        reviewerFirstName: "",
        reviewerLastName: "",
        reviewerEmail: "",
        reviewerPhone: "",
        reviewerCountry: "",
        reviewerInstitution: "",
        reviewerDesignation: "",
        reviewerSpecialisation: "",
        reviewerDepartment: "",
        reviewerState: "",
        reviewerCity: "",
        reviewerAddress: "",
    }), [personalDetails, authorProfile]);

    const [currentOtp, setCurrentOtp] = useState(
        ""
    )
    const handleSendOTP = async (values) => {
        setIsSendingOtp(true);
        setSendOtpError("");
        try {
            const response = await otpApi.send({
                name: values.name,
                email: values.email,
                phone: values.phone
            });
            // console.log(response?.data?.otp);
            setCurrentOtp(response?.data?.otp);
            setOtpSent(true);
            setPersonalDetails({ name: values.name, email: values.email, phone: values.phone });
            setOtpTimer(45);
            message.success("OTP sent successfully to your email!");
        } catch (error) {
            console.error(error);
            setSendOtpError(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOTP = async (email) => {
        setIsVerifyingOtp(true);
        setVerifyOtpError("");
        try {
            const response = await otpApi.verify({ email, otp });
            setOtpVerified(true);
            setVerificationRequiredError("");
            message.success("Email verified successfully!");
        } catch (error) {
            console.error(error);
            setVerifyOtpError(error.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleAddKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput("");
        }
    };

    const handleRemoveKeyword = (index) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const countWords = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleAbstractChange = (e, setFieldValue) => {
        const text = e.target.value;
        const words = countWords(text);

        if (words <= 200) {
            setFieldValue('abstract', text);
            setAbstractWordCount(words);
        } else {
            message.warning("Abstract cannot exceed 200 words");
        }
    };

    // Load copyright template when reaching Step 9
    const loadCopyrightTemplate = async () => {
        if (copyrightTemplate) return; // Already loaded
        setCopyrightLoading(true);
        try {
            const response = await copyrightApi.getActiveTemplate();
            if (response.data.success && response.data.data) {
                const templateData = response.data.data;
                const schema = typeof templateData.schema === 'string'
                    ? JSON.parse(templateData.schema)
                    : templateData.schema;
                setCopyrightTemplate(schema);
            }
        } catch (error) {
            console.error("Failed to load copyright template:", error);
            message.error("Failed to load copyright form. Please try again.");
        } finally {
            setCopyrightLoading(false);
        }
    };

    // Handle copyright signature click
    const handleSignClick = (index) => {
        setCurrentSignIndex(index);
        setSignModalVisible(true);
    };

    // Handle copyright signature confirm
    const handleSignConfirm = () => {
        if (sigCanvasRef.current.isEmpty()) {
            message.error('Please draw your signature');
            return;
        }
        const signatureImage = sigCanvasRef.current.getCanvas().toDataURL('image/png');
        setCopyrightSignatures(prev => ({
            ...prev,
            [currentSignIndex]: {
                signatureImage: signatureImage,
                date: moment().format('DD/MM/YYYY')
            }
        }));
        setSignModalVisible(false);
        message.success('Signed successfully');
    };

    const handleSubmit = async (values, { resetForm }) => {
        // Validate copyright signatures before submission
        if (Object.keys(copyrightSignatures).length === 0) {
            message.warning('Please sign the copyright form before submitting');
            return;
        }

        setIsFinalSubmitting(true);
        try {
            const formData = new FormData();

            // Personal details
            formData.append('name', personalDetails.name);
            formData.append('email', personalDetails.email);
            formData.append('phone', personalDetails.phone);

            // Manuscript information
            formData.append('journalId', values.journalId);
            formData.append('manuscriptType', values.manuscriptType);
            formData.append('paperTitle', values.paperTitle);
            formData.append('abstract', values.abstract);
            formData.append('wordCount', values.wordCount);
            formData.append('keywords', JSON.stringify(keywords));

            // Authors (combine primary and additional)
            const allAuthors = [values.primaryAuthor, ...values.authors];
            formData.append('authors', JSON.stringify(allAuthors));

            // Checklist
            formData.append('checklist', JSON.stringify(values.checklist));

            // Files
            if (values.manuscriptFile) formData.append('manuscriptFile', values.manuscriptFile);
            if (values.coverLetter) formData.append('coverLetter', values.coverLetter);

            // Reviewer
            formData.append('reviewerFirstName', values.reviewerFirstName);
            formData.append('reviewerLastName', values.reviewerLastName);
            formData.append('reviewerEmail', values.reviewerEmail);
            formData.append('reviewerPhone', values.reviewerPhone);
            formData.append('reviewerCountry', values.reviewerCountry);
            formData.append('reviewerInstitution', values.reviewerInstitution);
            formData.append('reviewerDesignation', values.reviewerDesignation);
            formData.append('reviewerSpecialisation', values.reviewerSpecialisation);
            formData.append('reviewerDepartment', values.reviewerDepartment);
            formData.append('reviewerState', values.reviewerState);
            formData.append('reviewerCity', values.reviewerCity);
            formData.append('reviewerAddress', values.reviewerAddress);

            // Copyright Form Data
            formData.append('copyrightData', JSON.stringify({
                templateVersion: copyrightTemplate?.version,
                signatures: copyrightSignatures
            }));

            const response = await manuscriptApi.submit(formData);

            Swal.fire({
                title: "Submitted Successfully!",
                text: `Congratulations! You have successfully submitted your manuscript. Your manuscript ID is: ${response.data.data.manuscriptId}. Please check your mailbox for acknowledgement of receipt of manuscript.`,
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "bg-[#12b48b] text-white px-6 py-2 rounded",
                }
            }).then(() => {
                // Reset form and local state
                resetForm();
                setCurrentStep(1);
                setOtpSent(false);
                setOtpVerified(false);
                setOtp("");
                setPersonalDetails(null);
                setKeywords([]);
                setKeywordInput("");
                setWordCountText("");
                setAbstractWordCount(0);
                setCurrentOtp(null);
                setOtpTimer(0);
                setVerifyOtpError("");
                setSendOtpError("");
                setVerificationRequiredError("");
                // Reset copyright state
                setCopyrightTemplate(null);
                setCopyrightSignatures({});

                if (isDashboard && isLoggedIn) {
                    navigate('/dashboard/submit-manuscript');
                } else {
                    navigate('/submit-manuscript');
                }
            });
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.error || "Failed to submit manuscript");
        } finally {
            setIsFinalSubmitting(false);
        }
    };

    const StepIndicator = () => {
        const stepsToRender = isLoggedIn ? [2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const displayStep = isLoggedIn ? currentStep - 1 : currentStep;
        const displayTotal = isLoggedIn ? totalSteps - 1 : totalSteps;

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {stepsToRender.map((step) => {
                        const label = isLoggedIn ? step - 1 : step;
                        return (
                            <div key={step} className="flex items-center flex-1">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step ? 'bg-[#12b48b] border-[#12b48b] text-white' : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    {currentStep > step ? <FaCheck /> : label}
                                </div>
                                {step < 9 && (
                                    <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-[#12b48b]' : 'bg-gray-300'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-2 text-center text-sm text-gray-600">
                    Step {displayStep} of {displayTotal}
                </div>
            </div>
        );
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={getStepValidationSchema(currentStep)}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={true}
        >
            {({ values, setFieldValue, validateForm, setTouched, touched, isSubmitting, resetForm }) => (
                <div>
                    <StepIndicator />

                    {/* Step 1: Personal Details with OTP */}
                    {currentStep === 1 && (
                        <FormSection legend="Personal Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <IconInput icon={FaUser} type="text" name="name" placeholder="Name *" disabled={otpVerified} />
                                <IconInput icon={FaEnvelope} type="email" name="email" placeholder="Email ID *" disabled={otpVerified} />
                                <IconInput icon={FaPhone} type="text" name="phone" placeholder="Phone No *" disabled={otpVerified} />
                            </div>

                            {!otpVerified && (
                                <div className="mt-4">
                                    {verificationRequiredError && <div className="text-red-500 text-sm mb-2 font-bold">{verificationRequiredError}</div>}
                                    {!otpSent ? (
                                        <div className="flex flex-col items-start gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    validateForm().then((errors) => {
                                                        if (Object.keys(errors).length === 0) {
                                                            handleSendOTP(values);
                                                        } else {
                                                            setTouched({ name: true, email: true, phone: true });
                                                        }
                                                    });
                                                }}
                                                className={`bg-[#12b48b] hover:bg-[#0e9470] text-white font-bold py-2 px-6 rounded flex items-center gap-2 ${isSendingOtp || !values.name || !values.email || !values.phone ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                disabled={isSendingOtp || !values.name || !values.email || !values.phone}
                                            >
                                                {isSendingOtp ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" /> Sending...
                                                    </>
                                                ) : (
                                                    "Send OTP"
                                                )}
                                            </button>
                                            {sendOtpError && <div className="text-red-500 text-xs">{sendOtpError}</div>}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <h4>Insert This OTP -  {currentOtp}</h4>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    maxLength="6"
                                                    placeholder="Enter 6-digit OTP"
                                                    value={otp}
                                                    onChange={(e) => {
                                                        setOtp(e.target.value.replace(/\D/g, ''));
                                                        setVerifyOtpError("");
                                                    }}
                                                    className={`border ${verifyOtpError ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded w-48 text-center text-lg tracking-widest focus:outline-none`}
                                                />
                                                {otpTimer > 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleVerifyOTP(values.email)}
                                                        className={`bg-[#12b48b] hover:bg-[#0e9470] text-white font-bold py-2 px-6 rounded flex items-center gap-2 ${isVerifyingOtp || !otp || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                        disabled={isVerifyingOtp || !otp || otp.length !== 6}
                                                    >
                                                        {isVerifyingOtp ? (
                                                            <>
                                                                <FaSpinner className="animate-spin" /> Verifying...
                                                            </>
                                                        ) : (
                                                            "Verify OTP"
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendOTP(values)}
                                                        className={`bg-[#12b48b] hover:bg-[#0e9470] text-white font-bold py-2 px-6 rounded flex items-center gap-2 ${isSendingOtp ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                        disabled={isSendingOtp}
                                                    >
                                                        {isSendingOtp ? (
                                                            <>
                                                                <FaSpinner className="animate-spin" /> Sending...
                                                            </>
                                                        ) : (
                                                            "Resend OTP"
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            {verifyOtpError && <div className="text-red-500 text-xs mt-1">{verifyOtpError}</div>}
                                            <p className="text-xs text-gray-500">OTP has been sent to {values.email}</p>
                                            <div className="mt-2 text-sm text-gray-600">
                                                {otpTimer > 0 && (
                                                    <p>Resend OTP in <span className="font-bold text-[#12b48b]">{otpTimer}s</span></p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {otpVerified && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <FaCheck className="text-green-600" />
                                        <span className="font-semibold">Email Verified Successfully!</span>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-700">
                                        <p><strong>Name:</strong> {personalDetails?.name}</p>
                                        <p><strong>Email:</strong> {personalDetails?.email}</p>
                                        <p><strong>Phone:</strong> {personalDetails?.phone}</p>
                                    </div>
                                </div>
                            )}
                        </FormSection>
                    )}

                    {/* Step 2: Manuscript Information */}
                    {currentStep === 2 && (
                        <FormSection legend="Manuscript Information">
                            <div className="space-y-4">
                                {/* Journal Selection */}
                                <div className="flex flex-col">
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                            <FaUser className="text-sm" />
                                        </div>
                                        <Field as="select" name="journalId" className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700">
                                            <option value="">Select Journal *</option>
                                            {fetchedJournalOptions?.length > 0 && fetchedJournalOptions?.map((group, idx) => (
                                                <optgroup key={idx} label={group.label}>
                                                    {group.options?.length > 0 && group.options.map((opt, optIdx) => (
                                                        <option key={optIdx} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </Field>
                                    </div>
                                    <ErrorMessage name="journalId" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                {/* Manuscript Type */}
                                <div className="flex flex-col">
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                            <FaFile className="text-sm" />
                                        </div>
                                        <Field as="select" name="manuscriptType" className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700">
                                            <option value="">Select Manuscript Type *</option>
                                            {manuscriptTypes?.length > 0 && manuscriptTypes.map((type, idx) => (
                                                <option key={idx} value={type}>{type}</option>
                                            ))}
                                        </Field>
                                    </div>
                                    <ErrorMessage name="manuscriptType" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                {/* Manuscript Title */}
                                <div className="flex flex-col">
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                            <FaPencilAlt className="text-sm" />
                                        </div>
                                        <Field
                                            type="text"
                                            name="paperTitle"
                                            placeholder="Manuscript Title *"
                                            onChange={(e) => {
                                                const text = e.target.value;
                                                const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

                                                if (words <= 50) {
                                                    setFieldValue('paperTitle', text);
                                                    setTitleWordCount(words);
                                                } else {
                                                    message.warning("Manuscript title cannot exceed 50 words");
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <ErrorMessage name="paperTitle" component="div" className="text-red-500 text-xs" />
                                        <span className={`text-xs ${titleWordCount > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {titleWordCount} / 50 words
                                        </span>
                                    </div>
                                </div>

                                {/* Abstract */}
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-600 mb-1">Abstract (Max 200 words) *</label>
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-10 flex items-start pt-3 justify-center bg-gray-200 text-gray-500 border-r border-gray-300 h-32">
                                            <FaFile className="text-sm" />
                                        </div>
                                        <Field
                                            as="textarea"
                                            name="abstract"
                                            placeholder="Enter abstract (max 200 words)"
                                            onChange={(e) => handleAbstractChange(e, setFieldValue)}
                                            className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700 h-32 resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <ErrorMessage name="abstract" component="div" className="text-red-500 text-xs" />
                                        <span className={`text-xs ${abstractWordCount > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {abstractWordCount} / 200 words
                                        </span>
                                    </div>
                                </div>

                                {/* Word Count */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <IconInput
                                            icon={FaFile}
                                            type="number"
                                            name="wordCount"
                                            placeholder="No. of words *"
                                            onChange={(e) => {
                                                setFieldValue('wordCount', e.target.value);
                                                setWordCountText(numberToWords(e.target.value));
                                            }}
                                        />
                                        {wordCountText && (
                                            <p className="text-xs text-gray-600 mt-1 italic">{wordCountText}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div className="flex flex-col">
                                    <label className="text-xs text-gray-600 mb-1">Keywords</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddKeyword();
                                                }
                                            }}
                                            placeholder="Type keyword and press Enter"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#12b48b]"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddKeyword}
                                            className="bg-[#12b48b] hover:bg-[#0e9470] text-white px-4 py-2 rounded text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {keywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 bg-[#12b48b] text-white px-3 py-1 rounded-full text-sm"
                                                >
                                                    {keyword}
                                                    <FaTimes
                                                        className="cursor-pointer hover:text-red-200"
                                                        onClick={() => handleRemoveKeyword(index)}
                                                    />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {/* Step 3: Primary Author */}
                    {currentStep === 3 && (
                        <FormSection legend="Primary Author Information">
                            {authorProfile && (
                                <p className="text-sm text-gray-500 mb-4 italic">
                                    Fields pre-filled from your profile are locked. Missing fields can be edited.
                                </p>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <IconInput icon={FaUser} type="text" name="primaryAuthor.firstName" placeholder="First Name *" disabled={!!authorProfile?.firstName} />
                                <IconInput icon={FaUser} type="text" name="primaryAuthor.lastName" placeholder="Last Name *" disabled={!!authorProfile?.lastName} />
                                <IconInput icon={FaEnvelope} type="email" name="primaryAuthor.email" placeholder="Email ID *" disabled={!!authorProfile?.email} />
                                <IconInput icon={FaEnvelope} type="email" name="primaryAuthor.confirmEmail" placeholder="Confirm Email ID *" disabled={!!authorProfile?.email} />
                                <IconInput icon={FaPhone} type="text" name="primaryAuthor.phone" placeholder="Phone No *" disabled={!!authorProfile?.contactNumber} />

                                {authorProfile?.country ? (
                                    <IconInput icon={MdLocationOn} type="text" name="primaryAuthor.country" placeholder="Country *" disabled={true} />
                                ) : (
                                    <div className="flex flex-col">
                                        <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                            <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                                <MdLocationOn className="text-sm" />
                                            </div>
                                            <Field
                                                as="select"
                                                name="primaryAuthor.country"
                                                className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700"
                                            >
                                                {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="primaryAuthor.country" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                )}

                                <IconInput icon={MdSchool} type="text" name="primaryAuthor.institution" placeholder="Institution *" disabled={!!authorProfile?.institute} />
                                <IconInput icon={FaBuilding} type="text" name="primaryAuthor.department" placeholder="Department *" />
                                <IconInput icon={FaUniversity} type="text" name="primaryAuthor.state" placeholder="State *" disabled={!!authorProfile?.state} />
                                <IconInput icon={FaCity} type="text" name="primaryAuthor.city" placeholder="City *" disabled={!!authorProfile?.city} />

                                <div className="md:col-span-2">
                                    <IconInput icon={FaMapMarkerAlt} type="text" name="primaryAuthor.address" placeholder="Address *" disabled={!!authorProfile?.address} />
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {/* Step 4: Additional Authors */}
                    {currentStep === 4 && (
                        <div>
                            <FormSection legend="Additional Authors (Optional)">
                                <p className="text-sm text-gray-600 mb-4">Add co-authors for this manuscript (optional)</p>

                                <FieldArray name="authors">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.authors?.length > 0 && values.authors.map((author, index) => (
                                                <div key={index} className="mb-6 p-4 border border-gray-200 rounded">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="text-sm font-semibold text-[#204066]">Co-Author {index + 1}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                                                        >
                                                            <FaTrash /> Remove
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <IconInput icon={FaUser} type="text" name={`authors.${index}.firstName`} placeholder="First Name *" />
                                                        <IconInput icon={FaUser} type="text" name={`authors.${index}.lastName`} placeholder="Last Name *" />
                                                        <IconInput icon={FaEnvelope} type="email" name={`authors.${index}.email`} placeholder="Email ID *" />
                                                        <IconInput icon={FaEnvelope} type="email" name={`authors.${index}.confirmEmail`} placeholder="Confirm Email ID *" />
                                                        <IconInput icon={FaPhone} type="text" name={`authors.${index}.phone`} placeholder="Phone No *" />

                                                        <div className="flex flex-col">
                                                            <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                                                <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                                                    <MdLocationOn className="text-sm" />
                                                                </div>
                                                                <Field as="select" name={`authors.${index}.country`} className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700">
                                                                    {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                                                </Field>
                                                            </div>
                                                            <ErrorMessage name={`authors.${index}.country`} component="div" className="text-red-500 text-xs mt-1" />
                                                        </div>

                                                        <IconInput icon={MdSchool} type="text" name={`authors.${index}.institution`} placeholder="Institution *" />
                                                        <IconInput icon={FaUser} type="text" name={`authors.${index}.designation`} placeholder="Designation *" />
                                                        <IconInput icon={FaBuilding} type="text" name={`authors.${index}.department`} placeholder="Department *" />
                                                        <IconInput icon={FaUniversity} type="text" name={`authors.${index}.state`} placeholder="State *" />
                                                        <IconInput icon={FaCity} type="text" name={`authors.${index}.city`} placeholder="City *" />

                                                        <div className="md:col-span-2">
                                                            <IconInput icon={FaMapMarkerAlt} type="text" name={`authors.${index}.address`} placeholder="Address *" />
                                                        </div>

                                                        {/* <div className="md:col-span-2 flex items-center gap-2">
                                                            <Field type="checkbox" name={`authors.${index}.isCorrespondingAuthor`} className="h-4 w-4" />
                                                            <span className="text-xs text-gray-700">Corresponding Author</span>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={() => push({
                                                    firstName: "", lastName: "", email: "", confirmEmail: "", phone: "",
                                                    country: "", institution: "", designation: "", department: "",
                                                    state: "", city: "", address: "", isCorrespondingAuthor: false
                                                })}
                                                className="bg-[#6dbd63] hover:bg-[#5da554] text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                                            >
                                                <FaPlus /> Add More Authors
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </FormSection>
                        </div>
                    )}

                    {/* Step 5: Submission Checklist */}
                    {currentStep === 5 && (
                        <FormSection legend="Submission Checklist">
                            <p className="text-sm text-gray-600 mb-4">Please confirm the following statements:</p>
                            <div className="space-y-3">
                                {[
                                    { name: 'isSoleSubmission', label: 'The manuscript is solely submitted to this journal and is not currently under submission to, or consideration by, any other journal or publication.' },
                                    { name: 'isNotPublished', label: 'The manuscript has not been published before in its current or a substantially similar form.' },
                                    { name: 'isOriginalWork', label: 'The Article is my/our original work and does not infringe the intellectual property rights of any other person or entity and cannot be considered as plagiarising any other published work.' },
                                    { name: 'hasDeclaredConflicts', label: 'I/we have declared any potential conflict of interest in the research.' },
                                    { name: 'hasAcknowledgedSupport', label: 'Any support from a third party has been noted in the Acknowledgements.' },
                                    { name: 'hasAcknowledgedFunding', label: 'Sources of funding, if any, have been acknowledged.' },
                                    { name: 'followsGuidelines', label: 'The manuscript is submitted as per the journal submission guidelines provided at the journal home page.' },
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <div className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
                                            <Field type="checkbox" name={`checklist.${item.name}`} className="mt-1 h-4 w-4 text-[#12b48b]" />
                                            <label className="text-sm text-gray-700 flex-1">{item.label}</label>
                                        </div>
                                        <ErrorMessage name={`checklist.${item.name}`} component="div" className="text-red-500 text-xs ml-1" />
                                    </div>
                                ))}
                            </div>

                            {/* Display IP Address */}
                            {submitterIpAddress && (
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between bg-blue-50 px-4 py-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <MdLocationOn className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Your IP Address</p>
                                                <p className="text-xs text-gray-500">Recorded for submission tracking</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-mono font-semibold text-blue-700 bg-white px-3 py-1.5 rounded border border-blue-200">
                                            {submitterIpAddress}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </FormSection>
                    )}

                    {/* Step 6: File Uploads */}
                    {currentStep === 6 && (
                        <FormSection legend="File Uploads">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Manuscript (without author details) * <span className="text-xs text-gray-500">(.doc, .docx only)</span>
                                    </label>
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                            <FaCloudUploadAlt className="text-lg" />
                                        </div>
                                        <input
                                            type="file"
                                            accept=".doc,.docx"
                                            onChange={(e) => setFieldValue('manuscriptFile', e.currentTarget.files[0])}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-sm"
                                        />
                                    </div>
                                    {values.manuscriptFile && (
                                        <div className="text-sm text-[#12b48b] mt-1">
                                            Selected: {values.manuscriptFile.name}
                                        </div>
                                    )}
                                    <ErrorMessage name="manuscriptFile" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-700 mb-2 block">
                                        Cover Letter for Manuscript (Optional) <span className="text-xs text-gray-500">(.doc, .docx only)</span>
                                    </label>
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                            <FaFile className="text-lg" />
                                        </div>
                                        <input
                                            type="file"
                                            accept=".doc,.docx"
                                            onChange={(e) => setFieldValue('coverLetter', e.currentTarget.files[0])}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-sm"
                                        />
                                    </div>
                                    {values.coverLetter && (
                                        <div className="text-sm text-[#12b48b] mt-1">
                                            Selected: {values.coverLetter.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {/* Step 7: Suggested Reviewers (Optional) */}
                    {currentStep === 7 && (
                        <FormSection legend="Suggest Reviewers (Optional)">
                            <p className="text-sm text-gray-600 mb-4">Optionally suggest a reviewer belonging to a similar research background</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <IconInput icon={FaUser} type="text" name="reviewerFirstName" placeholder="First Name" />
                                <IconInput icon={FaUser} type="text" name="reviewerLastName" placeholder="Last Name" />
                                <IconInput icon={FaEnvelope} type="email" name="reviewerEmail" placeholder="Email ID" />
                                <IconInput icon={FaPhone} type="text" name="reviewerPhone" placeholder="Phone No" />
                                <IconInput icon={FaKeyboard} type="text" name="reviewerSpecialisation" placeholder="Specialisation" />

                                <div className="flex flex-col">
                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                        <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                            <MdLocationOn className="text-sm" />
                                        </div>
                                        <Field as="select" name="reviewerCountry" className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700">
                                            {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                        </Field>
                                    </div>
                                    <ErrorMessage name="reviewerCountry" component="div" className="text-red-500 text-xs mt-1" />
                                </div>

                                <IconInput icon={MdSchool} type="text" name="reviewerInstitution" placeholder="Institution" />
                                <IconInput icon={FaUser} type="text" name="reviewerDesignation" placeholder="Designation" />
                                <IconInput icon={FaBuilding} type="text" name="reviewerDepartment" placeholder="Department" />
                                <IconInput icon={FaUniversity} type="text" name="reviewerState" placeholder="State" />
                                <IconInput icon={FaCity} type="text" name="reviewerCity" placeholder="City" />

                                <div className="md:col-span-2">
                                    <IconInput icon={FaMapMarkerAlt} type="text" name="reviewerAddress" placeholder="Address" />
                                </div>
                            </div>
                        </FormSection>
                    )}

                    {/* Step 8: Summary & Review */}
                    {currentStep === 8 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-[#204066] mb-4">Review Your Submission</h2>

                            {/* Personal Details */}
                            <div className="border border-gray-300 rounded p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-[#204066]">Personal Details</h3>
                                    {!isLoggedIn && (
                                        <button type="button" onClick={() => setCurrentStep(1)} className="text-[#12b48b] text-sm hover:underline">Edit</button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p><strong>Name:</strong> {personalDetails?.name}</p>
                                    <p><strong>Email:</strong> {personalDetails?.email}</p>
                                    <p><strong>Phone:</strong> {personalDetails?.phone}</p>
                                </div>
                            </div>

                            {/* Manuscript Information */}
                            <div className="border border-gray-300 rounded p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-[#204066]">Manuscript Information</h3>
                                    <button type="button" onClick={() => setCurrentStep(2)} className="text-[#12b48b] text-sm hover:underline">Edit</button>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Journal:</strong> {fetchedJournalOptions?.flatMap(g => g.options).find(o => o.value == values.journalId)?.label}</p>
                                    <p><strong>Type:</strong> {values.manuscriptType}</p>
                                    <p><strong>Title:</strong> {values.paperTitle}</p>
                                    <p><strong>Word Count:</strong> {values.wordCount} ({wordCountText})</p>
                                    <p><strong>Keywords:</strong> {keywords.join(', ')}</p>
                                    <p><strong>Abstract:</strong> {values.abstract?.substring(0, 100)}...</p>
                                </div>
                            </div>

                            {/* Primary Author */}
                            <div className="border border-gray-300 rounded p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-[#204066]">Primary Author</h3>
                                    <button type="button" onClick={() => setCurrentStep(3)} className="text-[#12b48b] text-sm hover:underline">Edit</button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p><strong>Name:</strong> {values.primaryAuthor.firstName} {values.primaryAuthor.lastName}</p>
                                    <p><strong>Email:</strong> {values.primaryAuthor.email}</p>
                                    <p><strong>Institution:</strong> {values.primaryAuthor.institution}</p>
                                    <p><strong>Country:</strong> {values.primaryAuthor.country}</p>
                                </div>
                            </div>

                            {/* Additional Authors */}
                            {values.authors.length > 0 && (
                                <div className="border border-gray-300 rounded p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-[#204066]">Co-Authors ({values.authors.length})</h3>
                                        <button type="button" onClick={() => setCurrentStep(4)} className="text-[#12b48b] text-sm hover:underline">Edit</button>
                                    </div>
                                    {values.authors.map((author, idx) => (
                                        <p key={idx} className="text-sm">{author.firstName} {author.lastName} - {author.institution}</p>
                                    ))}
                                </div>
                            )}

                            {/* Files */}
                            <div className="border border-gray-300 rounded p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold text-[#204066]">Uploaded Files</h3>
                                    <button type="button" onClick={() => setCurrentStep(6)} className="text-[#12b48b] text-sm hover:underline">Edit</button>
                                </div>
                                <div className="text-sm space-y-1">
                                    <p><strong>Manuscript:</strong> {values.manuscriptFile?.name}</p>
                                    {values.coverLetter && <p><strong>Cover Letter:</strong> {values.coverLetter?.name}</p>}
                                </div>
                            </div>

                            {/* Reviewer (Optional) */}
                            {(values.reviewerFirstName || values.reviewerLastName || values.reviewerEmail) ? (
                                <div className="border border-gray-300 rounded p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-[#204066]">Suggested Reviewer</h3>
                                        <button type="button" onClick={() => setCurrentStep(7)} className="text-[#12b48b] text-sm hover:underline">Edit</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {(values.reviewerFirstName || values.reviewerLastName) && <p><strong>Name:</strong> {values.reviewerFirstName} {values.reviewerLastName}</p>}
                                        {values.reviewerEmail && <p><strong>Email:</strong> {values.reviewerEmail}</p>}
                                        {values.reviewerPhone && <p><strong>Phone:</strong> {values.reviewerPhone}</p>}
                                        {values.reviewerDesignation && <p><strong>Designation:</strong> {values.reviewerDesignation}</p>}
                                        {values.reviewerInstitution && <p><strong>Institution:</strong> {values.reviewerInstitution}</p>}
                                        {values.reviewerDepartment && <p><strong>Department:</strong> {values.reviewerDepartment}</p>}
                                        {values.reviewerSpecialisation && <p><strong>Specialisation:</strong> {values.reviewerSpecialisation}</p>}
                                        {(values.reviewerAddress || values.reviewerCity || values.reviewerState || values.reviewerCountry) && (
                                            <p><strong>Address:</strong> {[values.reviewerAddress, values.reviewerCity, values.reviewerState, values.reviewerCountry].filter(Boolean).join(', ')}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-[#204066]">Suggested Reviewer (Optional)</h3>
                                        <button type="button" onClick={() => setCurrentStep(7)} className="text-[#12b48b] text-sm hover:underline">Add</button>
                                    </div>
                                    <p className="text-sm text-gray-500 italic">No reviewer suggested</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 9: Copyright Form */}
                    {currentStep === 9 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaFileContract className="text-2xl text-[#204066]" />
                                <div>
                                    <h2 className="text-xl font-semibold text-[#204066]">Copyright Transfer Agreement</h2>
                                    <p className="text-sm text-gray-600">Please review and sign the copyright agreement</p>
                                </div>
                            </div>

                            {copyrightLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <FaSpinner className="animate-spin text-3xl text-[#12b48b]" />
                                    <span className="ml-3 text-gray-600">Loading copyright form...</span>
                                </div>
                            ) : copyrightTemplate ? (
                                <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-8">
                                    <FormRenderer
                                        schema={copyrightTemplate}
                                        data={{
                                            paper_title: values.paperTitle,
                                            journal: {
                                                title: fetchedJournalOptions?.flatMap(g => g.options).find(o => o.value == values.journalId)?.label || ''
                                            },
                                            authors: [values.primaryAuthor, ...values.authors].map((a, index) => ({
                                                id: index + 1,
                                                first_name: a.firstName,
                                                last_name: a.lastName,
                                                full_name: `${a.firstName} ${a.lastName}`,
                                                email: a.email,
                                                phone: a.phone,
                                                institution: a.institution,
                                                designation: a.designation || '',
                                                department: a.department || '',
                                                city: a.city || '',
                                                state: a.state || '',
                                                country: a.country || '',
                                                address: a.address || '',
                                                is_corresponding_author: a.isCorrespondingAuthor || false
                                            })),
                                            authors_formatted: [values.primaryAuthor, ...values.authors].map(a => `${a.firstName} ${a.lastName}`).join(', ')
                                        }}
                                        signatures={copyrightSignatures}
                                        onSign={handleSignClick}
                                    />

                                    {/* Signature Status */}
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            {Object.keys(copyrightSignatures).length > 0 ? (
                                                <div className="flex items-center gap-2 text-green-600">
                                                    <FaCheck />
                                                    <span className="text-sm font-medium">Copyright form signed ({Object.keys(copyrightSignatures).length} signature(s))</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-amber-600">
                                                    <FaPenNib />
                                                    <span className="text-sm font-medium">Please click on the signature boxes above to sign</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                                    <p className="text-red-600">Failed to load copyright template. Please go back and try again.</p>
                                    <button
                                        type="button"
                                        onClick={loadCopyrightTemplate}
                                        className="mt-4 bg-[#12b48b] hover:bg-[#0e9470] text-white px-4 py-2 rounded"
                                    >
                                        Retry Loading
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={currentStep === 1 || (isLoggedIn && currentStep === 2)}
                            className={`flex items-center gap-2 px-6 py-2 rounded font-bold ${(currentStep === 1 || (isLoggedIn && currentStep === 2))
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-500 hover:bg-gray-600 text-white'
                                }`}
                        >
                            <FaArrowLeft /> Previous
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Skip button for optional steps (Step 4: Additional Authors, Step 7: Reviewers) */}
                            {currentStep < totalSteps && (currentStep === 4 || currentStep === 7) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const nextStep = currentStep + 1;
                                        setCurrentStep(nextStep);
                                        // Load copyright template when moving to Step 9
                                        if (nextStep === 9) {
                                            loadCopyrightTemplate();
                                        }
                                    }}
                                    className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-bold"
                                >
                                    Skip <FaLongArrowAltRight />
                                </button>
                            )}

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentStep === 1 && !otpVerified) {
                                            setVerificationRequiredError("Please verify your email with OTP before proceeding");
                                            return;
                                        }

                                        validateForm().then((errors) => {
                                            const hasErrors = Object.keys(errors).length > 0;
                                            if (!hasErrors) {
                                                const nextStep = currentStep + 1;
                                                setCurrentStep(nextStep);
                                                // Load copyright template when moving to Step 9
                                                if (nextStep === 9) {
                                                    loadCopyrightTemplate();
                                                }
                                            } else {
                                                const errorFields = getTouchedFromErrors(errors);
                                                setTouched({ ...touched, ...errorFields });
                                                // message.error("Please fill all required fields correctly");
                                            }
                                        });
                                    }}
                                    className="flex items-center gap-2 bg-[#12b48b] hover:bg-[#0e9470] text-white px-6 py-2 rounded font-bold"
                                >
                                    Next <FaLongArrowAltRight />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={isFinalSubmitting || Object.keys(copyrightSignatures).length === 0}
                                    onClick={() => handleSubmit(values, { resetForm })}
                                    className={`flex items-center gap-2 bg-[#00a65a] hover:bg-[#008d4c] text-white px-6 py-2 rounded font-bold ${(isFinalSubmitting || Object.keys(copyrightSignatures).length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isFinalSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Manuscript <FaLongArrowAltRight />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Signature Modal */}
                    <Modal
                        title="E-Sign Copyright Form"
                        open={signModalVisible}
                        onOk={handleSignConfirm}
                        onCancel={() => setSignModalVisible(false)}
                        okText="Sign Document"
                        okButtonProps={{ className: 'bg-[#12b48b] hover:bg-[#0e9f7a]' }}
                        centered
                    >
                        <div className="py-6">
                            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100 flex items-start gap-3">
                                <FaFileContract className="text-blue-500 text-xl mt-1" />
                                <div className="text-sm text-blue-800">
                                    You are about to digitally sign the copyright transfer agreement for manuscript: <strong>{values.paperTitle}</strong>.
                                </div>
                            </div>

                            <p className="mb-2 font-semibold">Draw your signature below:</p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-3">
                                <SignatureCanvas
                                    ref={sigCanvasRef}
                                    penColor="black"
                                    canvasProps={{
                                        width: 450,
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
            )}
        </Formik>
    );
};

export default ManuscriptFormSteps;
