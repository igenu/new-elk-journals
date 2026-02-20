import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUniversity, FaBuilding, FaListOl, FaTh, FaFileImage, FaFileAlt, FaKeyboard, FaPencilAlt, FaCheckSquare, FaPlus, FaLongArrowAltRight, FaCity, FaTrash, FaLock, FaGlobe, FaCloudUploadAlt } from "react-icons/fa";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { countries, specializations, journalOptions } from '../../data/signUpData';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { message } from 'antd';
import Swal from 'sweetalert2';
import { authApi, applicationApi, journalCategoryApi } from '../../services/api';
import CodeEntryInput from '../../components/CodeEntryInput';
import NewsWidget from "../../components/Website/NewsWidget";
import SEO from '../../components/SEO';
// import LoginForm from '../../components/LoginForm'; // Removed as we navigate to /login page now


// Reusable Components matching ManuscriptForm style
const IconInput = ({ icon: Icon, error, touched, ...props }) => (
    <div className="flex flex-col w-full">
        <div className={`flex bg-gray-100 border ${error && touched ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
            <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300 p-3">
                <Icon className="text-sm" />
            </div>
            <input
                {...props}
                className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            />
        </div>
        {error && touched && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
);

const SelectInput = ({ icon: Icon, options, error, touched, children, ...props }) => (
    <div className="flex flex-col w-full">
        <div className={`flex bg-gray-100 border ${error && touched ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
            <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300 p-3">
                <Icon className="text-sm" />
            </div>
            <select
                {...props}
                className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500"
            >
                {children}
            </select>
        </div>
        {error && touched && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
);

const FormSection = ({ title, children }) => (
    <fieldset className="mb-8 border border-gray-300 px-6 pb-6  rounded">
        <legend className="px-2 text-[#12b48b] font-medium text-lg">
            {title}
        </legend>
        {children}
    </fieldset>
);



const BecomeAnEditor = () => {
    // const [isLoginView, setIsLoginView] = useState(false); // Removed inline login state
    const [activeTab, setActiveTab] = useState('author');
    const [captcha, setCaptcha] = useState(Math.floor(1000 + Math.random() * 9000));
    const [fetchedJournalOptions, setFetchedJournalOptions] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJournalOptions = async () => {
            try {
                const response = await journalCategoryApi.getWithJournals();
                if (response.data && Array.isArray(response.data)) {
                    const options = response.data
                        .filter(cat => cat.journals && cat.journals.length > 0)
                        .map(cat => ({
                            label: cat.title,
                            options: cat.journals.map(journal => ({
                                value: journal.id,
                                label: journal.title
                            }))
                        }));
                    setFetchedJournalOptions(options);
                }
            } catch (error) {
                console.error("Failed to fetch journal options", error);
                message.error("Failed to load journal options");
            }
        };
        fetchJournalOptions();
    }, []);

    // Validation Schemas
    // Common validation for shared fields
    const commonValidation = {
        firstName: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'Name cannot contain numbers')
            .required('First Name is required'),
        lastName: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'Name cannot contain numbers')
            .required('Last Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        confirmEmail: Yup.string()
            .oneOf([Yup.ref('email'), null], 'Emails must match')
            .required('Confirm Email is required'),
        password: Yup.string().min(6, 'Password too short').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        qualification: Yup.string().required('Qualification is required'),
        specialization: Yup.string(),
        institute: Yup.string().required('Institute/University is required'),
        captchaInput: Yup.string()
            .required('Please enter the security code')
            .test('captcha-match', 'Incorrect code', function (value) {
                return String(value) === String(captcha);
            })
    };

    const authorSchema = Yup.object().shape({
        ...commonValidation,
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        pincode: Yup.string()
            .required('Pincode is required')
            .matches(/^[0-9]+$/, 'Pincode must be digits only')
            .min(6, 'Pincode must be 6 digits')
            .max(6, 'Pincode must be 6 digits'),
        organization: Yup.string().required('Organization Name is required'),
        contactNumber: Yup.string()
            .matches(/^[0-9]*$/, 'Contact number must be numbers only')
            .min(10, 'Must be at least 10 digits')
            .max(15, 'Must be at most 15 digits'),
        altContactNumber: Yup.string()
            .matches(/^[0-9]*$/, 'Alternative contact number must be numbers only')
            .nullable()
    });

    const editorSchema = Yup.object().shape({
        ...commonValidation,
        journal: Yup.string().required('Please select a journal'),
        title: Yup.string(),
        file: Yup.mixed()
            .required('CV is required')
            .test('fileFormat', 'Unsupported Format. Only PDF and Word allowed', (value) => {
                if (!value) return false;
                return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
            })
    });

    const authorFormik = useFormik({
        initialValues: {
            firstName: '', lastName: '', email: '', confirmEmail: '',
            password: '', confirmPassword: '',
            address: '', city: '', state: '', landMark: '', pincode: '', country: '',
            isd: '', contactNumber: '', altContactNumber: '',
            qualification: '', specialization: '', institute: '',
            jobTitle: '', organization: '', orgType: '',
            captchaInput: ''
        },
        validationSchema: authorSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Prepare data for API - adjust fields as needed by backend
                const payload = {
                    ...values,
                    role: 'author'
                };
                await authApi.register(payload);
                message.success('Author registration successful!');
                resetForm();
                setCaptcha(Math.floor(1000 + Math.random() * 9000));
                navigate('/thank-you');
            } catch (error) {
                console.error(error);
                // Extract error message from backend or use default
                const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
                // Also check if stack is present as user showed example, but usually we just want the message for the user.

                Swal.fire({
                    icon: 'error',
                    title: 'Registration Error',
                    text: errorMessage,
                    confirmButtonColor: '#12b48b'
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const editorFormik = useFormik({
        initialValues: {
            journal: '', title: 'Dr.',
            firstName: '', lastName: '', email: '', confirmEmail: '',
            password: '', confirmPassword: '',
            qualification: '', specialization: '', institute: '',
            file: null,
            captchaInput: ''
        },
        validationSchema: editorSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const formData = new FormData();
                Object.keys(values).forEach(key => {
                    if (key === 'file') {
                        formData.append('file', values.file);
                    } else {
                        formData.append(key, values[key]);
                    }
                });

                await applicationApi.becomeEditor(formData);
                message.success('Editor application submitted successfully!');
                resetForm();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setCaptcha(Math.floor(1000 + Math.random() * 9000));
                navigate('/thank-you'); // Redirect to thank you page
            } catch (error) {
                console.error(error);
                const errorMessage = error.response?.data?.message || 'Application failed. Please try again.';

                Swal.fire({
                    icon: 'error',
                    title: 'Submission Error',
                    text: errorMessage,
                    confirmButtonColor: '#12b48b'
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleAuthorSubmit = (e) => {
        e.preventDefault();
        authorFormik.handleSubmit();
    };

    const handleEditorSubmit = (e) => {
        e.preventDefault();
        editorFormik.handleSubmit();
    };


    return (
        <>
            <SEO 
                title="Authors and Editors Registration - ELK Asia Pacific Journals"
                description="Authors and Editors Registration - ELK Asia Pacific Journals"
            />
            <div className="py-8 bg-white min-h-screen">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT COLUMN - Main Content */}
                    <div className="lg:col-span-3">
                        {/* {isLoginView ? (
                            <LoginForm
                                onCancel={() => setIsLoginView(false)}
                            />
                        ) : ( */}
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl text-[#12b48b] font-normal mb-2 uppercase">ELK’s Sign Up</h1>
                                <p className="text-sm text-gray-600">Just spend a minute in filling the details below to create your account with us.</p>
                                <h2 className="text-xl text-[#12b48b] font-normal mt-6 mb-4 uppercase">SIGN UP</h2>
                            </div>

                            {/* Tabs */}
                            <div className="flex mb-6">
                                <button
                                    onClick={() => setActiveTab('author')}
                                    className={`flex-1 py-3 text-center text-lg font-medium relative ${activeTab === 'author'
                                        ? 'bg-[#12b48b] text-white'
                                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                        }`}
                                >
                                    Author
                                    {activeTab === 'author' && (
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-[#12b48b] border-r-[10px] border-r-transparent"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('editor')}
                                    className={`flex-1 py-3 text-center text-lg font-medium relative ${activeTab === 'editor'
                                        ? 'bg-[#12b48b] text-white'
                                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                        }`}
                                >
                                    Editor
                                    {activeTab === 'editor' && (
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-[#12b48b] border-r-[10px] border-r-transparent"></div>
                                    )}
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="mt-8">
                                {activeTab === 'author' ? (
                                    <div>
                                        <div className="text-sm text-gray-600 mb-6 space-y-2">
                                            <p>In order to submit your manuscript online, kindly register as an author using the form given below. Once registered, you can submit the manuscript online through your author’s panel. Your Author Account will help you to:</p>
                                            <ul className="list-none space-y-1">
                                                <li className="flex items-center gap-2"><FaCheckSquare className="text-gray-500 text-xs" /> Conveniently complete 1-step Online manuscript submission</li>
                                                <li className="flex items-center gap-2"><FaCheckSquare className="text-gray-500 text-xs" /> 'Save as draft' option to save the entered manuscript details and submit later</li>
                                                <li className="flex items-center gap-2"><FaCheckSquare className="text-gray-500 text-xs" /> Easily track the status of manuscript publication process</li>
                                            </ul>
                                            <p>Please fill in the asked details below. In case of any doubts or inconvenience, you can drop an email at <a href="mailto:support@elkjournals.com" className="text-blue-600 hover:underline">support@elkjournals.com</a>.</p>
                                        </div>
                                        <form className="space-y-6" onSubmit={handleAuthorSubmit}>
                                            <FormSection title="Personal Details:">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <IconInput icon={FaUser} type="text" placeholder="First Name *" {...authorFormik.getFieldProps('firstName')} error={authorFormik.errors.firstName} touched={authorFormik.touched.firstName} />
                                                    <IconInput icon={FaUser} type="text" placeholder="Last Name *" {...authorFormik.getFieldProps('lastName')} error={authorFormik.errors.lastName} touched={authorFormik.touched.lastName} />
                                                    <IconInput icon={FaEnvelope} type="email" placeholder="Email ID *" {...authorFormik.getFieldProps('email')} error={authorFormik.errors.email} touched={authorFormik.touched.email} />
                                                    <IconInput icon={FaEnvelope} type="email" placeholder="Confirm Email ID *" {...authorFormik.getFieldProps('confirmEmail')} error={authorFormik.errors.confirmEmail} touched={authorFormik.touched.confirmEmail} />
                                                    <IconInput icon={FaLock} type="password" placeholder="Password *" {...authorFormik.getFieldProps('password')} error={authorFormik.errors.password} touched={authorFormik.touched.password} />
                                                    <IconInput icon={FaLock} type="password" placeholder="Confirm Password *" {...authorFormik.getFieldProps('confirmPassword')} error={authorFormik.errors.confirmPassword} touched={authorFormik.touched.confirmPassword} />
                                                </div>
                                            </FormSection>

                                            <FormSection title="Contact Details:">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex flex-col w-full">
                                                        <div className={`bg-gray-100 border ${authorFormik.errors.address && authorFormik.touched.address ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden flex`}>
                                                            <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                                                <FaMapMarkerAlt className="text-sm" />
                                                            </div>
                                                            <textarea placeholder="Address *"
                                                                {...authorFormik.getFieldProps('address')}
                                                                className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700 h-10 resize-none pt-2"></textarea>
                                                        </div>
                                                        {authorFormik.errors.address && authorFormik.touched.address && <div className="text-red-500 text-xs mt-1">{authorFormik.errors.address}</div>}
                                                    </div>
                                                    <IconInput icon={MdLocationOn} type="text" placeholder="City *" {...authorFormik.getFieldProps('city')} error={authorFormik.errors.city} touched={authorFormik.touched.city} />
                                                    <IconInput icon={FaMapMarkerAlt} type="text" placeholder="State *" {...authorFormik.getFieldProps('state')} error={authorFormik.errors.state} touched={authorFormik.touched.state} />
                                                    <IconInput icon={FaMapMarkerAlt} type="text" placeholder="Near Land Mark *" {...authorFormik.getFieldProps('landMark')} />
                                                    <IconInput icon={FaMapMarkerAlt} type="text" placeholder="Pincode *" {...authorFormik.getFieldProps('pincode')} error={authorFormik.errors.pincode} touched={authorFormik.touched.pincode} />
                                                    <SelectInput icon={FaGlobe} placeholder="Select Country" {...authorFormik.getFieldProps('country')} error={authorFormik.errors.country} touched={authorFormik.touched.country}>
                                                        <option value="">Please Select</option>
                                                        {countries.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                                                    </SelectInput>
                                                    <IconInput icon={FaPhone} type="text" placeholder="ISD" readOnly className="w-1/3" {...authorFormik.getFieldProps('isd')} />
                                                    <IconInput icon={FaPhone} type="text" placeholder="Contact Number" {...authorFormik.getFieldProps('contactNumber')} error={authorFormik.errors.contactNumber} touched={authorFormik.touched.contactNumber} />
                                                    <IconInput icon={FaPhone} type="text" placeholder="Alternative Contact Number" {...authorFormik.getFieldProps('altContactNumber')} />
                                                </div>
                                            </FormSection>

                                            <FormSection title="Educational Details:">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <IconInput icon={MdSchool} type="text" placeholder="Educational Qualification *" {...authorFormik.getFieldProps('qualification')} error={authorFormik.errors.qualification} touched={authorFormik.touched.qualification} />
                                                    <SelectInput icon={FaListOl} {...authorFormik.getFieldProps('specialization')} error={authorFormik.errors.specialization} touched={authorFormik.touched.specialization}>
                                                        <option value="">Please Select Area of Specialisation</option>
                                                        {specializations?.length > 0 && specializations.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                                    </SelectInput>
                                                    <div className="md:col-span-2">
                                                        <IconInput icon={FaUniversity} type="text" placeholder="Institute/ University *" {...authorFormik.getFieldProps('institute')} error={authorFormik.errors.institute} touched={authorFormik.touched.institute} />
                                                    </div>
                                                </div>
                                            </FormSection>

                                            <FormSection title="Your organization, role and field of interest:">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <IconInput icon={FaUser} type="text" placeholder="Job Title" {...authorFormik.getFieldProps('jobTitle')} />
                                                    <IconInput icon={FaBuilding} type="text" placeholder="Organization Name *" {...authorFormik.getFieldProps('organization')} error={authorFormik.errors.organization} touched={authorFormik.touched.organization} />
                                                    <div className="md:col-span-2">
                                                        <SelectInput icon={FaListOl} {...authorFormik.getFieldProps('orgType')}>
                                                            <option value="">Select your organization type</option>
                                                            <option value="Corporate">Corporate</option>
                                                            <option value="University">University</option>
                                                            <option value="Institute">Institute</option>
                                                            <option value="other">Other</option>
                                                        </SelectInput>
                                                    </div>
                                                </div>
                                            </FormSection>

                                            <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
                                                <div className="flex items-center gap-4">
                                                    <CodeEntryInput
                                                        length={4}


                                                        key={captcha}
                                                        onChange={(val) => authorFormik.setFieldValue('captchaInput', val)}
                                                    />
                                                    <div className="bg-[#567a9a] text-white px-4 py-3 font-bold text-xl tracking-widest rounded self-start h-12 flex items-center">
                                                        {captcha}
                                                    </div>
                                                </div>
                                                <p className="text-[#e85a4f] text-sm font-medium self-end pb-4">(*) represents mandatory fields</p>
                                            </div>

                                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    <a href="/forget-password" className="flex items-center gap-1 hover:text-[#12b48b]"><FaUser className="text-gray-400" /> Find My Account</a>
                                                    <span>|</span>
                                                    <a href="/login" className="flex items-center gap-1 hover:text-[#12b48b]" onClick={() => navigate("/login")}><FaLock className="text-gray-400" /> Login</a>
                                                </div>
                                                <button type="submit" disabled={authorFormik.isSubmitting} className="bg-[#12b48b] text-white px-10 py-2 rounded-full shadow hover:bg-[#0e9f7a] flex items-center gap-2 font-bold transition-colors disabled:opacity-50">
                                                    {authorFormik.isSubmitting ? 'SUBMITTING...' : 'SUBMIT'} <FaLongArrowAltRight />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-6">Your public profile at ELK Asia Pacific Journals will speak for your contributions to the research community. So, be our valuable resource and solicit your achievements on our editorial board.<br /><br />Just spend a minute in filling the details below to create your account with us.</p>

                                        <form className="space-y-6" onSubmit={handleEditorSubmit}>
                                            <FormSection title="Personal Details:">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <SelectInput icon={FaFileAlt} {...editorFormik.getFieldProps('journal')} error={editorFormik.errors.journal} touched={editorFormik.touched.journal} >
                                                        <option value="">Select Journal</option>
                                                        {fetchedJournalOptions?.length > 0 && fetchedJournalOptions.map((group, i) => (
                                                            <optgroup key={i} label={group.label}>
                                                                {group.options?.length > 0 && group.options.map((opt, j) => (
                                                                    <option key={j} value={opt.value}>{opt.label}</option>
                                                                ))}
                                                            </optgroup>
                                                        ))}
                                                    </SelectInput>
                                                    <SelectInput icon={FaUser} {...editorFormik.getFieldProps('title')} >
                                                        <option value="Dr.">Dr</option>
                                                        <option value="Prof.">Prof</option>
                                                        <option value="Er.">Er</option>
                                                    </SelectInput>
                                                    <IconInput icon={FaUser} type="text" placeholder="First Name *" {...editorFormik.getFieldProps('firstName')} error={editorFormik.errors.firstName} touched={editorFormik.touched.firstName} />
                                                    <IconInput icon={FaUser} type="text" placeholder="Last Name *" {...editorFormik.getFieldProps('lastName')} error={editorFormik.errors.lastName} touched={editorFormik.touched.lastName} />
                                                    <IconInput icon={FaEnvelope} type="email" placeholder="Email ID *" {...editorFormik.getFieldProps('email')} error={editorFormik.errors.email} touched={editorFormik.touched.email} />
                                                    <IconInput icon={FaEnvelope} type="email" placeholder="Confirm Email ID *" {...editorFormik.getFieldProps('confirmEmail')} error={editorFormik.errors.confirmEmail} touched={editorFormik.touched.confirmEmail} />
                                                    <IconInput icon={FaLock} type="password" placeholder="Password *" {...editorFormik.getFieldProps('password')} error={editorFormik.errors.password} touched={editorFormik.touched.password} />
                                                    <IconInput icon={FaLock} type="password" placeholder="Confirm Password *" {...editorFormik.getFieldProps('confirmPassword')} error={editorFormik.errors.confirmPassword} touched={editorFormik.touched.confirmPassword} />
                                                </div>
                                            </FormSection>

                                            <FormSection title="Educational Details:">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <IconInput icon={MdSchool} type="text" placeholder="Educational Qualification *" {...editorFormik.getFieldProps('qualification')} error={editorFormik.errors.qualification} touched={editorFormik.touched.qualification} />
                                                    <SelectInput icon={FaListOl} {...editorFormik.getFieldProps('specialization')}>
                                                        <option value="">Please Select</option>
                                                        {specializations.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                                    </SelectInput>
                                                    <div className="md:col-span-2">
                                                        <IconInput icon={FaUniversity} type="text" placeholder="Institute/ University *" {...editorFormik.getFieldProps('institute')} error={editorFormik.errors.institute} touched={editorFormik.touched.institute} />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <div className={`flex flex-col w-full`}>
                                                            <div className={`flex bg-gray-100 border ${editorFormik.errors.file && editorFormik.touched.file ? 'border-red-500' : 'border-gray-300'} rounded overflow-hidden`}>
                                                                <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                                                    <FaCloudUploadAlt className="text-sm" />
                                                                </div>
                                                                <div className="flex-1 px-3 py-2 bg-gray-100 flex items-center justify-between">
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx"
                                                                        ref={fileInputRef}
                                                                        className="text-sm text-gray-600 w-full"
                                                                        onChange={(event) => {
                                                                            editorFormik.setFieldValue("file", event.currentTarget.files[0]);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {editorFormik.errors.file && editorFormik.touched.file && <div className="text-red-500 text-xs mt-1">{editorFormik.errors.file}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-red-600 font-bold mt-2">Note : Click upload to attach your file. Adobe Pdf (or) Word Document Format Only</p>
                                            </FormSection>


                                            <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
                                                <div className="flex items-center gap-4">
                                                    <CodeEntryInput
                                                        length={4}
                                                        key={captcha}
                                                        onChange={(val) => editorFormik.setFieldValue('captchaInput', val)}
                                                    />
                                                    <div className="bg-[#567a9a] text-white px-4 py-3 font-bold text-xl tracking-widest rounded self-start h-12 flex items-center">
                                                        {captcha}
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-right self-end pb-4">
                                                    <p className="text-[#e85a4f] text-sm font-medium">(*) represents mandatory fields</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    <Link to="/forget-password" className="flex items-center gap-1 hover:text-[#12b48b]"><FaUser className="text-gray-400" /> Find My Account</Link>
                                                    <span>|</span>
                                                    <Link to="/login" className="flex items-center gap-1 hover:text-[#12b48b]"><FaLock className="text-gray-400" /> Login</Link>
                                                </div>
                                                <button type="submit" disabled={editorFormik.isSubmitting} className="bg-[#12b48b] text-white px-10 py-2 rounded-full shadow hover:bg-[#0e9f7a] flex items-center gap-2 font-bold transition-colors disabled:opacity-50">
                                                    {editorFormik.isSubmitting ? 'SUBMITTING...' : 'SUBMIT'} <FaLongArrowAltRight />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </>
                        {/* )} */}
                    </div>

                    {/* RIGHT COLUMN - Sidebar */}
                    <div className="lg:col-span-1">
                        <NewsWidget />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default BecomeAnEditor