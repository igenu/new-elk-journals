import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUniversity, FaBuilding, FaListOl, FaTh, FaFileImage, FaFile, FaKeyboard, FaPencilAlt, FaCheckSquare, FaPlus, FaLongArrowAltRight, FaCity, FaTrash, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { Formik, Field, FieldArray, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import SignatureCanvas from 'react-signature-canvas';
import { manuscriptApi } from '../../services/api';
import { message } from "antd";



const countries = [
    "Select Country", "United Kingdom", "United States", "India", "Australia", "Canada", "Germany", "France", "other"
];

const IconInput = ({ icon: Icon, className, ...props }) => {
    const [field, meta] = useField(props);
    const hasError = meta.touched && meta.error;
    return (
        <div className="flex flex-col">
            <div className={`flex bg-gray-100 border rounded overflow-hidden ${hasError ? 'border-red-500' : 'border-gray-300'} ${className || ''}`}>
                <div className={`w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r ${hasError ? 'border-red-500' : 'border-gray-300'}`}>
                    <Icon className="text-sm" />
                </div>
                <input
                    {...field}
                    {...props}
                    className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700 placeholder-gray-500"
                />
            </div>
            {hasError && <div className="text-red-500 text-xs mt-1">{meta.error}</div>}
        </div>
    );
};

const ManuscriptForm = ({ fetchedJournalOptions }) => {
    const [captchaVal, setCaptchaVal] = useState("");
    const [captchaInput, setCaptchaInput] = useState(["", "", "", ""]);
    const sigCanvas = useRef({});

    useEffect(() => {
        setCaptchaVal(Math.floor(1000 + Math.random() * 9000).toString());
    }, []);

    const initialValues = {
        // Personal Info
        name: "",
        email: "",
        confirmEmail: "",
        phone: "",

        // General Info
        journal: "",
        paperTitle: "",
        wordCount: "",
        pageCount: "",
        tableCount: "", // Optional
        figureCount: "", // Optional

        // Dynamic Authors Array
        authors: [{
            firstName: "",
            lastName: "",
            email: "",
            confirmEmail: "",
            phone: "",
            country: "",
            institution: "",
            department: "",
            state: "",
            city: "",
            address: "",
            isCorrespondingAuthor: true
        }],

        // Reviewers
        revFirstName: "",
        revLastName: "",
        revEmail: "",
        revPhone: "",
        revInstitution: "",

        // Content
        keywords: "",
        abstract: "",

        // Files
        manuscriptFile: null,
        coverLetterFile: null,
    };

    const validationSchema = Yup.object().shape({
        // Personal Info
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        confirmEmail: Yup.string()
            .oneOf([Yup.ref('email'), null], 'Emails must match')
            .required('Confirm Email is required'),
        phone: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .min(10, 'Must be at least 10 digits')
            .max(15, 'Must be 15 digits or less')
            .required('Phone is required'),

        // General Info
        journal: Yup.string().required('Journal selection is required'),
        paperTitle: Yup.string().required('Manuscript Title is required'),
        wordCount: Yup.number().required('Word Count is required'),
        pageCount: Yup.number().required('Page Count is required'),
        tableCount: Yup.number(),
        figureCount: Yup.number(),

        // Authors Validation
        authors: Yup.array().of(
            Yup.object().shape({
                firstName: Yup.string().required('First Name is required'),
                lastName: Yup.string().required('Last Name is required'),
                email: Yup.string().email('Invalid email').required('Email is required'),
                confirmEmail: Yup.string()
                    .oneOf([Yup.ref('email'), null], 'Emails must match')
                    .required('Confirm Email is required'),
                phone: Yup.string()
                    .matches(/^[0-9]+$/, "Must be only digits")
                    .required('Phone is required'),
                country: Yup.string().required('Country is required').notOneOf(['Select Country'], 'Please select a country'),
                institution: Yup.string().required('Institution is required'),
                department: Yup.string().required('Department is required'),
                state: Yup.string().required('State is required'),
                city: Yup.string().required('City is required'),
                address: Yup.string().required('Address is required'),
            })
        ),

        // Reviewers
        revFirstName: Yup.string().required('First Name is required'),
        revLastName: Yup.string().required('Last Name is required'),
        revEmail: Yup.string().email('Invalid email').required('Email is required'),
        revPhone: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .required('Phone is required'),
        revInstitution: Yup.string().required('Institution is required'),

        // Content
        keywords: Yup.string().required('Keywords are required'),
        abstract: Yup.string().required('Abstract is required'),

        // Files
        manuscriptFile: Yup.mixed().required('Manuscript file is required'),
        // coverLetterFile: Yup.mixed().required('Cover Letter is required'),
    });

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const enteredCaptcha = captchaInput.join("");
        if (enteredCaptcha !== captchaVal) {
            message.error("Incorrect CAPTCHA");
            setSubmitting(false);
            return;
        }

        if (sigCanvas.current.isEmpty()) {
            message.error("Please provide a signature");
            setSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            // Append simple fields
            Object.keys(values).forEach(key => {
                if (key !== 'authors' && key !== 'manuscriptFile' && key !== 'coverLetterFile') {
                    formData.append(key, values[key]);
                }
            });

            // Append Authors as JSON
            formData.append('authors', JSON.stringify(values.authors));

            // Append Files
            if (values.manuscriptFile) formData.append('manuscriptFile', values.manuscriptFile);
            if (values.coverLetterFile) formData.append('coverLetterFile', values.coverLetterFile);

            // Append Signature
            // Get the canvas signature as base64 or blob
            // API expects file usually, so let's convert base64 to blob
            const dataURL = sigCanvas.current.toDataURL('image/png');
            const blob = await (await fetch(dataURL)).blob();
            formData.append('signature', blob, 'signature.png');


            await manuscriptApi.submit(formData);
            message.success("Manuscript submitted successfully!");
            resetForm();
            sigCanvas.current.clear();
            setCaptchaVal(Math.floor(1000 + Math.random() * 9000).toString());
            setCaptchaInput(["", "", "", ""]);
        } catch (error) {
            console.error(error);
            message.error("Failed to submit manuscript.");
        } finally {
            setSubmitting(false);
        }
    };

    const FormSection = ({ legend, children, className = "" }) => (
        <div className={`relative border border-gray-300 mt-8 p-6 pt-8 ${className}`}>
            <span className="absolute -top-3 right-4 bg-white px-2 text-[#204066] text-sm font-normal">
                {legend}
            </span>
            {children}
        </div>
    );

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, isSubmitting, handleSubmit, errors, touched }) => (
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* 1. PERSONAL INFORMATION */}
                    <FormSection legend="Personal Information:">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <IconInput icon={FaUser} type="text" name="name" placeholder="Name *" />
                            <IconInput icon={FaEnvelope} type="email" name="email" placeholder="Email ID *" />
                            <IconInput icon={FaEnvelope} type="email" name="confirmEmail" placeholder="Confirm E-mail Id *" />
                            <IconInput icon={FaPhone} type="text" name="phone" placeholder="Contact No *" />
                        </div>
                    </FormSection>

                    {/* 2. GENERAL INFORMATION */}
                    <FormSection legend="General Information:">
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <div className={`flex bg-gray-100 border rounded overflow-hidden ${touched.journal && errors.journal ? 'border-red-500' : 'border-gray-300'}`}>
                                    <div className={`w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r ${touched.journal && errors.journal ? 'border-red-500' : 'border-gray-300'}`}>
                                        <FaUser className="text-sm" />
                                    </div>
                                    <Field as="select"
                                        name="journal"
                                        className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700"
                                    >
                                        <option value="">Select Journal *</option>
                                        {fetchedJournalOptions?.length > 0 && fetchedJournalOptions?.map((group, idx) => (
                                            <optgroup key={idx} label={group.label}>
                                                {group?.options && group?.options?.map((opt, optIdx) => (
                                                    <option key={optIdx} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </Field>
                                </div>
                                <ErrorMessage name="journal" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <IconInput icon={FaPencilAlt} type="text" name="paperTitle" placeholder="Manuscript Title*" />

                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                <IconInput icon={FaFile} type="number" name="wordCount" placeholder="No of Words *" />
                                <IconInput icon={FaListOl} type="number" name="pageCount" placeholder="No of Pages *" />
                                <IconInput icon={FaTh} type="number" name="tableCount" placeholder="No of Tables" />
                                <IconInput icon={FaFileImage} type="number" name="figureCount" placeholder="No of Figures" />
                            </div>
                        </div>
                    </FormSection>

                    {/* AUTHORS SECTION */}
                    <FieldArray name="authors">
                        {({ push, remove }) => (
                            <div>
                                {values?.authors?.length > 0 && values?.authors?.map((author, index) => (
                                    <div key={index}>
                                        <div className="mt-8">
                                            <div className="bg-[#204066] text-white py-2 px-4 rounded-sm inline-block font-bold text-sm tracking-wide">
                                                {index === 0 ? "Primary Author" : "Author Information"}
                                            </div>
                                        </div>

                                        <FormSection legend="Author(s) Information:">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <IconInput icon={FaUser} type="text" name={`authors.${index}.firstName`} placeholder="First Name *" />
                                                <IconInput icon={FaUser} type="text" name={`authors.${index}.lastName`} placeholder="Last Name *" />

                                                <IconInput icon={FaEnvelope} type="email" name={`authors.${index}.email`} placeholder="Email ID *" />
                                                <IconInput icon={FaEnvelope} type="email" name={`authors.${index}.confirmEmail`} placeholder="Confirm E-mail Id *" />

                                                <IconInput icon={FaPhone} type="text" name={`authors.${index}.phone`} placeholder="Contact No *" />

                                                <div className="flex flex-col">
                                                    <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                                        <div className="w-10 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                                            <MdLocationOn className="text-sm" />
                                                        </div>
                                                        <Field as="select"
                                                            name={`authors.${index}.country`}
                                                            className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700"
                                                        >
                                                            {countries?.length > 0 && countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                                        </Field>
                                                    </div>
                                                    <ErrorMessage name={`authors.${index}.country`} component="div" className="text-red-500 text-xs mt-1" />
                                                </div>

                                                <IconInput icon={MdSchool} type="text" name={`authors.${index}.institution`} placeholder="Institution *" />
                                                <IconInput icon={FaBuilding} type="text" name={`authors.${index}.department`} placeholder="Department *" />

                                                <IconInput icon={FaUniversity} type="text" name={`authors.${index}.state`} placeholder="State/Province *" />
                                                <IconInput icon={FaCity} type="text" name={`authors.${index}.city`} placeholder="City *" />

                                                <div className="md:col-span-2">
                                                    <IconInput icon={FaMapMarkerAlt} type="text" name={`authors.${index}.address`} placeholder="Address *" />
                                                </div>

                                                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                                    <Field type="checkbox" name={`authors.${index}.isCorrespondingAuthor`} className="h-4 w-4 text-blue-600" />
                                                    <span className="text-xs text-[#204066]">This person is the formal Corresponding Author as denoted on the title page of the manuscript</span>
                                                </div>
                                            </div>
                                        </FormSection>

                                        {/* Remove Button for added authors */}
                                        {index > 0 && (
                                            <div className="mt-2">
                                                <button type="button" onClick={() => remove(index)} className="bg-[#d9534f] hover:bg-[#c9302c] text-white text-xs font-bold py-2 px-4 rounded shadow-sm flex items-center gap-2">
                                                    <FaTrash /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* ADD MORE AUTHORS BUTTON */}
                                <div className="mt-4">
                                    <button type="button" onClick={() => push({
                                        firstName: "", lastName: "", email: "", confirmEmail: "", phone: "", country: "", institution: "",
                                        department: "", state: "", city: "", address: "", isCorrespondingAuthor: false
                                    })} className="bg-[#6dbd63] hover:bg-[#5da554] text-white text-xs font-bold py-2 px-4 rounded shadow-sm flex items-center gap-2">
                                        <FaPlus /> Add More Authors
                                    </button>
                                </div>
                            </div>
                        )}
                    </FieldArray>

                    {/* 5. REVIEWERS */}
                    <FormSection legend="Reviewers:">
                        <p className="text-xs text-gray-500 mb-4 px-1">
                            Suggest a reviewer belonging to the similar research background...
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <IconInput icon={FaUser} type="text" name="revFirstName" placeholder="First name *" />
                            <IconInput icon={FaUser} type="text" name="revLastName" placeholder="Last Name *" />
                            <IconInput icon={FaEnvelope} type="email" name="revEmail" placeholder="Email *" />
                            <IconInput icon={FaPhone} type="text" name="revPhone" placeholder="Contact Number *" />
                            <div className="md:col-span-1">
                                <IconInput icon={MdSchool} type="text" name="revInstitution" placeholder="Institution *" />
                            </div>
                        </div>
                    </FormSection>

                    {/* Content Section */}
                    <FormSection legend="Content:">
                        <p className="text-xs text-gray-500 mb-4 px-1">
                            Note: Please narrow down your Research Area...
                        </p>
                        <div className="space-y-4">
                            <IconInput icon={FaKeyboard} type="text" name="keywords" placeholder="Keywords *" />
                            <div className="flex flex-col">
                                <div className={`flex bg-gray-100 border rounded overflow-hidden ${touched.abstract && errors.abstract ? 'border-red-500' : 'border-gray-300'}`}>
                                    <div className={`w-10 flex items-start pt-3 justify-center bg-gray-200 text-gray-500 border-r h-32 ${touched.abstract && errors.abstract ? 'border-red-500' : 'border-gray-300'}`}>
                                        <FaFile className="text-sm" />
                                    </div>
                                    <Field as="textarea" name="abstract" placeholder="Abstract *" className="flex-1 px-3 py-2 bg-gray-100 focus:bg-white focus:outline-none text-sm text-gray-700 h-32 resize-none" />
                                </div>
                                <ErrorMessage name="abstract" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>
                    </FormSection>

                    {/* Files Upload: */}
                    <FormSection legend="Files Upload:">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">Upload Manuscript*</label>
                                <div className={`flex bg-gray-100 border rounded overflow-hidden ${touched.manuscriptFile && errors.manuscriptFile ? 'border-red-500' : 'border-gray-300'}`}>
                                    <div className={`w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r ${touched.manuscriptFile && errors.manuscriptFile ? 'border-red-500' : 'border-gray-300'}`}>
                                        <FaCloudUploadAlt className="text-sm" />
                                    </div>
                                    <input
                                        type="file"
                                        name="manuscriptFile"
                                        onChange={(event) => setFieldValue("manuscriptFile", event.currentTarget.files[0])}
                                        className="flex-1 px-3 py-1 bg-gray-100 text-sm text-gray-600"
                                    />
                                </div>
                                <ErrorMessage name="manuscriptFile" component="div" className="text-red-500 text-xs mt-1" />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 mb-1 block">Cover Letter For Manuscript</label>
                                <div className="flex bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                    <div className="w-14 flex items-center justify-center bg-gray-200 text-gray-500 border-r border-gray-300">
                                        <FaFile className="text-sm" />
                                    </div>
                                    <input
                                        type="file"
                                        name="coverLetterFile"
                                        onChange={(event) => setFieldValue("coverLetterFile", event.currentTarget.files[0])}
                                        className="flex-1 px-3 py-1 bg-gray-100 text-sm text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label className="text-xs text-gray-600 mb-1 block">Upload your signature*</label>

                                <div className="mb-1">
                                    <p className="text-xs text-blue-600 cursor-pointer flex items-center gap-1"><FaPencilAlt /> Draw Here</p>
                                </div>

                                <div className="border border-gray-400 h-24 bg-white relative">
                                    <SignatureCanvas penColor='black'
                                        canvasProps={{ className: 'sigCanvas w-full h-full' }}
                                        ref={sigCanvas} />
                                </div>

                                <div className="mt-1">
                                    <div onClick={clearSignature} className="text-xs text-blue-600 cursor-pointer flex items-center gap-1">
                                        <FaPencilAlt /> Clear Signature
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* CAPTCHA & SUBMIT */}
                    <div className="flex justify-between items-end mt-8">
                        <div className="flex gap-2 items-center">
                            {[0, 1, 2, 3].map((idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    maxLength="1"
                                    className="w-10 h-10 border border-black text-center text-lg"
                                    onChange={(e) => {
                                        const newVal = [...captchaInput];
                                        newVal[idx] = e.target.value;
                                        setCaptchaInput(newVal);
                                    }}
                                />
                            ))}
                            <div className="bg-[#4A6983] text-white px-3 py-2 text-sm font-bold min-w-[60px] text-center">{captchaVal}</div>
                            <div className="text-[10px] text-gray-600">Enter Code As Seen</div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold py-2 px-6 rounded shadow flex items-center gap-3 transition-all ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin text-lg" />
                                    <span>SUBMITTING...</span>
                                </>
                            ) : (
                                <>
                                    <span>SUBMIT</span>
                                    <FaLongArrowAltRight />
                                </>
                            )}
                        </button>
                    </div>

                </form>
            )}
        </Formik>
    );
};

export default ManuscriptForm;
